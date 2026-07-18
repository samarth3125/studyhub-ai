import { summarizeNote } from "../api/ai";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { generateQuiz } from "../api/quiz";
import QuizCard from "../components/QuizCard";

const Notes = () => {
  const { subjectId } = useParams();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [summaries, setSummaries] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const [quizzes, setQuizzes] = useState({});
const [quizLoadingId, setQuizLoadingId] = useState(null);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get(`/notes/subject/${subjectId}`);
      setNotes(data.notes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/notes/${editingId}`, {
          title,
          content,
        });
      } else {
        await api.post("/notes", {
          title,
          content,
          subject: subjectId,
        });
      }

      setTitle("");
      setContent("");
      setEditingId(null);

      fetchNotes();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleSummarize = async (note) => {
    try {
      setLoadingId(note._id);

      const res = await summarizeNote(note.content);

      setSummaries((prev) => ({
        ...prev,
        [note._id]: res.summary,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to summarize");
    } finally {
      setLoadingId(null);
    }
  };

  const handleGenerateQuiz = async (note) => {
  try {
    setQuizLoadingId(note._id);

    const res = await generateQuiz(note.content);

    setQuizzes((prev) => ({
      ...prev,
      [note._id]: res.questions,
    }));
  } catch (err) {
    console.error(err);
    alert("Failed to generate quiz");
  } finally {
    setQuizLoadingId(null);
  }
};

  useEffect(() => {
    fetchNotes();
  }, [subjectId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <Link to="/subjects" className="text-indigo-400 hover:text-indigo-300">
        ← Back to Subjects
      </Link>

      <h1 className="text-4xl font-bold mt-5 mb-8">
        📝 My Notes
      </h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10 shadow-lg"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          required
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 mb-5 outline-none focus:border-indigo-500"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your notes here..."
          required
          rows="8"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-indigo-500"
        />

        <p className="text-right text-gray-500 mt-2">
          {content.length} characters
        </p>

        <button className="mt-5 bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold">
          {editingId ? "💾 Update Note" : "➕ Add Note"}
        </button>
      </form>

      {/* EMPTY STATE */}

      {notes.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📝</div>

          <h2 className="text-2xl font-bold">
            No Notes Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Create your first note to start studying.
          </p>
        </div>
      ) : (

        <div className="grid lg:grid-cols-2 gap-6">

          {notes.map((note) => (

            <div
              key={note._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/20 transition-all"
            >

              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-2xl font-bold">
                    {note.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs">
                  Note
                </span>

              </div>

              <p className="text-gray-300 whitespace-pre-wrap leading-7 mt-5">
                {note.content}
              </p>

              <button
                onClick={() => handleSummarize(note)}
                disabled={loadingId === note._id}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold"
              >
                {loadingId === note._id
                  ? "⏳ AI is thinking..."
                  : "✨ Generate AI Summary"}
              </button>

              <button
  onClick={() => handleGenerateQuiz(note)}
  disabled={quizLoadingId === note._id}
  className="w-full mt-3 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold"
>
  {quizLoadingId === note._id
    ? "🧠 Creating Quiz..."
    : "🧠 Generate Quiz"}
</button>

              {summaries[note._id] && (

                <div className="mt-5 bg-slate-800 border border-green-500/30 rounded-xl p-5">

                  <div className="flex justify-between items-center mb-3">

                    <h3 className="text-green-400 font-bold text-lg">
                      ✨ AI Summary
                    </h3>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          summaries[note._id]
                        )
                      }
                      className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm"
                    >
                      📋 Copy
                    </button>

                  </div>

                  <p className="text-gray-300 whitespace-pre-wrap leading-7">
                    {summaries[note._id]}
                  </p>

                </div>

              )}

              {quizzes[note._id] && (
  <QuizCard
    questions={quizzes[note._id]}
  />
)}

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() => handleEdit(note)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl"
                >
                  ✏ Edit
                </button>

                <button
                  onClick={() => handleDelete(note._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl"
                >
                  🗑 Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Notes;