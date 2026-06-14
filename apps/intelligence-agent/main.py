from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models, database, agent
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Intelligence Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Fetch last 10 messages for this session
    history = db.query(models.Message).filter(models.Message.session_id == request.session_id).order_by(models.Message.timestamp.desc()).limit(10).all()
    history.reverse() # chronological order
    
    # 2. Save user message
    user_msg = models.Message(session_id=request.session_id, role="user", content=request.message)
    db.add(user_msg)
    db.commit()
    
    # 3. Process with Gemini & MCPs
    agent_result = agent.process_chat(request.message, history)
    
    # 4. Save model response
    model_msg = models.Message(session_id=request.session_id, role="model", content=agent_result["response"])
    db.add(model_msg)
    db.commit()
    
    return {
        "response": agent_result["response"],
        "steps": agent_result.get("steps", [])
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
