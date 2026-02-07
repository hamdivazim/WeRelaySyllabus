"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Trash2, X, Lock } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function EventModal({ selectedDay, events, editingEventId, newEvent, isAdding, onClose, onStartEditing, onResetForm, onSave, onDelete, setNewEvent }) {
  const springTransition = { type: "spring", damping: 25, stiffness: 200 };
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { user } = useAuth();

  const handleActionWithAuth = (e, callback) => {
    if (e) e.preventDefault();
    if (!user) {
      setShowAuthAlert(true);
      return;
    }
    callback();
  };

  const handleDeleteClick = () => {
    if (!user) {
      setShowAuthAlert(true);
      return;
    }
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
    } else {
      onDelete();
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] z-[60]" 
      />
      
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={springTransition}
        className="fixed inset-x-0 bottom-0 top-[10%] md:top-[8%] md:bottom-[8%] md:left-1/2 md:inset-x-auto md:ml-[-320px] md:w-[640px] bg-white border-t-4 md:border-2 border-slate-900 rounded-t-[2.5rem] md:rounded-3xl shadow-[0px_-10px_0px_0px_rgba(0,0,0,0.1),12px_12px_0px_0px_rgba(0,0,0,1)] z-[70] overflow-hidden flex flex-col"
      >
        <div className="p-5 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6 md:mb-10 border-b-2 border-slate-100 pb-6">
            <div>
              <p className="text-[8px] md:text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em] mb-1">Reviewing Date</p>
              <h3 className="text-xl md:text-4xl font-[1000] italic text-slate-900 tracking-tight uppercase">
                {selectedDay ? new Date(selectedDay).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : ""}
              </h3>
            </div>
            <button onClick={onClose} className="px-3 py-2 md:px-4 md:py-2 border-2 border-slate-900 rounded-xl font-black text-[10px] md:text-xs hover:bg-rose-50 transition-all shadow-[3px_3px_0px_0px_#1e293b]">CLOSE</button>
          </div>

          <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
            {events?.length > 0 ? (
                events.map(ev => (
                  <div key={ev.id} onClick={() => { onStartEditing(ev); setShowDeleteConfirm(false); }} className={`p-4 md:p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#1e293b] flex gap-3 md:gap-4 cursor-pointer hover:bg-indigo-50 transition-colors ${editingEventId === ev.id ? 'ring-4 ring-indigo-200' : ''}`}>
                    <div className="w-2 md:w-3 border-r-2 border-slate-900 rounded-l-md" style={{backgroundColor: ev.colour}} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-1">
                        <span className="text-[7px] md:text-[9px] font-black px-1.5 py-0.5 bg-slate-900 text-white rounded uppercase shrink-0">{ev.type || 'Event'}</span>
                        <h4 className="font-black text-xs md:text-lg uppercase tracking-tighter text-slate-900 truncate">{ev.title}</h4>
                      </div>
                      <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase truncate">
                        {ev.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {ev.location}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-6 md:py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">No events registered</p>
              </div>
            )}
          </div>

          <form onSubmit={(e) => handleActionWithAuth(e, onSave)} className="bg-slate-50 p-5 md:p-8 border-2 border-slate-900 rounded-[2rem] md:rounded-3xl space-y-4 shadow-[4px_4px_0px_0px_#f1f5f9] mb-4">
            <div className="flex justify-between items-center mb-2 px-1">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic">
                {editingEventId ? 'Edit Mode' : 'New Event'}
              </p>
              {editingEventId && (
                <button type="button" onClick={() => { onResetForm(); setShowDeleteConfirm(false); }} className="text-[9px] font-black text-indigo-600 uppercase underline">Back to Add</button>
              )}
            </div>

            <input required placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 md:px-6 md:py-4 text-slate-900 font-black outline-none focus:bg-indigo-50 transition-all placeholder:text-slate-300 uppercase text-[11px] md:text-sm" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Type (Exam, Lab...)" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="bg-white border-2 border-slate-900 rounded-xl px-4 py-3 md:px-6 md:py-4 text-slate-900 font-black text-[11px] md:text-sm uppercase" />
              <input placeholder="Room / Link" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="bg-white border-2 border-slate-900 rounded-xl px-4 py-3 md:px-6 md:py-4 text-slate-900 font-black text-[11px] md:text-sm uppercase" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 md:p-4 border-2 border-slate-900 rounded-xl">
                <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mb-1">Starts</p>
                <input type="time" required value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} className="bg-transparent text-slate-900 font-black text-xs md:text-sm w-full outline-none" />
              </div>
              <div className="bg-white p-3 md:p-4 border-2 border-slate-900 rounded-xl">
                <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mb-1">Ends</p>
                <input type="time" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} className="bg-transparent text-slate-900 font-black text-xs md:text-sm w-full outline-none" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
              <div className="flex gap-2">
                {["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#475569"].map(c => (
                  <button key={c} type="button" onClick={() => setNewEvent({...newEvent, colour: c})} className={`w-7 h-7 md:w-8 md:h-8 border-2 border-slate-900 rounded-lg transition-transform ${newEvent.colour === c ? 'scale-110 shadow-[2px_2px_0px_0px_#000]' : ''}`} style={{backgroundColor: c}} />
                ))}
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                {editingEventId && (
                  <button 
                    type="button" 
                    onClick={handleDeleteClick} 
                    className={`flex-1 md:flex-none px-4 md:px-6 py-3 md:py-4 border-2 border-slate-900 rounded-xl font-black text-[10px] md:text-xs uppercase transition-all flex items-center justify-center gap-2
                      ${showDeleteConfirm 
                        ? "bg-rose-600 text-white shadow-none translate-y-1" 
                        : "bg-white text-rose-600 shadow-[3px_3px_0px_0px_#f43f5e] hover:bg-rose-50"}`}
                  >
                    {showDeleteConfirm ? <Trash2 size={14} /> : null}
                    {showDeleteConfirm ? "Confirm?" : "Delete"}
                  </button>
                )}
                <button type="submit" disabled={isAdding} className="flex-1 md:flex-none bg-slate-900 text-white px-6 md:px-10 py-3 md:py-4 border-2 border-slate-900 rounded-xl font-black text-[10px] md:text-xs uppercase shadow-[3px_3px_0px_0px_#6366f1] active:translate-y-1 active:shadow-none transition-all">
                  {isAdding ? '...' : (editingEventId ? 'Update' : 'Add')}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2 pt-2 opacity-60">
              <AlertTriangle size={12} className="text-amber-600" />
              <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                Saving changes resets community vouches to zero.
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAuthAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAuthAlert(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-sm bg-white border-[4px] border-slate-900 p-8 shadow-[12px_12px_0px_0px_#000]"
            >
              <button onClick={() => setShowAuthAlert(false)} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-900" strokeWidth={3} />
              </button>
              <div className="w-16 h-16 bg-indigo-50 border-4 border-slate-900 flex items-center justify-center mb-6 -rotate-6 shadow-[4px_4px_0px_0px_#000]">
                <Lock className="text-indigo-600" size={32} strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-[1000] text-slate-900 uppercase italic leading-none mb-4">Hold <span className="text-indigo-600">Up!</span></h3>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-tight mb-8">You need to be part of the relay to edit the schedule.</p>
              <div className="flex flex-col gap-3">
                <Link href="/login" className="w-full">
                  <button className="w-full py-4 bg-rose-500 text-white border-4 border-slate-900 font-black uppercase italic shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] transition-all">Login Now</button>
                </Link>
                <button onClick={() => setShowAuthAlert(false)} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Maybe Later</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}