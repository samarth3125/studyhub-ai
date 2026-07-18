
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("KEY:", process.env.GOOGLE_API_KEY);
    });
  } catch (error) {
    console.error("Failed to start server");
  }
};

startServer();