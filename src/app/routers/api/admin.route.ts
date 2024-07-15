import { Router } from "express";
import asyncWrapper from "../../utils/asyncWrapper";
import { AdminController } from "../../controllers/admin";
import { Guard } from "../../middlewares/guard.middleware";

const router = Router();

router.get("/", Guard.auth(), asyncWrapper(AdminController.getAll));
router.get("/:id", Guard.auth(), asyncWrapper(AdminController.getOne));
router.post("/", Guard.auth(), asyncWrapper(AdminController.create));
router.patch("/:id", Guard.auth(), asyncWrapper(AdminController.update));

export { router as adminRouter };
