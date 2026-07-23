import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  BookOpen,
  NotebookPen,
  FileText,
  MessageSquare,
  Brain,
  Layers,
  Sparkles,
  Pin,
  Target,
  ArrowRight,
  Flame,
  CalendarDays,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../api/dashboard";
import PDFUploader from "../components/PDFUploader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { StatCardSkeleton, Skeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#f97316", "#22d3ee", "#f43f5e"];

const statCards = [
  { key: "subjects", label: "Subjects", icon: BookOpen, tone: "indigo" },
  { key: "notes", label: "Notes", icon: NotebookPen, tone: "slate" },
  { key: "pdfsUploaded", label: "PDFs Uploaded", icon: FileText, tone: "purple" },
  { key: "aiChats", label: "AI Chats", icon: MessageSquare, tone: "green" },
  { key: "quizzesGenerated", label: "Quizzes Generated", icon: Brain, tone: "amber" },
  { key: "flashcardsGenerated", label: "Flashcards Generated", icon: Layers, tone: "red" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-slate-100 font-medium">
          {p.value} {p.name || ""}
        </p>
      ))}
    </div>
  );
};

// Consecutive active days counting back from today, using the same
// weeklyActivity series the chart already renders — no extra API call.
const calcStreak = (weeklyActivity = []) => {
  let streak = 0;
  for (let i = weeklyActivity.length - 1; i >= 0; i--) {
    if (weeklyActivity[i].activity > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.stats);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't load your dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const firstName = user?.name?.split(" ")[0];
  const streak = calcStreak(stats?.weeklyActivity || []);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">
            Welcome back, <span className="text-indigo-400">{firstName}</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Here's how your studying is going.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <BookOpen size={16} />
            Go to Subjects
          </Link>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map(({ key, label, icon: Icon, tone }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <Card className="p-5 h-full">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4">
                    <Icon size={16} className="text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-50">
                    {stats?.[key] ?? 0}
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">{label}</p>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-100">Weekly Activity</h3>
              <p className="text-xs text-slate-500 mt-1">
                Study actions over the last 7 days
              </p>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats?.weeklyActivity || []}>
                <defs>
                  <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="activity"
                  name="actions"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#activityFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <Flame size={16} className="text-amber-400" />
                Study Streak
              </h3>
            </div>

            {loading ? (
              <Skeleton className="h-10 w-20 mt-2" />
            ) : (
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-slate-50">{streak}</span>
                <span className="text-slate-500 text-sm">
                  {streak === 1 ? "day" : "days"} in a row
                </span>
              </div>
            )}

            <p className="text-slate-400 mt-3 text-sm">
              {streak === 0
                ? "Do something study-related today to start a new streak."
                : "Keep it going — study again today to extend your streak."}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <Target size={16} className="text-indigo-400" />
                Today's Goal
              </h3>
              <span className="text-indigo-400 text-sm font-semibold">
                {stats?.studyProgress ?? 0}%
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              {stats?.todayActivity ?? 0} / {stats?.dailyGoal ?? 5} AI study actions today
            </p>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats?.studyProgress ?? 0}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
              />
            </div>

            <p className="text-slate-400 mt-4 text-sm">
              {(stats?.studyProgress ?? 0) >= 100
                ? "Goal complete for today — great work!"
                : "Keep going to hit today's study goal."}
            </p>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-100 mb-1">AI Usage</h3>
          <p className="text-xs text-slate-500 mb-5">
            Breakdown of AI feature usage
          </p>

          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : stats?.totalAiActions === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-slate-500 text-center px-4">
              No AI activity yet — try a summary, quiz, or flashcard set.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.aiUsage || []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {(stats?.aiUsage || []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4">
            {(stats?.aiUsage || []).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-slate-400">
                  {item.name}: <span className="text-slate-200">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-100 mb-1">Notes Per Subject</h3>
          <p className="text-xs text-slate-500 mb-5">
            Where your notes are concentrated
          </p>

          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : !stats?.notesPerSubject?.length ? (
            <div className="h-48 flex items-center justify-center text-sm text-slate-500 text-center px-4">
              Add notes to a subject to see this chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.notesPerSubject} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="subject"
                  stroke="#64748b"
                  fontSize={12}
                  width={80}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="notes" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-slate-100">Recent Notes</h3>
            {stats?.pinnedNotes > 0 && (
              <Badge tone="indigo" icon={Pin}>
                {stats.pinnedNotes} pinned
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Your most recently updated notes
          </p>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !stats?.recentNotes?.length ? (
            <EmptyState
              icon={NotebookPen}
              title="No notes yet"
              description="Notes you create will show up here."
              className="py-8 border-none bg-transparent"
            />
          ) : (
            <div className="space-y-1">
              {stats.recentNotes.map((note) => (
                <Link
                  key={note._id}
                  to={
                    note.subject
                      ? `/subjects/${note.subject._id}/notes`
                      : "/subjects"
                  }
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition-colors group"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    {note.pinned && (
                      <Pin size={12} className="text-indigo-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {note.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {note.subject?.name || "Unknown subject"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-600 group-hover:text-indigo-400 shrink-0 transition-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link to="/subjects">
            <Card hover className="p-6 h-full">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4">
                <BookOpen size={18} className="text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-100">My Subjects</h3>
              <p className="text-slate-400 text-sm mt-1.5">
                Manage all your study subjects.
              </p>
            </Card>
          </Link>

          <Link to="/planner">
            <Card hover className="p-6 h-full">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                <CalendarDays size={18} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-slate-100">Study Planner</h3>
              <p className="text-slate-400 text-sm mt-1.5">
                Plan sessions and track exam dates.
              </p>
            </Card>
          </Link>

          <Link to="/subjects">
            <Card hover className="p-6 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Sparkles size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-100">AI Summary</h3>
              <p className="text-slate-400 text-sm mt-1.5">
                Open a note and generate a summary instantly.
              </p>
            </Card>
          </Link>

          <Link to="/subjects">
            <Card hover className="p-6 h-full">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
                <Brain size={18} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-100">AI Quiz</h3>
              <p className="text-slate-400 text-sm mt-1.5">
                Turn any note into a quiz in one click.
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* PDF Assistant */}
      <div className="mt-8">
        <PDFUploader />
      </div>
    </div>
  );
};

export default Dashboard;
