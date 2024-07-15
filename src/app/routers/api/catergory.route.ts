import { Router } from "express";
import asyncWrapper from "../../utils/asyncWrapper";
import { CategoryController } from "../../controllers/category";
import { Guard } from "../../middlewares/guard.middleware";

const router = Router();

router.get("/", Guard.auth(), asyncWrapper(CategoryController.getAll));
router.get("/:id", Guard.auth(), asyncWrapper(CategoryController.getOne));
router.post("/", Guard.auth(), asyncWrapper(CategoryController.create));
router.patch("/:id", Guard.auth(), asyncWrapper(CategoryController.update));

export { router as categoryRouter };
