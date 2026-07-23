import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="bg-indigo-600 py-20 mt-20 border-y border-indigo-500/30">
        <div className="max-w-5xl mx-auto text-center px-8">

          <h2 className="text-5xl font-bold text-white">
            Ready to Study Smarter?
          </h2>

          <p className="text-indigo-100 mt-6 text-lg">
            Join StudyHub AI and make your learning faster with
            AI-powered summaries, quizzes, flashcards, PDFs, and study plans.
          </p>

          <div className="mt-10 flex justify-center gap-4">

            <Link
              to="/register"
              className="bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition"
            >
              🚀 Get Started
            </Link>

            <Link
              to="/login"
              className="border border-white px-8 py-4 rounded-xl hover:bg-white hover:text-indigo-700 transition"
            >
              Login
            </Link>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="bg-slate-950 border-t border-slate-800 py-10"
      >
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">

          <div>

            <h3 className="text-3xl font-bold">
              StudyHub
              <span className="text-indigo-500">AI</span>
            </h3>

            <p className="text-slate-400 mt-3">
              AI-powered study platform built using the MERN Stack.
            </p>

          </div>

          <div className="mt-8 md:mt-0 text-slate-500 text-sm">
            © {new Date().getFullYear()} StudyHub AI. All rights reserved.
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;