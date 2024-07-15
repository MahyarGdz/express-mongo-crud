import { Router } from "express";
import { blogRouter } from "./api/blog.route";
import { categoryRouter } from "./api/catergory.route";
import { adminRouter } from "./api/admin.route";
import { authRouter } from "./api/auth.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/blogs", blogRouter);
router.use("/categories", categoryRouter);
router.use("/admins", adminRouter);

export { router as apiRouter };
