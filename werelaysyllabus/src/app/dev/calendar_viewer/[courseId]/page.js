"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, query, orderBy, 
  getDoc, addDoc, Timestamp, doc as docRef
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseCalendarViewer() {
  const { courseId: courseIdFromUrl } = useParams();
  const router = useRouter();

  //states
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    colour: "#6366f1",
    startTime: "12:00",
    endTime: ""
  });

  //init
  useEffect(() => {
    if (!courseIdFromUrl) return;
    
    const loadAllData = async () => {
      setLoading(true);
      try {
        //fetch info
        const courseSnap = await getDoc(docRef(db, "courses", courseIdFromUrl));
        if (courseSnap.exists()) setCourseData(courseSnap.data());

        //fetch events
        const eventsCol = collection(db, "courses", courseIdFromUrl, "events");
        const snaps = await getDocs(query(eventsCol, orderBy("start")));
        
        const mappedEvents = snaps.docs.map(d => {
          const raw = d.data();
          return {
            id: d.id,
            ...raw,
            start: raw.start?.toDate ? raw.start.toDate() : new Date(raw.start),
            end: raw.end?.toDate ? raw.end.toDate() : raw.end ? new Date(raw.end) : null
          };
        });
        setEvents(mappedEvents);
      } catch (e) {
        console.error("Failed to load calendar data:", e);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [courseIdFromUrl]);

  const downloadICS = () => {
    if (!events.length) return alert("Nothing to export");
    
    const formatDate = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    
    let content = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Werelay//Syllabus//EN\n";
    
    events.forEach(ev => {
      content += `BEGIN:VEVENT\nUID:${ev.id}\nDTSTAMP:${formatDate(new Date())}\nDTSTART:${formatDate(ev.start)}\n`;
      if (ev.end) content += `DTEND:${formatDate(ev.end)}\n`;
      content += `SUMMARY:${ev.title}\nDESCRIPTION:${(ev.description || "").replace(/\n/g, "\\n")}\nLOCATION:${ev.location || ""}\nEND:VEVENT\n`;
    });
    
    content += "END:VCALENDAR";
    
    const blob = new Blob([content], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${courseData?.name || 'course'}.ics`;
    link.click();
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!courseIdFromUrl || !selectedDay || isAdding) return;
    
    setIsAdding(true);
    try {
      const dayDate = new Date(selectedDay);
      
      const [sh, sm] = newEvent.startTime.split(":");
      const startT = new Date(new Date(dayDate).setHours(parseInt(sh), parseInt(sm)));
      
      let endT = null;
      if (newEvent.endTime) {
        const [eh, em] = newEvent.endTime.split(":");
        endT = new Date(new Date(dayDate).setHours(parseInt(eh), parseInt(em)));
      }

      await addDoc(collection(db, "courses", courseIdFromUrl, "events"), {
        ...newEvent,
        start: Timestamp.fromDate(startT),
        end: endT ? Timestamp.fromDate(endT) : null
      });

      //reset, referesh
      setNewEvent({ title: "", description: "", location: "", type: "", colour: "#6366f1", startTime: "12:00", endTime: "" });
      
      //manual refresh for now
      const eventsCol = collection(db, "courses", courseIdFromUrl, "events");
      const snaps = await getDocs(query(eventsCol, orderBy("start")));
      setEvents(snaps.docs.map(d => ({
        id: d.id,
        ...d.data(),
        start: d.data().start?.toDate(),
        end: d.data().end?.toDate() || null
      })));

    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsAdding(false);
    }
  };

  //cal helpers
  const today = new Date();
  const currentMonthDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1), [monthOffset]);
  
  const monthGrid = useMemo(() => {
    const y = currentMonthDate.getFullYear();
    const m = currentMonthDate.getMonth();
    const start = new Date(y, m, 1 - new Date(y, m, 1).getDay());
    return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }, [currentMonthDate]);

  const eventsByDay = useMemo(() => {
    const groups = {};
    events.forEach((ev) => {
      const k = ev.start.toISOString().slice(0, 10);
      if (!groups[k]) groups[k] = [];
      groups[k].push(ev);
    });
    return groups;
  }, [events]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-[#fdfdfb] text-[#1e293b]">
      
      <aside className="w-full md:w-[32%] h-full bg-white border-r-4 border-slate-900/5 p-10 flex flex-col justify-between z-10 overflow-y-auto">
        <div className="space-y-10">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-6">
                <button onClick={() => router.back()} className="w-12 h-12 flex items-center justify-center bg-white border-2 border-slate-900 rounded-2xl hover:bg-indigo-50 transition-all shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] active:shadow-none active:translate-x-1 active:translate-y-1">←</button>
                <div className="text-right">
                    <p className="text-[14px] font-[1000] text-slate-900 uppercase tracking-[0.25em] leading-none">Werelay</p>
                    <p className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-1">Syllabus</p>
                </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2 px-1">Active Course</p>
              <h1 className="text-6xl font-[1000] tracking-tighter italic leading-[0.85] text-slate-900 break-words uppercase">
                {courseData?.name || courseIdFromUrl}
              </h1>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">Course Description</p>
              <div className="text-slate-600 font-bold leading-relaxed bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-200 shadow-[4px_4px_0px_0px_#f1f5f9] italic">
                {courseData?.description || "No description currently available."}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-indigo-50 rounded-[2.5rem] border-2 border-indigo-200 shadow-[6px_6px_0px_0px_#eef2ff]">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Scheduled</p>
                <p className="text-4xl font-[1000] text-indigo-600 leading-none">{events.length}</p>
              </div>
              
              <button onClick={() => alert('Vouched!')} className="group p-6 bg-white border-2 border-slate-900 rounded-[2.5rem] text-left transition-all shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] hover:bg-amber-50 active:shadow-none active:translate-x-1 active:translate-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Vouches</p>
                <div className="flex items-center gap-2">
                  <p className="text-4xl font-[1000] text-slate-900 leading-none">{courseData?.vouched?.length || 0}</p>
                  <span className="text-xl group-hover:scale-125 transition-transform">🔥</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 space-y-6">
          <button onClick={downloadICS} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] hover:bg-indigo-600 transition-all active:scale-95">
            Download .ICS
          </button>
          <div className="flex items-center justify-center gap-2 opacity-30">
             <div className="h-px w-16 bg-slate-400"/>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center bg-white border-2 border-slate-900 p-1 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]">
              <button onClick={() => setMonthOffset(prev => prev - 1)} className="p-4 font-black text-xl hover:text-indigo-600 transition-colors">←</button>
              <h2 className="text-sm font-[1000] uppercase tracking-[0.2em] px-10 min-w-[280px] text-center border-x-2 border-slate-100">
                {currentMonthDate.toLocaleString('default', { month: "long", year: "numeric" })}
              </h2>
              <button onClick={() => setMonthOffset(prev => prev + 1)} className="p-4 font-black text-xl hover:text-indigo-600 transition-colors">→</button>
            </div>
            <button onClick={() => setMonthOffset(0)} className="px-8 py-4 bg-white border-2 border-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_#1e293b] hover:bg-slate-50 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all">Today</button>
          </div>

          <div className="flex-1 bg-white border-4 border-slate-900 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="grid grid-cols-7 bg-slate-900 text-slate-400 py-4 text-[10px] font-black tracking-widest text-center">
              {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x-2 divide-y-2 divide-slate-100">
              {monthGrid.map((cell, idx) => {
                const k = cell.toISOString().slice(0, 10);
                const dayEvents = eventsByDay[k] || [];
                const isCurMonth = cell.getMonth() === currentMonthDate.getMonth();
                const isToday = cell.toDateString() === today.toDateString();
                
                return (
                  <div key={idx} onClick={() => setSelectedDay(k)} className={`p-4 transition-all cursor-pointer relative group ${isCurMonth ? 'bg-white' : 'bg-slate-50/50 opacity-40'} hover:bg-indigo-50/40`}>
                    <span className={`text-xs font-[1000] px-2 py-1 inline-block rounded-lg transition-colors ${isToday ? 'bg-indigo-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]' : 'text-slate-400'}`}>{cell.getDate()}</span>
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 3).map(ev => (
                        <div key={ev.id} style={{backgroundColor: ev.colour}} className="text-[8px] font-black px-2 py-1.5 rounded-lg text-white uppercase truncate border-b-2 border-black/10 shadow-sm">{ev.title}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedDay && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDay(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60]" />
            <motion.div layoutId={`card-${selectedDay}`} className="fixed inset-x-4 top-[5%] bottom-[5%] md:left-1/2 md:ml-[-320px] md:w-[640px] bg-white rounded-[3.5rem] shadow-2xl z-[70] overflow-hidden border-4 border-slate-900 flex flex-col">
              <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em] mb-1">Reviewing Date</p>
                    <h3 className="text-5xl font-[1000] italic text-slate-900 tracking-tight">{new Date(selectedDay).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</h3>
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="p-4 bg-slate-100 border-2 border-slate-200 rounded-2xl font-black text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">ESC</button>
                </div>

                <div className="space-y-4 mb-12">
                  {eventsByDay[selectedDay]?.length > 0 ? (
                      eventsByDay[selectedDay].map(ev => (
                        <div key={ev.id} className="p-6 bg-white rounded-[2rem] border-2 border-slate-200 shadow-[4px_4px_0px_0px_#f8fafc] flex gap-6">
                          <div className="w-2 rounded-full" style={{backgroundColor: ev.colour}} />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[9px] font-black px-2 py-0.5 bg-slate-900 text-white rounded-md uppercase tracking-wider">{ev.type || 'Event'}</span>
                              <h4 className="font-black text-xl uppercase tracking-tighter text-slate-900">{ev.title}</h4>
                            </div>
                            <p className="text-sm text-slate-500 font-bold">{ev.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {ev.location}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No events registered for this day</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddEvent} className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-200 space-y-4 shadow-inner">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Add New Event</p>
                  </div>
                  
                  <input required placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Type (Exam, Lab...)" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-indigo-500 transition-all" />
                    <input placeholder="Room / Link" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-indigo-500 transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl px-6 py-4 border-2 border-slate-200 focus-within:border-indigo-500 transition-all">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Starts</p>
                      <input type="time" required value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} className="bg-transparent text-slate-900 font-bold outline-none w-full" />
                    </div>
                    <div className="bg-white rounded-2xl px-6 py-4 border-2 border-slate-200 focus-within:border-indigo-500 transition-all">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Ends (Optional)</p>
                      <input type="time" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} className="bg-transparent text-slate-900 font-bold outline-none w-full" />
                    </div>
                  </div>

                  <textarea placeholder="Extra notes..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none h-24 focus:border-indigo-500 transition-all resize-none" />

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex gap-2">
                      {["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#475569"].map(c => (
                        <button key={c} type="button" onClick={() => setNewEvent({...newEvent, colour: c})} className={`w-8 h-8 rounded-full border-4 transition-transform ${newEvent.colour === c ? 'border-slate-900 scale-110 shadow-lg' : 'border-transparent'}`} style={{backgroundColor: c}} />
                      ))}
                    </div>
                    <button type="submit" disabled={isAdding} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-[1000] text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                      {isAdding ? 'Saving...' : 'Commit Event'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}