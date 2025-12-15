// src/routes/lead.routes.js
import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { createLead } from "../../controllers/leadsControllers/potentialLeads.controller.js";

const router = express.Router();

router.post("/", requireAuth, createLead);

export default router;
