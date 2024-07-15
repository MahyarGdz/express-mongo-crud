import { Router } from "express";
import { BlogController } from "../../controllers/blog";
import asyncWrapper from "../../utils/asyncWrapper";

const router = Router();

router.get("/", asyncWrapper(BlogController.getAll));
router.get("/:id", asyncWrapper(BlogController.getOne));
router.post("/", asyncWrapper(BlogController.create));
router.patch("/:id", asyncWrapper(BlogController.update));

export { router as blogRouter };
