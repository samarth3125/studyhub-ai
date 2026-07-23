import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Brain,
  Sparkles,
  Lightbulb,
  ListTree,
  BookMarked,
  Wand2,
  GraduationCap,
  Baby,
  Copy,
  Heart,
  Trash2,
  Star,
  LayoutList,
  Network,
  Download,
  HelpCircle,
  Layers,
} from "lucide-react";

import api from "../api/axios";
import {
  generateMindSpace,
  saveMindSpaceResponse,
  listSavedResponses,
  deleteSavedResponse,
} from "../api/mindspace";
import { generateQuiz } from "../api/quiz";
import { generateFlashcards } from "../api/flashcards";

import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { CardSkeleton, Skeleton } from "../components/ui/Skeleton";
import Spinner from "../components/ui/Spinner";
import TypingMarkdown from "../components/ui/TypingMarkdown";
import Markdown from "../components/ui/Markdown";
import Badge from "../components/ui/Badge";
import SectionedResult from "../components/ui/SectionedResult";
import ConceptTree from "../components/ui/ConceptTree";
import QuizCard from "../components/QuizCard";
import Flashcard from "../components/Flashcard";
import { parseSections, buildConceptTree } from "../utils/parseMindMap";

const MODES = [
  { key: "explain", label: "Explain", icon: Brain, tone: "indigo" },
  { key: "simplify", label: "Simplify", icon: Wand2, tone: "purple" },
  { key: "example", label: "Examples", icon: ListTree, tone: "green" },
  { key: "mnemonic", label: "Mnemonic", icon: BookMarked, tone: "amber" },
  { key: "analogy", label: "Analogy", icon: Lightbulb, tone: "slate" },
  { key: "beginner", label: "For Beginners", icon: Baby, tone: "green" },
  { key: "exam", label: "For Exams", icon: GraduationCap, tone: "red" },
];

