const tones = {
  indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
  slate: "bg-slate-800 text-slate-300 border-slate-700",
  green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  red: "bg-red-500/10 text-red-300 border-red-500/30",
  purple: "bg-purple-500/10 text-purple-300 border-purple-500/30",
};

const Badge = ({ children, tone = "indigo", icon: Icon, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default Badge;
