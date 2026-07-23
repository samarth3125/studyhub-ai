import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = false,
  as: Component = motion.div,
  ...props
}) => {
  return (
    <Component
      className={`bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm ${
        hover
          ? "transition-all duration-200 hover:border-slate-700 hover:bg-slate-900"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
