import { Router } from "express";
import { BlogController } from "../../controllers/blog";
import asyncWrapper from "../../utils/asyncWrapper";
import { Guard } from "../../middlewares/guard.middleware";
import { UploadSerive } from "../../services/upload.service";

const router = Router();

router.use(UploadSerive.init());
router.get("/", asyncWrapper(BlogController.getAll));
router.get("/:id([0-9a-fA-F]{24})", asyncWrapper(BlogController.getOneById));
router.get("/:slug", asyncWrapper(BlogController.getOneBySlug));
router.get("/category/:name", asyncWrapper(BlogController.getByCategory));
router.post("/upload/:id", Guard.auth(), Guard.can(["create"]), UploadSerive.single("image"), asyncWrapper(BlogController.upload));
router.post("/", Guard.auth(), Guard.can(["create"]), asyncWrapper(BlogController.create));
router.patch("/:id", Guard.auth(), Guard.can(["read", "update"]), asyncWrapper(BlogController.update));

export { router as blogRouter };
