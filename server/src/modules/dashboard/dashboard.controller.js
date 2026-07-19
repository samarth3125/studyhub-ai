import { getDashboardStats } from "./dashboard.service.js";

export const fetchDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStats(req.user.id);

    res.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};