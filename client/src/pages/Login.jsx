import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute w-[30rem] h-[30rem] bg-indigo-600/10 blur-[140px] rounded-full -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-indigo-600/10 blur-[140px] rounded-full -bottom-40 -right-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>

        <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center mb-6">
            <GraduationCap size={22} />
          </div>

          <h1 className="text-2xl font-bold text-slate-50">Welcome back</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Log in to continue your learning journey.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="relative">
              <Mail
                size={17}
                className="absolute left-4 top-[42px] text-slate-500 pointer-events-none"
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                className="pl-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-4 top-[42px] text-slate-500 pointer-events-none"
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                className="pl-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Log in
            </Button>
          </form>

          <p className="text-slate-400 mt-7 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
