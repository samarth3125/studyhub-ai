import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  X,
  GraduationCap,
  MessageSquare,
  Brain,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/workspace", label: "AI Workspace", icon: MessageSquare },
  { to: "/mindspace", label: "Mind Space", icon: Brain },
  { to: "/planner", label: "Planner", icon: CalendarDays },
];

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Pages like the AI Workspace need the full viewport (their own internal
  // sidebar/header/scroll regions) instead of the standard padded, width
  // capped content column. Rather than fighting the shared container with
  // negative margins on the page itself, opt those routes out here.
  const isFullBleed = location.pathname.startsWith("/workspace");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (to) => location.pathname.startsWith(to);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-900 bg-slate-950/60">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-900">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">
            StudyHub<span className="text-indigo-400">AI</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(to)
                  ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-900">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900/60 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-16 border-b border-slate-900 bg-slate-950/90 backdrop-blur flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} />
          </div>
          <span className="font-bold tracking-tight">
            StudyHub<span className="text-indigo-400">AI</span>
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-900"
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-64 h-full bg-slate-950 border-r border-slate-900 p-4 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold tracking-tight">
                  StudyHub<span className="text-indigo-400">AI</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-900"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1 flex-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(to)
                        ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent"
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={17} />
                Logout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={`flex-1 min-w-0 pt-16 lg:pt-0 ${
          isFullBleed ? "h-dvh lg:h-screen overflow-hidden" : ""
        }`}
      >
        {isFullBleed ? (
          <div className="h-[calc(100%-4rem)] lg:h-full">{children}</div>
        ) : (
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">{children}</div>
        )}
      </main>
    </div>
  );
};

export default AppShell;
