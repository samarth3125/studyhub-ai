import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data.subjects);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/subjects/${editingId}`, {
          name,
          description,
        });
      } else {
        await api.post("/subjects", {
          name,
          description,
        });
      }

      setName("");
      setDescription("");
      setEditingId(null);

      fetchSubjects();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (subject) => {
    setName(subject.name);
    setDescription(subject.description);
    setEditingId(subject._id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

       <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300">
        ← Back to dashboard
      </Link>
      <h1 className="text-4xl font-bold mb-2 mt-5">My Subjects 📚</h1>

      <p className="text-gray-400 mb-8">
        Organize your learning subjects
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl mb-8"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Subject name"
          required
          className="bg-slate-800 p-3 rounded-lg mr-4"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="bg-slate-800 p-3 rounded-lg mr-4"
        />

        <button className="bg-indigo-600 px-5 py-3 rounded-lg">
          {editingId ? "Update Subject" : "Add Subject"}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject._id}
            className="bg-slate-900 p-6 rounded-xl"
          >
            <h2 className="text-xl font-bold">{subject.name}</h2>

            <p className="text-gray-400 mt-2">
              {subject.description}
            </p>

            <div className="flex gap-3 mt-5">
              <Link
  to={`/subjects/${subject._id}/notes`}
  className="inline-block mt-5 bg-indigo-600 px-4 py-2 rounded-lg"
>
  Open Notes
</Link>
              <button
                onClick={() => handleEdit(subject)}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(subject._id)}
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

export default Subjects;