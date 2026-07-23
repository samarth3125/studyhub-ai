import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  X,
} from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { CardSkeleton } from "../components/ui/Skeleton";

const cardAccents = [
  "from-indigo-500/20 to-transparent",
  "from-purple-500/20 to-transparent",
  "from-sky-500/20 to-transparent",
  "from-emerald-500/20 to-transparent",
];

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data.subjects);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (editingId) {
        await api.put(`/subjects/${editingId}`, { name, description });
        toast.success("Subject updated");
      } else {
        await api.post("/subjects", { name, description });
        toast.success("Subject created");
      }

      resetForm();
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setName(subject.name);
    setDescription(subject.description);
    setEditingId(subject._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await api.delete(`/subjects/${deleteTarget._id}`);
      toast.success("Subject deleted");
      setDeleteTarget(null);
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div>
      <PageHeader
        title="My Subjects"
        description="Organize your learning into focused subjects."
        actions={
          <Button
            icon={Plus}
            onClick={() => {
              resetForm();
              setShowForm((s) => !s);
            }}
          >
            {showForm ? "Close" : "New Subject"}
          </Button>
        }
      />

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-100">
                  {editingId ? "Edit Subject" : "Create a new subject"}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Subject name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Data Structures"
                  required
                />
                <Input
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional short description"
                />
              </div>

              <Button type="submit" className="mt-5" loading={submitting}>
                {editingId ? "Save changes" : "Create subject"}
              </Button>
            </Card>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Create your first subject to start organizing notes and generating AI study material."
          action={
            <Button icon={Plus} onClick={() => setShowForm(true)}>
              Create your first subject
            </Button>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, i) => (
            <Card
              key={subject._id}
              hover
              className="relative overflow-hidden p-6 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${
                  cardAccents[i % cardAccents.length]
                } rounded-full blur-2xl pointer-events-none`}
              />

              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4">
                <BookOpen size={18} className="text-indigo-400" />
              </div>

              <h2 className="text-lg font-semibold text-slate-100">
                {subject.name}
              </h2>

              <p className="text-slate-400 text-sm mt-2 leading-6 line-clamp-2 flex-1">
                {subject.description || "No description added."}
              </p>

              <div className="flex items-center gap-2 mt-6">
                <Link
                  to={`/subjects/${subject._id}/notes`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                >
                  Open Notes
                  <ArrowRight size={15} />
                </Link>

                <button
                  onClick={() => handleEdit(subject)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Edit subject"
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={() => setDeleteTarget(subject)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors"
                  title="Delete subject"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this subject?"
        description={`"${deleteTarget?.name}" and all of its notes will be permanently removed. This can't be undone.`}
        confirmLabel="Delete subject"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Subjects;
