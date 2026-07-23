import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const PageHeader = ({ backTo, backLabel, title, description, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-5"
        >
          <ChevronLeft size={16} />
          {backLabel || "Back"}
        </Link>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-slate-400 mt-2">{description}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </motion.div>
  );
};

export default PageHeader;
