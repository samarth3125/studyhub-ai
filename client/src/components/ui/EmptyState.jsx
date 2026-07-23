import { motion } from "framer-motion";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 px-8 py-16 ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-slate-800/70 border border-slate-700 flex items-center justify-center mb-5">
          <Icon size={24} className="text-slate-400" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>

      {description && (
        <p className="text-slate-400 mt-2 max-w-sm text-sm leading-6">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
