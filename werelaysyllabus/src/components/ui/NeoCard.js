export default function NeoCard({ children, className = "", bgColor = "bg-white" }) {
  return (
    <div className={`border-[3px] border-slate-900 shadow-[6px_6px_0px_0px_#1e293b] p-6 ${bgColor} ${className}`}>
      {children}
    </div>
  );
}