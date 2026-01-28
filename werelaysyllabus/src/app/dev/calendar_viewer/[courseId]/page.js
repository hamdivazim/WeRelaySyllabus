"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import Sidebar from "@/components/calendar/Sidebar";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EventModal from "@/components/calendar/EventModal";
import MobileTimeline from "@/components/calendar/MobileTimeline";
import CourseHeader from "@/components/calendar/CourseHeader";

import { useCourseData } from "@/hooks/useCourseData";

export default function CourseCalendarViewer() {
  const { courseId } = useParams();
  
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  
  const {
    events,
    courseData,
    loading,
    isSaving,
    editingEventId,
    newEvent,
    setNewEvent,
    saveEvent,
    deleteEvent,
    startEditing,
    resetForm,
    downloadICS,
    handleVouch,
    userId
  } = useCourseData(courseId);

  const today = new Date();
  const currentMonthDate = useMemo(() => {
    return new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const monthGrid = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startDate = new Date(year, month, 1 - firstDayOfMonth);
    
    return Array.from({ length: 42 }, (_, i) => {
      return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    });
  }, [currentMonthDate]);

  const eventsByDay = useMemo(() => {
    const groups = {};
    events.forEach((ev) => {
      const key = ev.start.toISOString().slice(0, 10);
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    });
    return groups;
  }, [events]);

  const handleMobileEventClick = (ev) => {
    const dateKey = ev.start.toISOString().slice(0, 10);
    setSelectedDay(dateKey);
    startEditing(ev);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-[#fdfdfb] text-[#1e293b]">
      <Sidebar 
        courseData={courseData} 
        courseId={courseId} 
        eventCount={events.length} 
        onDownload={() => downloadICS(courseData?.name)}
        onVouch={handleVouch}
        userId={userId}
      />

      <main className="flex-1 h-full flex flex-col p-4 md:p-10 relative min-w-0">
        <div className="max-w-7xl w-full mx-auto h-full flex flex-col min-h-0">
          
          <CourseHeader 
            courseName={courseData?.name}
            eventCount={events.length}
            currentMonthDate={currentMonthDate}
            onPrevMonth={() => setMonthOffset(prev => prev - 1)}
            onNextMonth={() => setMonthOffset(prev => prev + 1)}
            onToday={() => setMonthOffset(0)}
          />

          <div className="hidden md:flex flex-1 min-h-0 mb-6">
            <CalendarGrid 
              monthGrid={monthGrid} 
              currentMonthDate={currentMonthDate} 
              eventsByDay={eventsByDay} 
              today={today} 
              onSelectDay={setSelectedDay} 
            />
          </div>

          <MobileTimeline 
            events={events}
            onEventClick={handleMobileEventClick}
            onScrollToToday={() => setMonthOffset(0)}
          />

          <div className="md:hidden fixed bottom-8 right-6 z-50">
            <button 
              onClick={() => {
                setSelectedDay(new Date().toISOString().slice(0, 10));
                resetForm();
              }}
              className="w-16 h-16 bg-indigo-600 border-4 border-slate-900 rounded-full text-white text-3xl flex items-center justify-center shadow-[4px_4px_0px_0px_#1e293b] active:translate-y-1 active:shadow-none transition-all"
            >
              +
            </button>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedDay && (
          <EventModal 
            selectedDay={selectedDay} 
            events={eventsByDay[selectedDay]} 
            editingEventId={editingEventId} 
            newEvent={newEvent} 
            isAdding={isSaving} 
            onClose={() => { setSelectedDay(null); resetForm(); }} 
            onStartEditing={startEditing} 
            onResetForm={resetForm} 
            onSave={(e) => {
              e.preventDefault();
              saveEvent(selectedDay, () => setSelectedDay(null));
            }} 
            onDelete={deleteEvent} 
            setNewEvent={setNewEvent} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}