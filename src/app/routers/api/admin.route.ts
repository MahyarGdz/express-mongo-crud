import { Router } from "express";
import asyncWrapper from "../../utils/asyncWrapper";
import { AdminController } from "../../controllers/admin";
import { Guard } from "../../middlewares/guard.middleware";

const router = Router();

router.get("/", Guard.auth(), Guard.can(["read"]), asyncWrapper(AdminController.getAll));
router.get("/:id", Guard.auth(), Guard.can(["read"]), asyncWrapper(AdminController.getOne));
router.post("/", Guard.auth(), Guard.can(["create"]), asyncWrapper(AdminController.create));
router.patch("/:id", Guard.auth(), Guard.can(["create", "update"]), asyncWrapper(AdminController.update));
router.delete("/:id", Guard.auth(), Guard.can(["create", "delete"]), asyncWrapper(AdminController.delete));

export { router as adminRouter };
