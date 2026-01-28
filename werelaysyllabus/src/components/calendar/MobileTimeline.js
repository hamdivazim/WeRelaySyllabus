import { useMemo } from "react";
import { motion } from "framer-motion";

export default function MobileTimeline({ events, onEventClick, onScrollToToday }) {
  const groups = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const filtered = [...events]
      .filter(ev => {
        const d = new Date(ev.start);
        return d >= startOfToday;
      })
      .sort((a, b) => a.start - b.start);

    const result = [];
    filtered.forEach(ev => {
      const evDate = new Date(ev.start);
      evDate.setHours(0, 0, 0, 0);
      
      let label = evDate.toLocaleDateString(undefined, { 
        weekday: 'long', month: 'short', day: 'numeric' 
      });
      
      const diffDays = Math.round((evDate - startOfToday) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) label = "Today";
      else if (diffDays === 1) label = "Tomorrow";

      let group = result.find(g => g.label === label);
      if (!group) {
        group = { label, events: [] };
        result.push(group);
      }
      group.events.push(ev);
    });
    return result;
  }, [events]);

  return (
    <div className="md:hidden flex-1 overflow-y-auto space-y-8 pb-40 px-1 custom-scrollbar">
      <div className="flex items-center justify-between mt-2 mb-4 px-2">
        <h2 className="text-xl font-[1000] uppercase tracking-tighter italic text-slate-900">Timeline</h2>
        <button 
          onClick={onScrollToToday}
          className="text-[10px] font-black bg-white px-3 py-1 rounded border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all"
        >
          Scroll to Today
        </button>
      </div>

      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.label} className="relative">
            <div className="sticky top-0 z-10 bg-[#fdfdfb]/90 backdrop-blur-sm py-2 mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-slate-200"></span>
                {group.label}
              </h3>
            </div>
            
            <div className="space-y-4 ml-4 border-l-2 border-dashed border-slate-200 pl-6">
              {group.events.map((ev, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  key={ev.id} 
                  onClick={() => onEventClick(ev)}
                  style={{
                    backgroundColor: `${ev.colour}0D` 
                  }}
                  className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#1e293b] active:translate-y-1 active:shadow-none transition-all relative group cursor-pointer"
                >
                  <div 
                    className="absolute -left-[33px] top-6 w-3.5 h-3.5 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#1e293b] z-20"
                    style={{ backgroundColor: ev.colour }} 
                  />
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[8px] font-black px-2 py-0.5 bg-slate-900 text-white rounded uppercase ring-2 ring-slate-900 ring-offset-1">
                      {ev.type || 'Event'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-900 uppercase">
                        {ev.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-md font-[1000] uppercase leading-tight text-slate-900 mb-1">{ev.title}</h3>
                  
                  {ev.location && (
                    <div className="flex items-center gap-1">
                      <span 
                        className="text-[9px] font-bold uppercase tracking-tighter"
                        style={{ color: ev.colour }}
                      >
                        @ {ev.location}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
          <p className="font-black text-slate-400 uppercase text-xs tracking-widest">No upcoming deadlines</p>
        </div>
      )}
    </div>
  );
}