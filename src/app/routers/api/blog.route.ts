import { Router } from "express";
import { BlogController } from "../../controllers/blog";
import asyncWrapper from "../../utils/asyncWrapper";
import { Guard } from "../../middlewares/guard.middleware";
import { UploadSerive } from "../../services/upload.service";
import { blogValidation } from "../../validations/blog";

const router = Router();

router.use(UploadSerive.init());
router.get("/", asyncWrapper(BlogController.getAll));
router.get("/:id([0-9a-fA-F]{24})", asyncWrapper(BlogController.getOneById));
router.get("/:slug", asyncWrapper(BlogController.getOneBySlug));
router.get("/category/:name", asyncWrapper(BlogController.getByCategory));
router.post("/upload/:id", Guard.auth(), Guard.can(["create"]), UploadSerive.single("image"), asyncWrapper(BlogController.upload));
router.post("/", Guard.auth(), Guard.can(["create"]), blogValidation.create(), asyncWrapper(BlogController.create));
router.patch("/:id", Guard.auth(), Guard.can(["read", "update"]), blogValidation.update(), asyncWrapper(BlogController.update));
router.delete("/:id", Guard.auth(), Guard.can(["create", "delete"]), asyncWrapper(BlogController.delete));

export { router as blogRouter };
