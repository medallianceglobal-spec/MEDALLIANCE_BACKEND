import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/companyRoutes/registerCompany.routes.js";
import leadRoutes from "./routes/leadRoutes/leads.routes.js";

const app = express();

/* ✅ CORS FIRST */
app.use(
  cors({
    origin: "https://medalliance-frontend.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* ✅ Body parsers (THIS FIXES LOGIN) */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Health */
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

/* Routes */
app.use("/auth", authRoutes);
app.use("/companies", companyRoutes);
app.use("/leads", leadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

export default app;
