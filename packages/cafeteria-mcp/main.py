from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI(title="Cafeteria MCP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MENU = {
    "Breakfast": {"items": ["Pancakes", "Scrambled Eggs", "Oatmeal", "Coffee"], "timing": "7 AM - 10 AM"},
    "Lunch": {"items": ["Grilled Chicken Sandwich", "Caesar Salad", "Tomato Soup", "Pizza"], "timing": "12 PM - 2 PM"},
    "Dinner": {"items": ["Spaghetti Bolognese", "Roast Beef", "Vegetable Stir Fry", "Ice Cream"], "timing": "6 PM - 8 PM"}
}

class QueryRequest(BaseModel):
    query: str

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/query")
def query_cafeteria(request: QueryRequest):
    try:
        data = json.loads(request.query)
        action = data.get("action")
        params = data.get("params", {})
        
        if action == "get_todays_menu":
            return {"menu": MENU}
            
        elif action == "get_meal":
            meal = params.get("meal", "").capitalize()
            if meal in MENU:
                return {"meal": meal, "items": MENU[meal]["items"], "timing": MENU[meal]["timing"]}
            return {"error": f"Meal {meal} not found"}
            
        elif action == "check_item":
            item = params.get("item", "").lower()
            found_in = []
            for m, details in MENU.items():
                if any(item in i.lower() for i in details["items"]):
                    found_in.append(m)
            return {"item": params.get("item"), "availableIn": found_in}
            
        else:
            return {"error": "Unknown action"}
            
    except json.JSONDecodeError:
        # Simple text search fallback
        return {"menu": MENU}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002)
