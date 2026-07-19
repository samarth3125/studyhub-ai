import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PDFUploader from "../components/PDFUploader";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboard";





const Dashboard = () => {

  const [stats, setStats] = useState({
  subjects: 0,
  notes: 0,
});


useEffect(() => {
  const loadStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.stats);
    } catch (err) {
      console.error(err);
    }
  };

  loadStats();
}, []);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Header */}

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

          <div>
            <h1 className="text-5xl font-bold">
              Welcome back,
              <span className="text-indigo-400"> {user?.name}</span> 👋
            </h1>

            <p className="text-gray-400 mt-4 text-lg">
              Ready to continue your learning journey?
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

          <motion.div whileHover={{ y: -5 }} className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-4xl">📚</p>
            <h2 className="text-3xl font-bold mt-3">{stats.subjects}</h2>
            <p className="text-gray-400 mt-2">Subjects</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-4xl">📝</p>
            <h2 className="text-3xl font-bold mt-3">{stats.notes}</h2>
            <p className="text-gray-400 mt-2">Notes</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-4xl">🧠</p>
            <h2 className="text-3xl font-bold mt-3">AI</h2>
            <p className="text-gray-400 mt-2">Quiz Generator</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-4xl">🎴</p>
            <h2 className="text-3xl font-bold mt-3">AI</h2>
            <p className="text-gray-400 mt-2">Flashcards</p>
          </motion.div>

        </div>

        {/* Quick Actions */}

        <div className="mt-14">

          <h2 className="text-3xl font-bold mb-6">
            ⚡ Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <Link
              to="/subjects"
              className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl p-8 transition"
            >
              <div className="text-5xl">📚</div>
              <h3 className="text-2xl font-bold mt-5">
                My Subjects
              </h3>
              <p className="mt-3 text-indigo-100">
                Manage all your study subjects.
              </p>
            </Link>

            <div className="bg-green-600 rounded-2xl p-8">
              <div className="text-5xl">✨</div>
              <h3 className="text-2xl font-bold mt-5">
                AI Summary
              </h3>
              <p className="mt-3">
                Generate summaries instantly.
              </p>
            </div>

            <div className="bg-purple-600 rounded-2xl p-8">
              <div className="text-5xl">🧠</div>
              <h3 className="text-2xl font-bold mt-5">
                AI Quiz
              </h3>
              <p className="mt-3">
                Create quizzes in one click.
              </p>
            </div>

          </div>

        </div>

        {/* Progress */}

        <div className="mt-16 bg-slate-900 rounded-2xl p-8 border border-slate-800">

          <div className="flex justify-between mb-4">

            <h2 className="text-2xl font-bold">
              🎯 Today's Goal
            </h2>

            <span className="text-indigo-400">
              72%
            </span>

          </div>

          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

            <div className="h-full w-[72%] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          </div>

          <p className="text-gray-400 mt-4">
            Keep studying to complete today's goal.
          </p>

        </div>

        {/* PDF Assistant */}

        <div className="mt-16">

          <PDFUploader />

        </div>

        {/* AI Features */}

        <div className="mt-16">

          <h2 className="text-3xl font-bold mb-6">
            🚀 AI Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-xl font-bold">
                ✨ AI Summary
              </h3>

              <p className="text-gray-400 mt-3">
                Generate concise summaries from your notes and PDFs.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-xl font-bold">
                🧠 Quiz Generator
              </h3>

              <p className="text-gray-400 mt-3">
                Instantly generate MCQs for revision.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-xl font-bold">
                🎴 Flashcards
              </h3>

              <p className="text-gray-400 mt-3">
                Revise using interactive AI flashcards.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-xl font-bold">
                📅 Study Planner
              </h3>

              <p className="text-gray-400 mt-3">
                Organize your study schedule efficiently.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;