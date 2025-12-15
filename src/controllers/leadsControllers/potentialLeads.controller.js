// src/controllers/lead.controller.js
import {prisma} from "../../config/db.js";

export const createLead = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const lead = await prisma.lead.create({
      data: {
        userId,
        phone_number
      }
    });

    return res.status(201).json({
      message: "Lead stored successfully",
      lead
    });

  } catch (error) {
    console.error("Lead creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
