import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
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

// Render (and most PaaS providers) sit behind a reverse proxy.
// This is required for secure cookies / rate limiting / correct req.ip to work.
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Gzip compression for all responses
app.use(compression());

// ---- CORS ----
// CLIENT_URL can be a single origin or a comma-separated list
// (e.g. "https://studyhub.vercel.app,https://www.studyhub.app")
// Localhost origins are always allowed so local dev keeps working.
const localOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...configuredOrigins, ...localOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, server-to-server, health checks) with no origin
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

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

// ---- 404 handler ----
// Anything that falls through the routes above is an unknown route.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// ---- Global error handler ----
// Any error passed to next(err), or thrown inside an async handler that
// forwards to next, ends up here instead of crashing the process.
app.use((err, req, res, next) => {
    if (err && err.message === "Not allowed by CORS") {
        return res.status(403).json({
            success: false,
            message: "Not allowed by CORS",
        });
    }

    console.error(err.stack || err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;