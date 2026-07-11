import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();



  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold">
        Welcome, {user?.name} 👋
      </h1>

      <p className="text-gray-400 mt-2">
        Welcome to StudyHub AI
      </p>
      <Link
  to="/subjects"
  className="inline-block mt-6 bg-indigo-600 px-5 py-2 rounded-lg"
>
  My Subjects
</Link>
      <button
        onClick={logout}
        className="mt-6 ml-4 bg-red-600 px-5 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;