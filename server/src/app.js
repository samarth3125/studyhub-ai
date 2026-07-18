import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import protect from "./middleware/auth.middleware.js";
import subjectRoutes from "./modules/subjects/subject.routes.js";
import noteRoutes from "./modules/notes/note.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import quizRoutes from "./modules/quiz/quiz.routes.js";
import pdfRoutes from "./modules/pdf/pdf.routes.js";


const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/notes", noteRoutes);   

app.use("/api/ai", aiRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/pdf", pdfRoutes);

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