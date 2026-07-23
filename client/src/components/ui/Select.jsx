import { ChevronDown } from "lucide-react";

const Select = ({ label, className = "", id, children, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          className={`w-full appearance-none bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 pr-10 text-slate-100 outline-none transition-colors duration-150 ${className}`}
          {...props}
        >
          {children}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
};

export default Select;
