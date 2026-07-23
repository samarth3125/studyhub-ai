import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import protect from "./middleware/auth.middleware.js";
import subjectRoutes from "./modules/subjects/subject.routes.js";
import noteRoutes from "./modules/notes/note.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import quizRoutes from "./modules/quiz/quiz.routes.js";
import pdfRoutes from "./modules/pdf/pdf.routes.js";
import flashcardRoutes from "./modules/flashcards/flashcard.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import mindspaceRoutes from "./modules/mindspace/mindspace.routes.js";
import plannerRoutes from "./modules/planner/planner.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/notes", noteRoutes);   

app.use("/api/ai", aiRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/pdf", pdfRoutes);

app.use("/api/flashcards", flashcardRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/mindspace", mindspaceRoutes);

app.use("/api/planner", plannerRoutes);

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