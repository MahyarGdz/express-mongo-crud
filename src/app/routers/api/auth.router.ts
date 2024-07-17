import { Router } from "express";
import asyncWrapper from "../../utils/asyncWrapper";
import { AuthController } from "../../controllers/auth";
import { authValidation } from "../../validations/auth";

const router = Router();

router.post("/register", authValidation.register(), asyncWrapper(AuthController.register));
router.post("/login", authValidation.login(), asyncWrapper(AuthController.login));

export { router as authRouter };
