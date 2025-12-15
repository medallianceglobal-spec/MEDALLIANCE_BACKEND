import { prisma } from "../../config/db.js";

export const getAllCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      categoryId,
      search
    } = req.query;

    const skip = (page - 1) * Number(limit);

    const filters = {};

    if (city) filters.city = city;
    if (state) filters.state = state;
    if (categoryId) filters.categoryId = categoryId;
    if (search) filters.name = { contains: search, mode: "insensitive" };

    const companies = await prisma.company.findMany({
      where: filters,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
   select: {
  id: true,
  name: true,
  tagline: true,
  description: true,
  rating: true,
  totalReviews: true,
  city: true,
  country: true,
  isAccredited: true,
  isPremium: true,
  isFeatured: true,

  category: {
    select: {
      name: true
    }
  },

  // 1️⃣ Specializations → returns array of names
  specializations: {
    select: {
      specialization: {
        select: {
          name: true
        }
      }
    }
  },

  // 2️⃣ Subcategories → returns array of names
  subCategories: {
    select: {
      subCategory: {
        select: {
          name: true
        }
      }
    }
  },

  // 3️⃣ Only first image
  images: {
    select: { imageUrl: true },
    orderBy: { id: "asc" },
    take: 1
  }
}

    });

    const total = await prisma.company.count({ where: filters });

    return res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      companies
    });

  } catch (error) {
    console.error("Get All Companies Error:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};
