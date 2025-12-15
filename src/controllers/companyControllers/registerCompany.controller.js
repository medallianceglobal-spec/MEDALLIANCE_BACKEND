import { prisma } from "../../config/db.js";

export const registerCompany = async (req, res) => {
  try {
    const ownerId = req.user.id; // 👈 comes from JWT middleware

    const {
      name,
      tagline,
      description,
      longDescription,
      city,
      state,
      country,
      location,
      fullAddress,
      phone,
      email,
      website,
      workingHours,
      categoryId
    } = req.body;

    if (!name || !description || !city || !state || !country) {
      return res.status(400).json({
        error: "Missing required fields: name, description, city, state, country",
      });
    }

    const company = await prisma.company.create({
      data: {
        ownerId,
        name,
        tagline,
        description,
        longDescription,
        city,
        state,
        country,
        location,
        fullAddress,
        phone,
        email,
        website,
        workingHours,
        categoryId,
      },
    });

    // 🔥 Upgrade user role → vendor (role = 2)
    await prisma.user.update({
      where: { id: ownerId },
      data: { role: 2 },
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.error("Create Company Error:", error);
    return res.status(500).json({ error: "Server error while creating company" });
  }
};
