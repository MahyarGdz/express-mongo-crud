import { Router } from "express";
import { BlogController } from "../../controllers/blog";
import asyncWrapper from "../../utils/asyncWrapper";
import { Guard } from "../../middlewares/guard.middleware";

const router = Router();

router.get("/", asyncWrapper(BlogController.getAll));
router.get("/:id", asyncWrapper(BlogController.getOne));
router.post("/", Guard.auth(), Guard.can(["create"]), asyncWrapper(BlogController.create));
router.patch("/:id", Guard.auth(), Guard.can(["read", "update"]), asyncWrapper(BlogController.update));

export { router as blogRouter };
