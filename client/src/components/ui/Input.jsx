const Input = ({ label, error, className = "", id, ...props }) => {
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

      <input
        id={id}
        className={`w-full bg-slate-950/60 border rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-colors duration-150 ${
          error
            ? "border-red-500/60 focus:border-red-500"
            : "border-slate-800 focus:border-indigo-500"
        } ${className}`}
        {...props}
      />

      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
