import { prisma } from "../../config/db.js";

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
  where: { id },
  include: {
    category: {
      select: { id: true, name: true }
    },

    images: {
      select: { imageUrl: true },
      orderBy: { id: "asc" }
    },

    specializations: {
      select: {
        specialization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    },

    subCategories: {
      select: {
        subCategory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    },

    accreditations: {
      select: {
        accreditation: {
          select: {
            id: true,
            name: true
          }
        }
      }
    },

    reviews: {
      orderBy: { createdAt: "desc" }
    }
  }
});


    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.json({
      success: true,
      company
    });
  } catch (error) {
    console.error("Get Company by ID Error:", error);
    res.status(500).json({ error: "Failed to fetch company details" });
  }
};
