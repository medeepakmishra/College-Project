import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import studentProfileRoutes from "./routes/studentProfile.route.js";
import placementDriveRoutes from "./routes/placementDrive.route.js";
import companyRoutes from "./routes/company.route.js";
// import companyRoutes from "./routes/company.route.js";
import applicationRoutes from "./routes/application.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import announcementRoutes from "./routes/announcement.route.js";
import aiRoutes from "./routes/ai.route.js";
import uploadRoutes from "./routes/upload.route.js";


const app = express();

/* ---------- Middlewares ---------- */
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://college-project-frontend-chi.vercel.app",
    ],
    credentials: true,
}));

app.use(express.json());

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.send("App is working");
});

app.get("/test", (req, res) => {
  res.send("test is working");
});

 

app.use("/api/auth", authRoutes);

app.use("/api/profile", studentProfileRoutes);

app.use("/api/company", companyRoutes);

app.use("/api/drive", placementDriveRoutes);

app.use("/api/application", applicationRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/announcement", announcementRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/upload", uploadRoutes);






app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:");
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});




export default app;
