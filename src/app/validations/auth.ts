import { body } from "express-validator";
import { BadRequestError } from "../../common/types/app.Errors";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import admin from "../models/admin";

export const authValidation = {
  register: () => {
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
  login: () => {
    return ValidationMiddleware.validate([
      body("email").notEmpty().withMessage("Email is required"),
      body("password").notEmpty().withMessage("Password is required"),
    ]);
  },
};
