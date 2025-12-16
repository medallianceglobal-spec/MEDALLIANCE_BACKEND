// src/server.js
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/companyRoutes/registerCompany.routes.js";
import leadRoutes from "./routes/leadRoutes/leads.routes.js";

const app = express();

/**
 * ✅ Allowed origins (local + production)
 */

/**
 * ✅ CORS middleware (FIXES your error)
 */
app.use(cors({
  origin: "https://medalliance-frontend.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


/**
 * ✅ IMPORTANT: handle preflight requests
 */
app.options("*", cors());

/**
 * ✅ JSON parser
 */
app.use(express.json());

/**
 * ✅ Optional but recommended (fixes Google popup warning)
 */
app.use((req, res, next) => {
  res.setHeader(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );
  next();
});

/**
 * ✅ Root route
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "MedAlliance Backend is running 🚀",
  });
});

/**
 * ✅ Health check
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

/**
 * ✅ Routes
 */
app.use("/auth", authRoutes);
app.use("/companies", companyRoutes);
app.use("/leads", leadRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

export default app;
