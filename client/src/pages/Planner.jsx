import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CalendarDays,
  GraduationCap,
  BookOpen,
  CheckSquare,
  Check,
  X,
  Target,
  AlarmClock,
} from "lucide-react";

import api from "../api/axios";
import {
  listTasks,
  createTask,
  toggleTask as toggleTaskApi,
  deleteTask as deleteTaskApi,
} from "../api/planner";

import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { Skeleton } from "../components/ui/Skeleton";

const TYPE_META = {
  study: { label: "Study Session", icon: BookOpen, dot: "bg-indigo-400", tone: "indigo" },
  exam: { label: "Exam", icon: GraduationCap, dot: "bg-red-400", tone: "red" },
  task: { label: "Task", icon: CheckSquare, dot: "bg-slate-400", tone: "slate" },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate()
  ).padStart(2, "0")}`;
};

const isSameDay = (a, b) => toKey(a) === toKey(b);

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

const buildMonthGrid = (monthDate) => {
  const first = startOfMonth(monthDate);
  const last = endOfMonth(monthDate);
  const leading = first.getDay();
  const totalCells = Math.ceil((leading + last.getDate()) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - leading + 1;
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), dayNum);
    cells.push({ date, inMonth: date.getMonth() === monthDate.getMonth() });
  }
  return cells;
};

const Planner = () => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(today);

  const [monthTasks, setMonthTasks] = useState([]);
  const [monthLoading, setMonthLoading] = useState(true);

  const [upcoming, setUpcoming] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    type: "study",
    time: "",
    subject: "",
    notes: "",
  });

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data.subjects || []);
    } catch {
      // optional context, ignore
    }
  };

  const fetchMonthTasks = async (monthDate) => {
    try {
      setMonthLoading(true);
      const data = await listTasks({
        from: startOfMonth(monthDate).toISOString(),
        to: endOfMonth(monthDate).toISOString(),
      });
      setMonthTasks(data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load planner");
    } finally {
      setMonthLoading(false);
    }
  };

  const fetchUpcoming = async () => {
    try {
      setUpcomingLoading(true);
      const from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const to = new Date(from);
      to.setDate(to.getDate() + 60);
      const data = await listTasks({ from: from.toISOString(), to: to.toISOString() });
      setUpcoming(data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load upcoming items");
    } finally {
      setUpcomingLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchUpcoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMonthTasks(currentMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const grid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);

  const tasksByDay = useMemo(() => {
    const map = {};
    monthTasks.forEach((t) => {
      const key = toKey(t.date);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [monthTasks]);

  const selectedDayTasks = tasksByDay[toKey(selectedDate)] || [];

  const todaysTasks = useMemo(
    () => upcoming.filter((t) => isSameDay(t.date, today)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [upcoming]
  );

  const upcomingExams = useMemo(
    () =>
      upcoming
        .filter((t) => t.type === "exam" && !t.completed)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5),
    [upcoming]
  );

  const monthProgress = useMemo(() => {
    if (monthTasks.length === 0) return 0;
    const done = monthTasks.filter((t) => t.completed).length;
    return Math.round((done / monthTasks.length) * 100);
  }, [monthTasks]);

  const refreshAll = () => {
    fetchMonthTasks(currentMonth);
    fetchUpcoming();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || saving) return;

    try {
      setSaving(true);
      await createTask({
        title: form.title.trim(),
        type: form.type,
        date: selectedDate.toISOString(),
        time: form.time,
        subject: form.subject || null,
        notes: form.notes,
      });
      toast.success("Added to your planner");
      setForm({ title: "", type: "study", time: "", subject: "", notes: "" });
      setShowForm(false);
      refreshAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add item");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (task) => {
    try {
      setTogglingId(task._id);
      await toggleTaskApi(task._id);
      refreshAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteTaskApi(deleteTarget._id);
      toast.success("Removed");
      setDeleteTarget(null);
      refreshAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const goToMonth = (delta) => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const TaskRow = ({ task, dense = false }) => {
    const meta = TYPE_META[task.type] || TYPE_META.task;
    const Icon = meta.icon;
    return (
      <div
        className={`flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 ${
          task.completed ? "opacity-60" : ""
        }`}
      >
        <button
          onClick={() => handleToggle(task)}
          disabled={togglingId === task._id}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
            task.completed
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "border-slate-700 hover:border-indigo-500 text-transparent"
          }`}
        >
          <Check size={12} />
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium text-slate-200 truncate ${
              task.completed ? "line-through" : ""
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
            <Badge tone={meta.tone} icon={Icon}>
              {meta.label}
            </Badge>
            {task.time && (
              <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
                <AlarmClock size={11} />
                {task.time}
              </span>
            )}
            {task.subject?.name && !dense && (
              <span className="text-[11px] text-slate-500">{task.subject.name}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => setDeleteTarget(task)}
          className="shrink-0 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Study Planner"
        description="Plan study sessions, track exams, and stay on top of daily goals."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-100 flex items-center gap-2">
              <CalendarDays size={17} className="text-indigo-400" />
              {monthLabel}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToMonth(-1)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  setCurrentMonth(startOfMonth(today));
                  setSelectedDate(today);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => goToMonth(1)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Monthly progress</span>
              <span className="text-slate-300 font-medium">{monthProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${monthProgress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
              />
            </div>
          </div>

          {monthLoading ? (
            <Skeleton className="h-80 w-full mt-4" />
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1.5 mt-5 mb-1.5">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[11px] font-medium text-slate-500 py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {grid.map(({ date, inMonth }) => {
                  const key = toKey(date);
                  const dayTasks = tasksByDay[key] || [];
                  const isToday = isSameDay(date, today);
                  const isSelected = isSameDay(date, selectedDate);

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(date)}
                      className={`relative aspect-square rounded-xl border text-left p-1.5 sm:p-2 transition-colors ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-600/15"
                          : isToday
                          ? "border-slate-700 bg-slate-800/60"
                          : "border-slate-800/70 hover:border-slate-700 hover:bg-slate-900"
                      } ${inMonth ? "" : "opacity-30"}`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? "text-indigo-300" : "text-slate-300"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {dayTasks.length > 0 && (
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-0.5">
                          {dayTasks.slice(0, 4).map((t) => (
                            <span
                              key={t._id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                (TYPE_META[t.type] || TYPE_META.task).dot
                              } ${t.completed ? "opacity-40" : ""}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </Card>

        {/* Side panel */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h3 className="font-semibold text-slate-100 text-sm truncate">
                {selectedLabel}
              </h3>
              <Button size="sm" icon={showForm ? X : Plus} onClick={() => setShowForm((s) => !s)}>
                {showForm ? "Close" : "Add"}
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleAddTask} className="space-y-3 mb-4 pb-4 border-b border-slate-800">
                <Input
                  placeholder="e.g. Revise Chapter 4"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  >
                    <option value="study">Study Session</option>
                    <option value="exam">Exam</option>
                    <option value="task">Task</option>
                  </Select>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  />
                </div>
                <Select
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                >
                  <option value="">No subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
                <Textarea
                  placeholder="Notes (optional)"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
                <Button type="submit" fullWidth loading={saving} disabled={!form.title.trim()}>
                  Save to {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Button>
              </form>
            )}

            {selectedDayTasks.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Nothing planned"
                description="Add a study session, exam, or task for this day."
                className="py-6 border-none bg-transparent"
              />
            ) : (
              <div className="space-y-2">
                {selectedDayTasks.map((t) => (
                  <TaskRow key={t._id} task={t} />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-100 text-sm mb-4 flex items-center gap-2">
              <Target size={15} className="text-indigo-400" />
              Today's Tasks
            </h3>
            {upcomingLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : todaysTasks.length === 0 ? (
              <p className="text-xs text-slate-500">Nothing on today's schedule.</p>
            ) : (
              <div className="space-y-2">
                {todaysTasks.map((t) => (
                  <TaskRow key={t._id} task={t} dense />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-100 text-sm mb-4 flex items-center gap-2">
              <GraduationCap size={15} className="text-red-400" />
              Upcoming Exams
            </h3>
            {upcomingLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : upcomingExams.length === 0 ? (
              <p className="text-xs text-slate-500">No exams scheduled in the next 60 days.</p>
            ) : (
              <div className="space-y-2">
                {upcomingExams.map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-red-500/5 border border-red-500/20"
                  >
                    <span className="text-sm text-slate-200 truncate">{t.title}</span>
                    <span className="text-[11px] text-red-300 shrink-0">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this item?"
        description={`"${deleteTarget?.title}" will be permanently removed from your planner.`}
        confirmLabel="Remove"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Planner;
