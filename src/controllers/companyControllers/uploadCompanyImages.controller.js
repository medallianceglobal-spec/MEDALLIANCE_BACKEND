import {prisma } from "../../config/db.js"

export const uploadCompanyImagesController = async (req, res) => {
  try {
    // TEMP: allow userId from body if auth not ready
    const userId = req.user?.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const company = await prisma.company.findFirst({
      where: { ownerId: userId },
      include: { images: true },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found for user" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const remainingSlots = 10 - company.images.length;

    if (req.files.length > remainingSlots) {
      return res.status(400).json({
        message: `You can upload only ${remainingSlots} more images`,
      });
    }

    const imageRows = req.files.map(file => ({
      companyId: company.id,
      imageUrl: file.location,
    }));

    await prisma.companyImage.createMany({
      data: imageRows,
    });

    return res.status(201).json({
      message: "Images uploaded successfully",
      uploaded: imageRows.length,
      images: imageRows.map(i => i.imageUrl),
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};
