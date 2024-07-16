import { Router } from "express";
import asyncWrapper from "../../utils/asyncWrapper";
import { CategoryController } from "../../controllers/category";
import { Guard } from "../../middlewares/guard.middleware";

const router = Router();

router.get("/", Guard.auth(), Guard.can(["read"]), asyncWrapper(CategoryController.getAll));
router.get("/:id", Guard.auth(), Guard.can(["read"]), asyncWrapper(CategoryController.getOne));
router.post("/", Guard.auth(), Guard.can(["create"]), asyncWrapper(CategoryController.create));
router.patch("/:id", Guard.auth(), Guard.can(["read", "update"]), asyncWrapper(CategoryController.update));
router.delete("/:id", Guard.auth(), Guard.can(["create", "delete"]), asyncWrapper(CategoryController.delete));

export { router as categoryRouter };
