import { Router } from "express";
import asyncWrapper from "../../utils/asyncWrapper";
import { CategoryController } from "../../controllers/category";

const router = Router();

router.get("/", asyncWrapper(CategoryController.getAll));
router.get("/:id", asyncWrapper(CategoryController.getOne));
router.post("/", asyncWrapper(CategoryController.create));
router.patch("/:id", asyncWrapper(CategoryController.update));

export { router as categoryRouter };
