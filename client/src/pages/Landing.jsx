import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Features from "../components/Features";
import WhyChoose from "../components/WhyChoose";
import TechStack from "../components/TechStack";
import Footer from "../components/Footer";
import AIDemo from "../components/AIDemo"; 

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background Glow */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute w-96 h-96 bg-indigo-500/20 blur-[140px] rounded-full top-20 left-10"></div>

        <div className="absolute w-96 h-96 bg-purple-500/20 blur-[140px] rounded-full bottom-20 right-10"></div>

      </div>

      {/* Navbar */}

      <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">

        <div className="text-3xl font-bold">
          StudyHub
          <span className="text-indigo-500">AI</span>
        </div>

        <div className="hidden md:flex gap-8 text-gray-300">

          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#tech" className="hover:text-white transition">
            Tech
          </a>

          <a href="#about" className="hover:text-white transition">
            About
          </a>

        </div>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-5 py-2 rounded-xl border border-slate-700 hover:border-indigo-500 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
          >
            Sign Up
          </Link>

        </div>

      </nav>

      {/* Hero */}

      <section className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="inline-flex items-center bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full px-4 py-2 mb-6">
            🚀 AI Powered Learning Platform
          </div>

          <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight">

            Study

            <span className="text-indigo-500">
              {" "}Smarter
            </span>

            <br />

            Not Harder.

          </h1>

          <p className="mt-8 text-lg text-gray-400 leading-8 max-w-xl">

            Organize notes, summarize PDFs, generate quizzes,
            flashcards, and personalized study plans with AI.

          </p>

          <div className="flex gap-5 mt-10">

            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
            >
              🚀 Get Started
            </Link>

            <Link
              to="/login"
              className="border border-slate-700 hover:border-indigo-500 px-8 py-4 rounded-xl transition"
            >
              Login
            </Link>

          </div>

          {/* Stats */}

          <div className="flex gap-12 mt-14">

            {[
              ["6+", "AI Features"],
              ["MERN", "Full Stack"],
              ["Groq", "Powered AI"],
            ].map(([value, label], index) => (

              <motion.div
                key={label}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.6,
                }}
              >

                <p className="text-3xl font-bold">
                  {value}
                </p>

                <p className="text-gray-400">
                  {label}
                </p>

              </motion.div>

            ))}

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >

          <div className="absolute -inset-6 bg-indigo-600 opacity-20 blur-3xl rounded-full"></div>

          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
              alt="StudyHub AI"
              className="rounded-2xl mb-6"
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