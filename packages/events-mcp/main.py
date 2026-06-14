from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from datetime import datetime, timedelta

app = FastAPI(title="Events MCP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_EVENTS = []
clubs = ["Coding Club", "Robotics Society", "Debate Team", "Drama Club", "Music Society"]
types = ["Workshop", "Competition", "Meeting", "Performance"]
venues = ["Main Auditorium", "Room 101", "Lab 3", "Student Center"]

for i in range(1, 51):
    event_date = datetime.now() + timedelta(days=i*2)
    MOCK_EVENTS.append({
        "id": i,
        "name": f"Event {i} - {clubs[i % len(clubs)]}",
        "date": event_date.strftime("%Y-%m-%d %H:%M"),
        "venue": venues[i % len(venues)],
        "club": clubs[i % len(clubs)],
        "type": types[i % len(types)]
    })

MOCK_EVENTS[0] = {"id": 1, "name": "Tech Fest 2026", "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d 10:00"), "venue": "Main Auditorium", "club": "Coding Club", "type": "Competition"}
MOCK_EVENTS[1] = {"id": 2, "name": "Python Workshop", "date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d 14:00"), "venue": "Lab 3", "club": "Coding Club", "type": "Workshop"}

class QueryRequest(BaseModel):
    query: str

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/query")
def query_events(request: QueryRequest):
    try:
        data = json.loads(request.query)
        action = data.get("action")
        params = data.get("params", {})
        
        if action == "get_upcoming_events":
            limit = params.get("limit", 5)
            # sort by date
            sorted_events = sorted(MOCK_EVENTS, key=lambda x: x["date"])
            return {"events": sorted_events[:limit], "nextEvent": sorted_events[0] if sorted_events else None}
            
        elif action == "search_event":
            keyword = params.get("keyword", "").lower()
            results = [e for e in MOCK_EVENTS if keyword in e["name"].lower() or keyword in e["type"].lower()]
            return {"events": results, "count": len(results)}
            
        elif action == "get_by_club":
            club = params.get("club", "").lower()
            results = [e for e in MOCK_EVENTS if club in e["club"].lower()]
            return {"events": results, "count": len(results)}
            
        else:
            return {"error": "Unknown action"}
            
    except json.JSONDecodeError:
        return {"events": MOCK_EVENTS[:5]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3003)
