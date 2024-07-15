import { Router } from "express";
import asyncWrapper from "../../utils/asyncWrapper";
import { AdminController } from "../../controllers/admin";

const router = Router();

router.get("/", asyncWrapper(AdminController.getAll));
router.get("/:id", asyncWrapper(AdminController.getOne));
router.post("/", asyncWrapper(AdminController.create));
router.patch("/:id", asyncWrapper(AdminController.update));

export { router as adminRouter };
