import { Router } from "express";
import asyncWrapper from "../../utils/asyncWrapper";
import { AuthController } from "../../controllers/auth";

const router = Router();

router.post("/register", asyncWrapper(AuthController.register));
router.post("/login", asyncWrapper(AuthController.login));

export { router as authRouter };
