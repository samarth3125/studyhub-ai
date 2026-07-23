import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 shadow-lg shadow-indigo-950/40",
  secondary:
    "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
  outline:
    "bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-600",
  ghost:
    "bg-transparent hover:bg-slate-800/60 text-slate-300 border border-transparent",
  danger:
    "bg-red-600/90 hover:bg-red-600 text-white border border-red-500/50",
  success:
    "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
        variants[variant]
      } ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
