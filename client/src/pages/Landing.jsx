import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";

import Features from "../components/Features";
import WhyChoose from "../components/WhyChoose";
import TechStack from "../components/TechStack";
import Footer from "../components/Footer";
import AIDemo from "../components/AIDemo";

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-indigo-500/15 blur-[140px] rounded-full top-20 left-10" />
        <div className="absolute w-96 h-96 bg-indigo-500/10 blur-[140px] rounded-full bottom-20 right-10" />
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-8 py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} />
          </div>
          StudyHub<span className="text-indigo-400">AI</span>
        </div>

        <div className="hidden md:flex gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#tech" className="hover:text-white transition-colors">
            Tech
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-sm font-medium transition-colors"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Sparkles size={14} />
            AI Powered Learning Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
            Study
            <span className="text-indigo-400"> Smarter</span>
            <br />
            Not Harder.
          </h1>

          <p className="mt-7 text-lg text-slate-400 leading-8 max-w-xl">
            Organize notes, summarize PDFs, generate quizzes, flashcards, and
            chat with an AI tutor about anything you're studying.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-3.5 rounded-xl font-semibold transition-colors"
            >
              Get Started
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/login"
              className="border border-slate-800 hover:border-slate-700 px-7 py-3.5 rounded-xl font-medium transition-colors"
            >
              Login
            </Link>
          </div>

          <div className="flex gap-10 sm:gap-14 mt-14">
            {[
              ["6+", "AI Features"],
              ["MERN", "Full Stack"],
              ["Groq", "Powered AI"],
            ].map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
              >
                <p className="text-2xl sm:text-3xl font-bold">{value}</p>
                <p className="text-slate-500 text-sm mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-indigo-600/20 blur-3xl rounded-full" />

          <div className="relative bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
              alt="Student studying with StudyHub AI"
              className="rounded-2xl"
            />
          </div>
        </motion.div>
      </section>

      <Features />
      <AIDemo />
      <WhyChoose />
      <TechStack />
      <Footer />
    </div>
  );
};

export default Landing;
