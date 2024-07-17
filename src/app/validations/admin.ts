import { body } from "express-validator";
import admin from "../models/admin";
import { BadRequestError } from "../../common/types/app.Errors";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { RoleEnum } from "../../common/enums/Role.enum";

export const adminValidation = {
  create: () => {
    return ValidationMiddleware.validate([
      body("userName")
        .notEmpty()
        .withMessage("userName is required")
        .trim()
        .isLength({ min: 4 })
        .withMessage("userName min length is 4 char")
        .custom(async (value) => {
          const adminExists = await admin.exists({ userName: value });
          if (adminExists) {
            throw new BadRequestError("userName already registered");
          }
          return true;
        }),
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .trim()
        .custom(async (value) => {
          const adminExists = await admin.exists({ email: value });
          if (adminExists) {
            throw new BadRequestError("Email already registered");
          }
          return true;
        }),
      body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("password min length is 6 char"),
    ]);
  },
  update: () => {
    return ValidationMiddleware.validate([
      body("userName")
        .optional()
        .notEmpty()
        .withMessage("userName is required")
        .trim()
        .isLength({ min: 4 })
        .withMessage("userName min length is 8 char")
        .custom(async (value) => {
          const adminExists = await admin.exists({ userName: value });
          if (adminExists) {
            throw new BadRequestError("userName already registered");
          }
          return true;
        }),
      body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email format")
        .trim()
        .custom(async (value) => {
          const adminExists = await admin.exists({ email: value });
          if (adminExists) {
            throw new BadRequestError("Email already registered");
          }
          return true;
        }),
      body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("password min length is 6 char"),
      body("role")
        .optional()
        .notEmpty()
        .withMessage("Role can not be empty")
        .isIn([RoleEnum.EDITOR, RoleEnum.SUPER_ADMIN, RoleEnum.VISITOR])
        .withMessage("role should be in [editor,visitor,superAdmin]"),
      body("isActive")
        .optional()
        .notEmpty()
        .withMessage("Role can not be empty")
        // .isIn(["true", "false"])
        .isBoolean()
        .withMessage("isActive can be true or false"),
    ]);
  },
};

// const ext = path.extname(req.file.originalname);
// const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
// if(!exts.includes(ext)) throw "فرمت ارسال شده صحیح نمیباشد";
