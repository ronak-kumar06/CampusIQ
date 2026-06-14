from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from datetime import datetime, timedelta

app = FastAPI(title="Academics MCP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_DEADLINES = [
    {"id": 1, "course": "CS101", "task": "Assignment 1", "dueDate": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")},
    {"id": 2, "course": "MATH201", "task": "Midterm Project", "dueDate": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")},
    {"id": 3, "course": "PHY101", "task": "Lab Report", "dueDate": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")},
]

MOCK_TIMETABLE = {
    "Monday": [
        {"course": "CS101", "time": "09:00 - 10:30", "room": "Room A"},
        {"course": "MATH201", "time": "11:00 - 12:30", "room": "Room B"}
    ],
    "Tuesday": [
        {"course": "PHY101", "time": "10:00 - 12:00", "room": "Lab 1"}
    ],
    "Wednesday": [
        {"course": "CS101", "time": "09:00 - 10:30", "room": "Room A"}
    ]
}

MOCK_EXAM_SCHEDULE = [
    {"course": "CS101", "date": (datetime.now() + timedelta(days=20)).strftime("%Y-%m-%d"), "time": "10:00 - 13:00", "venue": "Main Hall"},
    {"course": "MATH201", "date": (datetime.now() + timedelta(days=22)).strftime("%Y-%m-%d"), "time": "14:00 - 17:00", "venue": "Hall B"}
]

class QueryRequest(BaseModel):
    query: str

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/query")
def query_academics(request: QueryRequest):
    try:
        data = json.loads(request.query)
        action = data.get("action")
        params = data.get("params", {})
        
        if action == "get_deadlines":
            return {"deadlines": MOCK_DEADLINES, "count": len(MOCK_DEADLINES)}
            
        elif action == "get_timetable":
            day = params.get("day", "Monday").capitalize()
            return {"timetable": MOCK_TIMETABLE.get(day, [])}
            
        elif action == "get_exam_schedule":
            return {"exam_schedule": MOCK_EXAM_SCHEDULE}
            
        else:
            return {"error": "Unknown action"}
            
    except json.JSONDecodeError:
        return {"deadlines": MOCK_DEADLINES, "timetable": MOCK_TIMETABLE}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 3004))
    uvicorn.run(app, host="0.0.0.0", port=port)
