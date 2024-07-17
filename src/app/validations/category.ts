import { body } from "express-validator";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import category from "../models/category";
import { BadRequestError } from "../../common/types/app.Errors";

export const categoryValidation = {
  create: () => {
    return ValidationMiddleware.validate([
      body("name")
        .notEmpty()
        .withMessage("name is required")
        .trim()
        .isLength({ min: 4 })
        .withMessage("name min length is 4 char")
        .custom(async (value) => {
          const existCategory = await category.exists({ name: value });
          if (existCategory) throw new BadRequestError("category already created");
          return true;
        }),
      body("description")
        .notEmpty()
        .withMessage("description is required")
        .trim()
        .isLength({ min: 8 })
        .withMessage("description min length is 8 char"),
    ]);
  },
  update: () => {
    return ValidationMiddleware.validate([
      body("name")
        .optional()
        .notEmpty()
        .withMessage("name is required")
        .trim()
        .isLength({ min: 4 })
        .withMessage("name min length is 4 char")
        .custom(async (value) => {
          const existCategory = await category.exists({ name: value });
          if (existCategory) throw new BadRequestError("category already created");
          return true;
        }),
      body("description")
        .optional()
        .notEmpty()
        .withMessage("description is required")
        .trim()
        .isLength({ min: 8 })
        .withMessage("description min length is 8 char"),
    ]);
  },
};
