import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PDFUploader from "../components/PDFUploader";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">

        <h1 className="text-5xl font-bold">
          Welcome, <span className="text-indigo-400">{user?.name}</span> 👋
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-2xl">
          Your personal AI-powered learning assistant.
          Organize subjects, write notes, generate AI summaries,
          and prepare smarter for your exams.
        </p>

        <div className="flex gap-4 mt-10">

          <Link
            to="/subjects"
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold transition"
          >
            📚 My Subjects
          </Link>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold transition"
          >
            Logout
          </button>

        </div>

        {/* Features */}

        <div className="grid md:grid-cols-3 gap-6 mt-16">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500 transition">
            <div className="text-4xl">📚</div>

            <h2 className="text-xl font-bold mt-4">
              Manage Subjects
            </h2>

            <p className="text-gray-400 mt-3">
              Create and organize subjects for every semester.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 transition">
            <div className="text-4xl">📝</div>

            <h2 className="text-xl font-bold mt-4">
              Smart Notes
            </h2>

            <p className="text-gray-400 mt-3">
              Write, edit and manage all your study notes.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-yellow-500 transition">
            <div className="text-4xl">🤖</div>

            <h2 className="text-xl font-bold mt-4">
              AI Summaries
            </h2>

            <p className="text-gray-400 mt-3">
              Generate concise summaries instantly using AI.
            </p>
          </div>

        </div>

        {/* Upcoming Features */}

        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <PDFUploader />
          <h2 className="text-2xl font-bold mb-6">
            🚀 Coming Soon
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

           

            

            <div className="bg-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-lg">
                🎴 Flashcards
              </h3>

              <p className="text-gray-400 mt-2">
                Create AI flashcards automatically from notes.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-lg">
                💬 Ask AI
              </h3>

              <p className="text-gray-400 mt-2">
                Chat with AI about your study material.
              </p>
            </div>
           

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;