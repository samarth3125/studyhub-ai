import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, User, Mail, Lock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/auth/register", form);

      toast.success("Account created — please log in");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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

          <h1 className="text-2xl font-bold text-slate-50">
            Create your account
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Start studying smarter with StudyHub AI.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="relative">
              <User
                size={17}
                className="absolute left-4 top-[42px] text-slate-500 pointer-events-none"
              />
              <Input
                label="Full name"
                name="name"
                placeholder="Jordan Lee"
                required
                className="pl-11"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-4 top-[42px] text-slate-500 pointer-events-none"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="pl-11"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-4 top-[42px] text-slate-500 pointer-events-none"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                minLength={6}
                required
                className="pl-11"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="text-slate-400 mt-7 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
