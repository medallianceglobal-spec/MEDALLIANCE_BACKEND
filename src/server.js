// src/server.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import companyRoutes from "./routes/companyRoutes/registerCompany.routes.js";
import leadRoutes from "./routes/leadRoutes/leads.routes.js";



const app = express();

app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL (Vite default port)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "MedAlliance Backend is running 🚀"
  });
});


// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// auth routes
app.use('/auth', authRoutes);
app.use("/companies", companyRoutes);
app.use("/leads", leadRoutes);

// (later) you’ll add: app.use('/companies', companyRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