const MindSpace = () => {
  const [tab, setTab] = useState("generate");

  const [concept, setConcept] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [mode, setMode] = useState("explain");

  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  const [saved, setSaved] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [resultView, setResultView] = useState("sections");
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [flashcards, setFlashcards] = useState(null);
  const [flashcardLoading, setFlashcardLoading] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data.subjects || []);
    } catch {
      // optional context, ignore
    }
  };

  const fetchSaved = async () => {
    try {
      setSavedLoading(true);
      const data = await listSavedResponses();
      setSaved(data.saved || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load saved responses");
    } finally {
      setSavedLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchSaved();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!concept.trim() || generating) return;

    try {
      setGenerating(true);
      setResult(null);
      setQuiz(null);
      setFlashcards(null);
      setResultView("sections");
      const data = await generateMindSpace({ mode, concept: concept.trim(), subject });
      setResult(data);
      setAnimateResult(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!result || quizLoading) return;
    try {
      setQuizLoading(true);
      const res = await generateQuiz(result.response);
      setQuiz(res.questions);
    } catch (error) {
      toast.error(error.response?.data?.message || "Quiz generation failed");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!result || flashcardLoading) return;
    try {
      setFlashcardLoading(true);
      const res = await generateFlashcards(result.response);
      setFlashcards(res.cards);
      setFlashcardIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Flashcard generation failed");
    } finally {
      setFlashcardLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!result) return;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      toast.error("Please allow pop-ups to export as PDF");
      return;
    }
    const body = document.getElementById("mindspace-result-content")?.innerHTML || "";
    printWindow.document.write(`
      <html>
        <head>
          <title>${result.concept} — StudyHub AI</title>
          <style>
            body { font-family: -apple-system, Segoe UI, sans-serif; color: #1e293b; padding: 32px; max-width: 720px; margin: 0 auto; }
            h1 { font-size: 22px; margin-bottom: 4px; }
            h2 { font-size: 16px; margin-top: 20px; color: #4338ca; }
            p, li { font-size: 13px; line-height: 1.6; }
            .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
          </style>
        </head>
        <body>
          <h1>${result.concept}</h1>
          <p class="meta">Generated with StudyHub AI Mind Space</p>
          ${body}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleSave = async () => {
    if (!result || saving) return;
    try {
      setSaving(true);
      const data = await saveMindSpaceResponse({
        mode: result.mode,
        concept: result.concept,
        response: result.response,
        subject: result.subject,
      });
      setSavedIds((prev) => new Set(prev).add(data.saved._id));
      toast.success("Saved to favourites");
      fetchSaved();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleDeleteSaved = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteSavedResponse(deleteTarget._id);
      toast.success("Removed from favourites");
      setDeleteTarget(null);
      fetchSaved();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const modeMeta = (key) => MODES.find((m) => m.key === key) || MODES[0];

  return (
    <div>
      <PageHeader
        title="AI Mind Space"
        description="Turn any concept into an explanation, example, mnemonic, or exam-ready summary."
      />

      <div className="flex gap-2 mb-8 border-b border-slate-900">
        {[
          { key: "generate", label: "Generate" },
          { key: "saved", label: `Saved (${saved.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "generate" ? (
        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="p-6 lg:col-span-2 h-fit">
            <form onSubmit={handleGenerate} className="space-y-5">
              <Input
                label="Concept or topic"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. Binary Search Trees"
                required
              />

              <Select
                label="Subject (optional)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">No specific subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </Select>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MODES.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMode(key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        mode === key
                          ? "bg-indigo-600/15 border-indigo-500/40 text-indigo-300"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                icon={Sparkles}
                fullWidth
                loading={generating}
                disabled={!concept.trim()}
              >
                Generate
              </Button>
            </form>
          </Card>

          <div className="lg:col-span-3">
            {generating ? (
              <Card className="p-6 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ) : !result ? (
              <EmptyState
                icon={Brain}
                title="Nothing generated yet"
                description="Pick a mode, enter a concept, and generate an AI explanation to see it here."
              />
            ) : (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone={modeMeta(result.mode).tone} icon={modeMeta(result.mode).icon}>
                      {modeMeta(result.mode).label}
                    </Badge>
                    <span className="text-slate-200 font-medium text-sm">
                      {result.concept}
                    </span>
                  </div>

                  {/* View toggle: sections vs concept tree */}
                  <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => setResultView("sections")}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        resultView === "sections"
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <LayoutList size={13} />
                      Sections
                    </button>
                    <button
                      onClick={() => setResultView("tree")}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        resultView === "tree"
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Network size={13} />
                      Concept Map
                    </button>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2 flex-wrap mb-5 pb-5 border-b border-slate-800">
                  <button
                    onClick={() => handleCopy(result.response)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                  >
                    <Copy size={13} />
                    Copy
                  </button>
                  <Button size="sm" variant="outline" icon={Heart} loading={saving} onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={HelpCircle}
                    loading={quizLoading}
                    onClick={handleGenerateQuiz}
                  >
                    Generate Quiz
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Layers}
                    loading={flashcardLoading}
                    onClick={handleGenerateFlashcards}
                  >
                    Generate Flashcards
                  </Button>
                  <button
                    onClick={handleExportPdf}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                  >
                    <Download size={13} />
                    Export PDF
                  </button>
                </div>

                <div id="mindspace-result-content">
                  {resultView === "sections" ? (
                    animateResult ? (
                      <TypingMarkdown
                        text={result.response}
                        animate={animateResult}
                        onDone={() => setAnimateResult(false)}
                      />
                    ) : (
                      <SectionedResult sections={parseSections(result.response)} />
                    )
                  ) : (
                    <ConceptTree
                      tree={buildConceptTree(result.concept, parseSections(result.response))}
                    />
                  )}
                </div>

                {quiz && quiz.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
                      <HelpCircle size={14} className="text-indigo-400" />
                      Quiz
                    </h4>
                    <QuizCard questions={quiz} />
                  </div>
                )}

                {flashcards && flashcards.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                        <Layers size={14} className="text-indigo-400" />
                        Flashcards
                      </h4>
                      <span className="text-xs text-slate-500">
                        Card {flashcardIndex + 1} / {flashcards.length}
                      </span>
                    </div>
                    <Flashcard
                      question={flashcards[flashcardIndex].question}
                      answer={flashcards[flashcardIndex].answer}
                    />
                    <div className="flex justify-between mt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={flashcardIndex === 0}
                        onClick={() => setFlashcardIndex((i) => Math.max(0, i - 1))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={flashcardIndex === flashcards.length - 1}
                        onClick={() =>
                          setFlashcardIndex((i) => Math.min(flashcards.length - 1, i + 1))
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      ) : savedLoading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No saved responses yet"
          description="Generate an explanation and hit Save to build your favourites collection."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          <AnimatePresence>
            {saved.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Card className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge tone={modeMeta(item.mode).tone} icon={modeMeta(item.mode).icon}>
                        {modeMeta(item.mode).label}
                      </Badge>
                      {item.subject?.name && (
                        <Badge tone="slate">{item.subject.name}</Badge>
                      )}
                    </div>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 mb-2">
                    {item.concept}
                  </h3>

                  <div className="flex-1 max-h-40 overflow-y-auto pr-1">
                    <Markdown className="text-xs">{item.response}</Markdown>
                  </div>

                  <button
                    onClick={() => handleCopy(item.response)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-3 pt-3 border-t border-slate-800/70 self-start transition-colors"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this from favourites?"
        description={`"${deleteTarget?.concept}" will be permanently removed from your saved responses.`}
        confirmLabel="Remove"
        loading={deleting}
        onConfirm={handleDeleteSaved}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MindSpace;
