import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { registerCompany } from "../../controllers/companyControllers/registerCompany.controller.js";
import { getAllCompanies } from "../../controllers/companyControllers/getCompanyList.controller.js";
import { getCompanyById } from "../../controllers/companyControllers/getCompanyByID.controller.js"; 
import { uploadCompanyImages } from "../../middlewares/aws/uploadCompanyImages.middleware.js";
import { uploadCompanyImagesController } from "../../controllers/companyControllers/uploadCompanyImages.controller.js";

const router = Router();

router.post("/create", requireAuth, registerCompany);
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.post(
  "/images",
  requireAuth,              // ✅ sets req.user.userId
  uploadCompanyImages.array("images", 10),
  uploadCompanyImagesController
);



export default router;
