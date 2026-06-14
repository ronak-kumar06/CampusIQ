from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from datetime import datetime, timedelta

app = FastAPI(title="Library MCP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_BOOKS = []
authors = ["Robert Martin", "Martin Fowler", "Kent Beck", "J.K. Rowling", "George R.R. Martin", "J.R.R. Tolkien"]
for i in range(1, 101):
    MOCK_BOOKS.append({
        "id": i,
        "title": f"Book Title {i}",
        "author": authors[i % len(authors)],
        "available": i % 3 != 0,
        "dueDate": (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d") if i % 3 == 0 else None
    })

MOCK_BOOKS[0] = {"id": 1, "title": "Clean Code", "author": "Robert Martin", "available": True, "dueDate": None}
MOCK_BOOKS[1] = {"id": 2, "title": "Harry Potter and the Sorcerer's Stone", "author": "J.K. Rowling", "available": False, "dueDate": "2026-06-20"}
MOCK_BOOKS[2] = {"id": 3, "title": "Clean Architecture", "author": "Robert Martin", "available": True, "dueDate": None}

class QueryRequest(BaseModel):
    query: str

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/query")
def query_library(request: QueryRequest):
    try:
        # Try to parse query as JSON for structured tool calls
        data = json.loads(request.query)
        action = data.get("action")
        params = data.get("params", {})
        
        if action == "search_book":
            title = params.get("title", "").lower()
            author = params.get("author", "").lower()
            results = [b for b in MOCK_BOOKS if (title in b["title"].lower() if title else True) and (author in b["author"].lower() if author else True)]
            return {"books": results, "availableCount": len([b for b in results if b["available"]])}
            
        elif action == "check_availability":
            title = params.get("title", "").lower()
            results = [b for b in MOCK_BOOKS if title in b["title"].lower()]
            return {"books": results, "availableCount": len([b for b in results if b["available"]])}
            
        elif action == "get_due_dates":
            results = [b for b in MOCK_BOOKS if not b["available"] and b["dueDate"]]
            return {"books": results, "count": len(results)}
            
        else:
            return {"error": "Unknown action"}
            
    except json.JSONDecodeError:
        # Fallback to simple text search
        q = request.query.lower()
        results = [b for b in MOCK_BOOKS if q in b["title"].lower() or q in b["author"].lower()]
        return {"books": results, "availableCount": len([b for b in results if b["available"]])}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 3001))
    uvicorn.run(app, host="0.0.0.0", port=port)
