import os
import json
import requests
import google.generativeai as genai

# MCP endpoints
MCP_SERVICES = {
    "library": "http://localhost:3001/query",
    "cafeteria": "http://localhost:3002/query",
    "events": "http://localhost:3003/query",
    "academics": "http://localhost:3004/query",
}

def call_mcp(service: str, action: str, params: dict):
    url = MCP_SERVICES.get(service)
    if not url:
        return {"error": f"Service {service} not configured."}
    
    payload = {
        "query": json.dumps({"action": action, "params": params})
    }
    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"⚠️ {service.capitalize()} MCP unavailable: {str(e)}"}

def query_library(action: str, title: str = "", author: str = ""):
    """Queries the library service for books.
    Actions: 'search_book', 'check_availability', 'get_due_dates'.
    """
    return call_mcp("library", action, {"title": title, "author": author})

def query_cafeteria(action: str, meal: str = "", item: str = ""):
    """Queries the cafeteria service for menus.
    Actions: 'get_todays_menu', 'get_meal', 'check_item'.
    """
    return call_mcp("cafeteria", action, {"meal": meal, "item": item})

def query_events(action: str, limit: int = 5, keyword: str = "", club: str = ""):
    """Queries the campus events service.
    Actions: 'get_upcoming_events', 'search_event', 'get_by_club'.
    """
    return call_mcp("events", action, {"limit": limit, "keyword": keyword, "club": club})

def query_academics(action: str, day: str = "Monday"):
    """Queries the academics service for deadlines, exam schedules, and timetables.
    Actions: 'get_deadlines', 'get_timetable', 'get_exam_schedule'.
    """
    return call_mcp("academics", action, {"day": day})

tools = {
    "query_library": query_library,
    "query_cafeteria": query_cafeteria,
    "query_events": query_events,
    "query_academics": query_academics
}

def process_chat(prompt: str, history: list):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"response": "⚠️ Gemini API key is missing. Please set GEMINI_API_KEY.", "steps": ["⚠️ Gemini temporarily unavailable"]}
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name="gemini-2.5-flash", tools=list(tools.values()))
    
    formatted_history = []
    for msg in history:
        role = "user" if msg.role == "user" else "model"
        formatted_history.append({"role": role, "parts": [msg.content]})
        
    try:
        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(prompt)
        
        steps = []
        
        # Manual tool calling loop to capture steps
        while True:
            function_calls = [part.function_call for part in response.parts if part.function_call]
            if not function_calls:
                break
                
            tool_responses = []
            for fc in function_calls:
                fn_name = fc.name
                args = {k: v for k, v in fc.args.items()}
                
                # Format step for UI
                service_name = fn_name.replace("query_", "").capitalize()
                steps.append(f"🔍 Checking {service_name} MCP...")
                
                if fn_name in tools:
                    result = tools[fn_name](**args)
                    
                    # If there's an error indicating unavailability, show it directly in the UI as a step
                    if isinstance(result, dict) and "error" in result and "unavailable" in result["error"]:
                        steps.append(result["error"])
                        
                    tool_responses.append(
                        genai.protos.Part(
                            function_response=genai.protos.FunctionResponse(
                                name=fn_name,
                                response={"result": result}
                            )
                        )
                    )
            
            steps.append("🧠 Synthesizing response...")
            response = chat.send_message(tool_responses)
            
        return {"response": response.text, "steps": steps}
    except Exception as e:
        return {"response": f"I'm sorry, I encountered an error: {str(e)}", "steps": ["⚠️ Gemini temporarily unavailable"]}
