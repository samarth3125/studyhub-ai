import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, desc }) => {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm p-8 hover:border-indigo-500/50 transition"
    >
      <Icon
        className="text-indigo-500 mb-6"
        size={42}
      />

      <h3 className="text-2xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-slate-400 leading-7">
        {desc}
      </p>
    </motion.div>
  );
};

export default FeatureCard;