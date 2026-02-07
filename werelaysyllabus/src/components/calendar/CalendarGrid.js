export default function CalendarGrid({ monthGrid, currentMonthDate, eventsByDay, today, onSelectDay }) {
  return (
    <div className="flex-1 flex flex-col bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] h-full min-h-0">

      <div className="grid grid-cols-7 bg-slate-900 text-slate-100 py-2 md:py-3 text-[10px] md:text-xs font-[900] tracking-wider text-center uppercase shrink-0">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d}>
            <span className="hidden md:inline">{d}</span>
            <span className="md:hidden">{d[0]}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x-2 divide-y-2 divide-slate-200 min-h-0 h-full">
        {monthGrid.map((cell, idx) => {
          const k = cell.toISOString().slice(0, 10);
          const dayEvents = eventsByDay[k] || [];
          const isCurMonth = cell.getMonth() === currentMonthDate.getMonth();
          const isToday = cell.toDateString() === today.toDateString();
          
          return (
            <div 
              key={idx} 
              onClick={() => onSelectDay(k)} 
              className={`p-1 md:p-1.5 transition-all cursor-pointer relative group flex flex-col min-h-0 overflow-hidden
                ${isCurMonth ? 'bg-white' : 'bg-slate-50 opacity-40'} 
                hover:bg-indigo-50/50`}
            >
              <div className="shrink-0 flex justify-between items-center mb-1">
                <span className={`text-xs md:text-sm font-[1000] w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 rounded-lg transition-all ${isToday ? 'bg-indigo-600 text-white border-slate-900 shadow-[2px_2px_0px_0px_#000]' : 'text-slate-900 border-transparent'}`}>
                  {cell.getDate()}
                </span>
                
                {dayEvents.length > 0 && (
                  <div className="md:hidden flex gap-0.5 pr-1">
                    {dayEvents.slice(0, 3).map(ev => (
                      <div key={ev.id} style={{backgroundColor: ev.colour}} className="w-2 h-2 rounded-full border-[1px] border-slate-900" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 hidden md:flex flex-col gap-1 overflow-hidden">
                {dayEvents.length > 0 && (
                  <>
                    <div 
                      style={{ backgroundColor: dayEvents[0].colour }} 
                      className="shrink-0 text-[10px] leading-[1.1] font-black px-1.5 py-1 border-2 border-slate-900 rounded-md text-white uppercase tracking-tight shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)] line-clamp-2"
                    >
                      {dayEvents[0].title}
                    </div>

                    {dayEvents.length >= 3 ? (
                      <div className="flex flex-wrap gap-1 px-0.5 pt-0.5">
                        {dayEvents.slice(1).map(ev => (
                          <div 
                            key={ev.id} 
                            style={{ backgroundColor: ev.colour }} 
                            className="w-3 h-3 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]"
                            title={ev.title}
                          />
                        ))}
                      </div>
                    ) : (
                      dayEvents.slice(1).map(ev => (
                        <div 
                          key={ev.id} 
                          style={{ backgroundColor: ev.colour }} 
                          className="shrink-0 text-[10px] leading-[1.1] font-black px-1.5 py-1 border-2 border-slate-900 rounded-md text-white uppercase tracking-tight shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)] line-clamp-1"
                        >
                          {ev.title}
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>

              <div className="absolute inset-0 bg-indigo-500/0 group-active:bg-indigo-500/10 transition-colors pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
}