import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Plus,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Copy,
  RotateCcw,
  Send,
  Sparkles,
  Menu,
  BookOpen,
  Brain,
  Layers,
  Download,
} from "lucide-react";

import api from "../api/axios";
import {
  listConversations,
  createConversation,
  getConversation,
  renameConversation,
  moveConversation,
  deleteConversation,
  sendWorkspaceMessage,
  regenerateResponse,
} from "../api/chat";
import { generateQuiz } from "../api/quiz";
import { generateFlashcards } from "../api/flashcards";

import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { Skeleton } from "../components/ui/Skeleton";
import Spinner from "../components/ui/Spinner";
import TypingMarkdown from "../components/ui/TypingMarkdown";
import QuizCard from "../components/QuizCard";
import Flashcard from "../components/Flashcard";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const Workspace = () => {
  const { id: activeId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [active, setActive] = useState(null);
  const [activeLoading, setActiveLoading] = useState(false);

  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [justGeneratedId, setJustGeneratedId] = useState(null);
  const [mobileListOpen, setMobileListOpen] = useState(!activeId);

  const [quizzes, setQuizzes] = useState({});
  const [quizLoadingId, setQuizLoadingId] = useState(null);
  const [flashcards, setFlashcards] = useState({});
  const [currentCard, setCurrentCard] = useState({});
  const [flashcardLoadingId, setFlashcardLoadingId] = useState(null);

  const scrollRef = useRef(null);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data.subjects || []);
    } catch {
      // subjects are optional context here; fail silently
    }
  };

  const fetchConversations = async (opts = {}) => {
    try {
      setListLoading(true);
      const data = await listConversations({
        search: opts.search ?? search,
        subject: opts.subjectFilter ?? subjectFilter,
      });
      setConversations(data.conversations || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchConversations({ search, subjectFilter });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, subjectFilter]);

  const loadActive = async (id) => {
    if (!id) {
      setActive(null);
      return;
    }
    try {
      setActiveLoading(true);
      const data = await getConversation(id);
      setActive(data.conversation);
    } catch (error) {
      toast.error(error.response?.data?.message || "Chat not found");
      navigate("/workspace");
    } finally {
      setActiveLoading(false);
    }
  };

  useEffect(() => {
    loadActive(activeId);
    setJustGeneratedId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active?.messages?.length]);

  const handleNewChat = async () => {
    try {
      const data = await createConversation({});
      await fetchConversations();
      navigate(`/workspace/${data.conversation._id}`);
      setMobileListOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not start a new chat");
    }
  };

  const startRename = (conv) => {
    setRenamingId(conv._id);
    setRenameValue(conv.title);
  };

  const commitRename = async (id) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    try {
      await renameConversation(id, renameValue.trim());
      setRenamingId(null);
      fetchConversations();
      if (active?._id === id) {
        setActive((a) => ({ ...a, title: renameValue.trim() }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Rename failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteConversation(deleteTarget._id);
      toast.success("Chat deleted");
      setDeleteTarget(null);
      if (active?._id === deleteTarget._id) {
        navigate("/workspace");
      }
      fetchConversations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleAssignSubject = async (subjectId) => {
    if (!active) return;
    try {
      const data = await moveConversation(active._id, subjectId || null);
      setActive(data.conversation);
      fetchConversations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update subject");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;

    let convo = active;

    try {
      setSending(true);

      if (!convo) {
        const created = await createConversation({});
        convo = created.conversation;
        setActive(convo);
        navigate(`/workspace/${convo._id}`, { replace: true });
      }

      const content = draft.trim();
      setDraft("");

      const optimistic = {
        ...convo,
        messages: [...convo.messages, { _id: `temp-${Date.now()}`, role: "user", content }],
      };
      setActive(optimistic);

      const data = await sendWorkspaceMessage(convo._id, content);
      setActive(data.conversation);

      const lastMsg = data.conversation.messages[data.conversation.messages.length - 1];
      setJustGeneratedId(lastMsg._id);

      fetchConversations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Message failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleRegenerate = async () => {
    if (!active || regenerating) return;
    try {
      setRegenerating(true);
      const data = await regenerateResponse(active._id);
      setActive(data.conversation);
      const lastMsg = data.conversation.messages[data.conversation.messages.length - 1];
      setJustGeneratedId(lastMsg._id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not regenerate");
    } finally {
      setRegenerating(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleExport = (msg) => {
    const blob = new Blob([msg.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(active?.title || "response").replace(/[^\w-]+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as Markdown");
  };

  const handleGenerateQuiz = async (msg) => {
    try {
      setQuizLoadingId(msg._id);
      const res = await generateQuiz(msg.content);
      setQuizzes((prev) => ({ ...prev, [msg._id]: res.questions }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate quiz");
    } finally {
      setQuizLoadingId(null);
    }
  };

  const handleGenerateFlashcards = async (msg) => {
    try {
      setFlashcardLoadingId(msg._id);
      const res = await generateFlashcards(msg.content);
      setFlashcards((prev) => ({ ...prev, [msg._id]: res.cards }));
      setCurrentCard((prev) => ({ ...prev, [msg._id]: 0 }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate flashcards");
    } finally {
      setFlashcardLoadingId(null);
    }
  };

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ value: s._id, label: s.name })),
    [subjects]
  );

  const lastAssistantId = useMemo(() => {
    if (!active?.messages?.length) return null;
    const last = active.messages[active.messages.length - 1];
    return last.role === "assistant" ? last._id : null;
  }, [active]);

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-900 space-y-3">
        <Button icon={Plus} fullWidth onClick={handleNewChat}>
          New Chat
        </Button>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
          />
        </div>

        <Select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="!py-2.5 text-sm"
        >
          <option value="">All subjects</option>
          {subjectOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {listLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-2" />
          ))
        ) : conversations.length === 0 ? (
          <div className="px-3 py-10 text-center text-sm text-slate-500">
            {search || subjectFilter
              ? "No chats match your filters."
              : "No chats yet — start one above."}
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className={`group relative rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${
                activeId === conv._id
                  ? "bg-indigo-600/15 border border-indigo-500/30"
                  : "hover:bg-slate-900 border border-transparent"
              }`}
              onClick={() => {
                if (renamingId === conv._id) return;
                navigate(`/workspace/${conv._id}`);
                setMobileListOpen(false);
              }}
            >
              {renamingId === conv._id ? (
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename(conv._id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    className="flex-1 min-w-0 bg-slate-950 border border-indigo-500/50 rounded-lg px-2 py-1 text-sm text-slate-100 outline-none"
                  />
                  <button
                    onClick={() => commitRename(conv._id)}
                    className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setRenamingId(null)}
                    className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200 truncate pr-1">
                      {conv.title}
                    </p>
                    <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">
                      {timeAgo(conv.updatedAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate mt-1 pr-12">
                    {conv.lastMessagePreview || "No messages yet"}
                  </p>

                  {conv.subject?.name && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5">
                      <BookOpen size={9} />
                      {conv.subject.name}
                    </span>
                  )}

                  <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1 bg-slate-950/90 rounded-lg backdrop-blur-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(conv);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md"
                      title="Rename"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(conv);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-slate-900 bg-slate-950/60">
        {sidebar}
      </aside>

      {/* Sidebar - mobile drawer */}
      <AnimatePresence>
        {mobileListOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileListOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full bg-slate-950 border-r border-slate-900 overflow-y-auto"
            >
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main panel */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col">
        {/* Chat header */}
        <div className="h-16 shrink-0 border-b border-slate-900 flex items-center justify-between px-4 sm:px-6 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileListOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-900 text-slate-300"
            >
              <Menu size={19} />
            </button>
            <div className="min-w-0">
              <h1 className="font-semibold text-slate-100 truncate">
                {active?.title || "AI Workspace"}
              </h1>
              {!active && (
                <p className="text-xs text-slate-500">
                  Persistent AI conversations for your studies
                </p>
              )}
            </div>
          </div>

          {active && (
            <div className="w-40 sm:w-52 shrink-0">
              <Select
                value={active.subject?._id || ""}
                onChange={(e) => handleAssignSubject(e.target.value)}
                className="!py-2 text-xs"
              >
                <option value="">No subject</option>
                {subjectOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {activeLoading ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-16 w-2/3" />
              <Skeleton className="h-24 w-3/4 ml-auto" />
              <Skeleton className="h-20 w-2/3" />
            </div>
          ) : !active ? (
            <EmptyState
              icon={Sparkles}
              title="Start a new conversation"
              description="Ask anything about your studies — the AI Workspace remembers the full conversation as you go."
              className="mt-10"
              action={
                <Button icon={Plus} onClick={handleNewChat}>
                  New Chat
                </Button>
              }
            />
          ) : active.messages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No messages yet"
              description="Send a message below to get started."
              className="mt-10 border-none bg-transparent"
            />
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              {active.messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-900/70 border border-slate-800"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <>
                        <TypingMarkdown
                          text={msg.content}
                          animate={msg._id === justGeneratedId}
                        />
                        <div className="flex items-center flex-wrap gap-3 mt-3 pt-2 border-t border-slate-800/70">
                          <button
                            onClick={() => handleCopy(msg.content)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            <Copy size={11} />
                            Copy
                          </button>
                          {msg._id === lastAssistantId && (
                            <button
                              onClick={handleRegenerate}
                              disabled={regenerating}
                              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-400 transition-colors disabled:opacity-50"
                            >
                              {regenerating ? (
                                <Spinner size={11} />
                              ) : (
                                <RotateCcw size={11} />
                              )}
                              Regenerate
                            </button>
                          )}
                          <button
                            onClick={() => handleGenerateQuiz(msg)}
                            disabled={quizLoadingId === msg._id}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-purple-400 transition-colors disabled:opacity-50"
                          >
                            {quizLoadingId === msg._id ? (
                              <Spinner size={11} />
                            ) : (
                              <Brain size={11} />
                            )}
                            Generate Quiz
                          </button>
                          <button
                            onClick={() => handleGenerateFlashcards(msg)}
                            disabled={flashcardLoadingId === msg._id}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
                          >
                            {flashcardLoadingId === msg._id ? (
                              <Spinner size={11} />
                            ) : (
                              <Layers size={11} />
                            )}
                            Flashcards
                          </button>
                          <button
                            onClick={() => handleExport(msg)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            <Download size={11} />
                            Export
                          </button>
                        </div>

                        {quizzes[msg._id] && <QuizCard questions={quizzes[msg._id]} />}

                        {flashcards[msg._id] && (
                          <div className="mt-5">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                                <Layers size={12} />
                                Flashcards
                              </h4>
                              <span className="text-[11px] text-slate-500">
                                Card {currentCard[msg._id] + 1} /{" "}
                                {flashcards[msg._id].length}
                              </span>
                            </div>
                            <Flashcard
                              question={flashcards[msg._id][currentCard[msg._id]].question}
                              answer={flashcards[msg._id][currentCard[msg._id]].answer}
                            />
                            <div className="flex justify-between mt-3">
                              <button
                                disabled={currentCard[msg._id] === 0}
                                onClick={() =>
                                  setCurrentCard((prev) => ({
                                    ...prev,
                                    [msg._id]: prev[msg._id] - 1,
                                  }))
                                }
                                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 px-3 py-1.5 rounded-lg text-xs transition-colors"
                              >
                                ← Previous
                              </button>
                              <button
                                disabled={
                                  currentCard[msg._id] ===
                                  flashcards[msg._id].length - 1
                                }
                                onClick={() =>
                                  setCurrentCard((prev) => ({
                                    ...prev,
                                    [msg._id]: prev[msg._id] + 1,
                                  }))
                                }
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 px-3 py-1.5 rounded-lg text-xs transition-colors"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2 text-slate-400 text-sm">
                    <Spinner size={14} />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={handleSend}
          className="shrink-0 border-t border-slate-900 px-4 sm:px-8 py-4"
        >
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Message the AI Workspace..."
              rows={1}
              className="flex-1 resize-none bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors max-h-40"
            />
            <Button type="submit" icon={Send} loading={sending} disabled={!draft.trim()}>
              Send
            </Button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this chat?"
        description={`"${deleteTarget?.title}" and its full message history will be permanently removed.`}
        confirmLabel="Delete chat"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Workspace;
