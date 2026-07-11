import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import protect from "./middleware/auth.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "StudyHub API Running 🚀"
    });
});

app.get("/api/profile", protect, (req, res) => {

    res.json({
        success:true,
        user:req.user
    });

});
export default app;