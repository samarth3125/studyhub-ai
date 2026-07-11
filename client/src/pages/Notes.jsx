import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const Notes = () => {
  const { subjectId } = useParams();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get(
        `/notes/subject/${subjectId}`
      );

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

  useEffect(() => {
    fetchNotes();
  }, [subjectId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <Link to="/subjects" className="text-indigo-400">
        ← Back to Subjects
      </Link>

      <h1 className="text-4xl font-bold mt-5 mb-8">
        My Notes 📝
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl mb-8"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          required
          className="w-full bg-slate-800 p-3 rounded-lg mb-4"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your notes..."
          required
          rows="6"
          className="w-full bg-slate-800 p-3 rounded-lg mb-4"
        />

        <button className="bg-indigo-600 px-5 py-3 rounded-lg">
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-slate-900 p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold">
              {note.title}
            </h2>

            <p className="text-gray-400 mt-3 whitespace-pre-wrap">
              {note.content}
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => handleEdit(note)}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;