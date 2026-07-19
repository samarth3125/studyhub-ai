import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, desc }) => {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500 transition"
    >
      <Icon
        className="text-indigo-500 mb-6"
        size={42}
      />

      <h3 className="text-2xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-gray-400 leading-7">
        {desc}
      </p>
    </motion.div>
  );
};

export default FeatureCard;