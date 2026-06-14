'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [libraryData, setLibraryData] = useState({ availableCount: 0 });
  const [cafeteriaData, setCafeteriaData] = useState<any>({ menu: {} });
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [academicsData, setAcademicsData] = useState<any[]>([]);
  const [timetableData, setTimetableData] = useState<any[]>([]);
  
  const [mealToggle, setMealToggle] = useState('Lunch');

  useEffect(() => {
    // Fetch from Library MCP
    const libUrl = process.env.NEXT_PUBLIC_LIBRARY_URL || 'https://adaptable-magic-production-867e.up.railway.app';
    fetch(`${libUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{"action": "search_book"}' })
    })
      .then(res => res.json())
      .then(data => setLibraryData({ availableCount: data.availableCount }))
      .catch(() => {});

    // Fetch from Cafeteria MCP
    const cafUrl = process.env.NEXT_PUBLIC_CAFETERIA_URL || 'https://courteous-mindfulness-production-338a.up.railway.app';
    fetch(`${cafUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{"action": "get_todays_menu"}' })
    })
      .then(res => res.json())
      .then(data => setCafeteriaData(data))
      .catch(() => {});

    // Fetch from Events MCP
    const evUrl = process.env.NEXT_PUBLIC_EVENTS_URL || 'https://humorous-hope-production-8c62.up.railway.app';
    fetch(`${evUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{"action": "get_upcoming_events", "params": {"limit": 3}}' })
    })
      .then(res => res.json())
      .then(data => setEventsData(data.events || []))
      .catch(() => {});

    // Fetch from Academics MCP
    const acUrl = process.env.NEXT_PUBLIC_ACADEMICS_URL || 'https://abundant-amazement-production-dd4c.up.railway.app';
    fetch(`${acUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{"action": "get_deadlines"}' })
    })
      .then(res => res.json())
      .then(data => setAcademicsData(data.deadlines || []))
      .catch(() => {});

    // Fetch Timetable
    fetch(`${acUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{"action": "get_timetable", "params": {"day": "Monday"}}' })
    })
      .then(res => res.json())
      .then(data => setTimetableData(data.timetable || []))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Library Card */}
        <div className="bg-mint rounded-2xl p-6 shadow-soft flex flex-col h-64 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <h2 className="text-2xl font-semibold mb-2">Library</h2>
          <p className="text-gray-700 text-sm mb-4">Search catalogs and check availability.</p>
          <div className="flex-grow"></div>
          <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40">
            <div className="text-3xl font-bold text-teal-800">{libraryData.availableCount}</div>
            <div className="text-sm font-medium text-teal-700">Books Available Today</div>
          </div>
        </div>

        {/* Cafeteria Card */}
        <div className="bg-soft-yellow rounded-2xl p-6 shadow-soft flex flex-col h-64 relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h2 className="text-2xl font-semibold">Cafeteria</h2>
            <div className="flex bg-white/50 rounded-full p-1 text-xs">
              {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                <button 
                  key={meal}
                  onClick={() => setMealToggle(meal)}
                  className={`px-3 py-1 rounded-full transition-colors ${mealToggle === meal ? 'bg-white shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 flex-grow overflow-y-auto">
            {cafeteriaData.menu && cafeteriaData.menu[mealToggle] ? (
              <>
                <div className="text-xs font-semibold text-yellow-800 mb-2 uppercase tracking-wider">{cafeteriaData.menu[mealToggle].timing}</div>
                <ul className="space-y-1">
                  {cafeteriaData.menu[mealToggle].items.map((item: string, i: number) => (
                    <li key={i} className="text-sm font-medium text-gray-800 flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-yellow-400 before:rounded-full before:mr-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-sm text-gray-500">Loading menu...</div>
            )}
          </div>
        </div>

        {/* Timetable Card */}
        <div className="bg-soft-blue rounded-2xl p-6 shadow-soft flex flex-col h-64 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <h2 className="text-2xl font-semibold mb-4 relative z-10">Today's Classes</h2>
          <div className="space-y-3 relative z-10 overflow-y-auto flex-grow pr-1">
            {timetableData.length > 0 ? timetableData.map((cls, i) => (
              <div key={i} className="bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-white/40 flex justify-between items-center group-hover:bg-white/80 transition-colors">
                <div>
                  <div className="font-semibold text-blue-900">{cls.course}</div>
                  <div className="text-xs text-blue-700">{cls.time}</div>
                </div>
                <div className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-md">{cls.room}</div>
              </div>
            )) : <div className="text-sm text-gray-500">No classes today!</div>}
          </div>
        </div>

        {/* Events Card */}
        <div className="bg-lavender rounded-2xl p-6 shadow-soft flex flex-col lg:col-span-2 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
            <button className="text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors">View All &rarr;</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
            {eventsData.length > 0 ? eventsData.map((event, i) => (
              <div key={i} className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-colors cursor-pointer">
                <div className="text-xs font-bold text-purple-600 mb-1">{new Date(event.date).toLocaleDateString([], {month:'short', day:'numeric'})} • {event.type}</div>
                <div className="font-semibold text-gray-900 mb-1 truncate">{event.name}</div>
                <div className="text-xs text-gray-600 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {event.venue}
                </div>
              </div>
            )) : <div className="text-sm text-gray-500">Loading events...</div>}
          </div>
        </div>

        {/* Academics Card */}
        <div className="bg-blush-pink rounded-2xl p-6 shadow-soft flex flex-col relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <h2 className="text-2xl font-semibold mb-4 relative z-10">Deadlines</h2>
          <div className="space-y-3 relative z-10 overflow-y-auto flex-grow pr-1">
            {academicsData.length > 0 ? academicsData.map((task, i) => {
              const daysLeft = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isUrgent = daysLeft <= 3;
              return (
                <div key={i} className="bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-white/40 flex justify-between items-center group-hover:bg-white/80 transition-colors">
                  <div>
                    <div className="font-semibold text-pink-900">{task.task}</div>
                    <div className="text-xs text-pink-700">{task.course}</div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-md ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-800'}`}>
                    {daysLeft} days
                  </div>
                </div>
              );
            }) : <div className="text-sm text-gray-500">No upcoming deadlines!</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
