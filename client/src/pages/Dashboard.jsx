import { useAuth } from "../context/AuthContext";

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

      <button
        onClick={logout}
        className="mt-6 bg-red-600 px-5 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;