import { summarizeNote } from "../api/ai";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  NotebookPen,
  Plus,
  Search,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Sparkles,
  Brain,
  Layers,
  Copy,
  X,
} from "lucide-react";
import api from "../api/axios";
import { generateQuiz } from "../api/quiz";
import QuizCard from "../components/QuizCard";
import { generateFlashcards } from "../api/flashcards";
import Flashcard from "../components/Flashcard";
import AIChat from "../components/AIChat";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { CardSkeleton } from "../components/ui/Skeleton";

const filterChips = [
  { key: "all", label: "All Notes" },
  { key: "pinned", label: "Pinned" },
  { key: "recent-updated", label: "Recently Updated" },
  { key: "recent-created", label: "Recently Created" },
];

const Notes = () => {
  const { subjectId } = useParams();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pinningId, setPinningId] = useState(null);

  const [summaries, setSummaries] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const [quizzes, setQuizzes] = useState({});
  const [quizLoadingId, setQuizLoadingId] = useState(null);
  const [flashcards, setFlashcards] = useState({});
  const [flashcardLoadingId, setFlashcardLoadingId] = useState(null);
  const [currentCard, setCurrentCard] = useState({});

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("all");

  const fetchNotes = async () => {
    try {
      const { data } = await api.get(`/notes/subject/${subjectId}`);
      setNotes(data.notes);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleGenerateFlashcards = async (note) => {
    try {
      setFlashcardLoadingId(note._id);

      const res = await generateFlashcards(note.content);

      setFlashcards((prev) => ({ ...prev, [note._id]: res.cards }));
      setCurrentCard((prev) => ({ ...prev, [note._id]: 0 }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate flashcards");
    } finally {
      setFlashcardLoadingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (editingId) {
        await api.put(`/notes/${editingId}`, { title, content });
        toast.success("Note updated");
      } else {
        await api.post("/notes", { title, content, subject: subjectId });
        toast.success("Note created");
      }

      resetForm();
      fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await api.delete(`/notes/${deleteTarget._id}`);
      toast.success("Note deleted");
      setDeleteTarget(null);
      fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePin = async (note) => {
    try {
      setPinningId(note._id);
      const { data } = await api.patch(`/notes/${note._id}/pin`);
      toast.success(data.note.pinned ? "Note pinned" : "Note unpinned");
      fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update pin");
    } finally {
      setPinningId(null);
    }
  };

  const handleSummarize = async (note) => {
    try {
      setLoadingId(note._id);
      const res = await summarizeNote(note.content);
      setSummaries((prev) => ({ ...prev, [note._id]: res.summary }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to summarize");
    } finally {
      setLoadingId(null);
    }
  };

  const handleGenerateQuiz = async (note) => {
    try {
      setQuizLoadingId(note._id);
      const res = await generateQuiz(note.content);
      setQuizzes((prev) => ({ ...prev, [note._id]: res.questions }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate quiz");
    } finally {
      setQuizLoadingId(null);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  const visibleNotes = useMemo(() => {
    let list = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "pinned") list = list.filter((n) => n.pinned);

    list = [...list];

    if (filter === "recent-updated" || sortBy === "newest") {
      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    if (filter === "recent-created" || sortBy === "oldest") {
      list.sort(
        (a, b) =>
          new Date(sortBy === "oldest" ? a.createdAt : b.createdAt) -
          new Date(sortBy === "oldest" ? b.createdAt : a.createdAt)
      );
    }
    if (sortBy === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "za") list.sort((a, b) => b.title.localeCompare(a.title));

    // Pinned notes always float to the top, regardless of sort/filter.
    list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return list;
  }, [notes, search, sortBy, filter]);

  const pinnedCount = notes.filter((n) => n.pinned).length;

  return (
    <div>
      <PageHeader
        backTo="/subjects"
        backLabel="Back to Subjects"
        title="My Notes"
        description={
          pinnedCount > 0
            ? `${notes.length} notes • ${pinnedCount} pinned`
            : `${notes.length} notes in this subject`
        }
        actions={
          <Button
            icon={Plus}
            onClick={() => {
              resetForm();
              setShowForm((s) => !s);
            }}
          >
            {showForm ? "Close" : "New Note"}
          </Button>
        }
      />

      {/* Search + sort + filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="md:w-56"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filterChips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setFilter(chip.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === chip.key
                ? "bg-indigo-600/15 text-indigo-300 border-indigo-500/40"
                : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            {chip.label}
            {chip.key === "pinned" && pinnedCount > 0 && (
              <span className="ml-1.5 opacity-70">({pinnedCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <Card className="p-6 mb-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-100">
                  {editingId ? "Edit Note" : "Create a new note"}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X size={18} />
                </button>
              </div>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                required
                className="mb-4"
              />

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your notes here..."
                required
                rows={7}
              />

              <p className="text-right text-slate-500 text-xs mt-2">
                {content.length} characters
              </p>

              <Button type="submit" className="mt-3" loading={submitting}>
                {editingId ? "Save changes" : "Add note"}
              </Button>
            </Card>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Notes list */}
      {loading ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : visibleNotes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={notes.length === 0 ? "No notes yet" : "No notes match your filters"}
          description={
            notes.length === 0
              ? "Create your first note to start studying with AI."
              : "Try a different search term or filter."
          }
          action={
            notes.length === 0 && (
              <Button icon={Plus} onClick={() => setShowForm(true)}>
                Create your first note
              </Button>
            )
          }
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {visibleNotes.map((note, i) => (
            <Card
              key={note._id}
              hover
              className={`p-6 flex flex-col ${
                note.pinned ? "border-indigo-500/40" : ""
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {note.pinned && (
                      <Badge tone="indigo" icon={Pin}>
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-100 mt-2">
                    {note.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleTogglePin(note)}
                  disabled={pinningId === note._id}
                  title={note.pinned ? "Unpin note" : "Pin note"}
                  className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border transition-colors ${
                    note.pinned
                      ? "bg-indigo-600/15 border-indigo-500/40 text-indigo-300"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40"
                  }`}
                >
                  {note.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                </button>
              </div>

              <p className="text-slate-300 whitespace-pre-wrap leading-7 mt-5 line-clamp-3">
                {note.content}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-6">
                <Button
                  variant="success"
                  size="sm"
                  icon={Sparkles}
                  loading={loadingId === note._id}
                  onClick={() => handleSummarize(note)}
                >
                  Summary
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={Brain}
                  loading={quizLoadingId === note._id}
                  className="!bg-purple-600/90 hover:!bg-purple-600 !border-purple-500/50"
                  onClick={() => handleGenerateQuiz(note)}
                >
                  Quiz
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={Layers}
                  loading={flashcardLoadingId === note._id}
                  className="!bg-orange-600/90 hover:!bg-orange-600 !border-orange-500/50"
                  onClick={() => handleGenerateFlashcards(note)}
                >
                  Cards
                </Button>
              </div>

              {flashcards[note._id] && (
                <div className="mt-5 bg-slate-950/60 border border-orange-500/30 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-orange-400 font-semibold text-sm flex items-center gap-1.5">
                      <Layers size={14} />
                      Flashcards
                    </h3>
                    <span className="text-xs text-slate-400">
                      Card {currentCard[note._id] + 1} / {flashcards[note._id].length}
                    </span>
                  </div>

                  <Flashcard
                    question={flashcards[note._id][currentCard[note._id]].question}
                    answer={flashcards[note._id][currentCard[note._id]].answer}
                  />

                  <div className="flex justify-between mt-5">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentCard[note._id] === 0}
                      onClick={() =>
                        setCurrentCard((prev) => ({
                          ...prev,
                          [note._id]: prev[note._id] - 1,
                        }))
                      }
                    >
                      ← Previous
                    </Button>

                    <Button
                      size="sm"
                      className="!bg-orange-600 hover:!bg-orange-500 !border-orange-500/50"
                      disabled={
                        currentCard[note._id] ===
                        flashcards[note._id].length - 1
                      }
                      onClick={() =>
                        setCurrentCard((prev) => ({
                          ...prev,
                          [note._id]: prev[note._id] + 1,
                        }))
                      }
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {summaries[note._id] && (
                <div className="mt-5 bg-slate-950/60 border border-emerald-500/30 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-emerald-400 font-semibold text-sm flex items-center gap-1.5">
                      <Sparkles size={14} />
                      AI Summary
                    </h3>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(summaries[note._id]);
                        toast.success("Copied to clipboard");
                      }}
                      className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <p className="text-slate-300 whitespace-pre-wrap leading-7 text-sm">
                    {summaries[note._id]}
                  </p>
                </div>
              )}

              {quizzes[note._id] && <QuizCard questions={quizzes[note._id]} />}

              <AIChat note={note} />

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Pencil}
                  fullWidth
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  fullWidth
                  className="hover:!bg-red-500/10 hover:!text-red-400 hover:!border-red-500/40"
                  onClick={() => setDeleteTarget(note)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this note?"
        description={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete note"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Notes;
