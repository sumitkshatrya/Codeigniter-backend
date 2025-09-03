import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.js";
import listRoutes from "./routes/lists.js";

dotenv.config();
const app = express();

// ✅ Allow localhost + Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://codeigniter-frontend-git-main-sumit-kumars-projects-e897095f.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api", listRoutes);

app.listen(PORT, () => {
  console.log("✅ Server is running on PORT: " + PORT);
  connectDB();
});
