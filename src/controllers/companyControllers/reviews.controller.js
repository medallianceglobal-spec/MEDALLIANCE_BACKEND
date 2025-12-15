import { prisma } from "../../config/db";

export const createReview = async (req, res) => {
  const userId = req.user?.userId;
  const { companyId, rating, comment } = req.body;

  if (!userId || !companyId || !rating || !comment) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Create review
      await tx.review.create({
        data: {
          companyId,
          userId,
          rating,
          comment,
        },
      });

      // 2️⃣ Aggregate reviews
      const stats = await tx.review.aggregate({
        where: { companyId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      // 3️⃣ Update company
      await tx.company.update({
        where: { id: companyId },
        data: {
          rating: Number(stats._avg.rating?.toFixed(1)) || 0,
          totalReviews: stats._count.rating,
        },
      });
    });

    res.status(201).json({ message: "Review added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add review" });
  }
};
