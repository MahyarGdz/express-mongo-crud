import { body } from "express-validator";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import category from "../models/category";
import { BadRequestError, NotFoundError } from "../../common/types/app.Errors";
import { BadRequestMessage, NotFoundMessage } from "../../common/enums/messages.enum";
import { isValidObjectId } from "mongoose";

export const blogValidation = {
  create: () => {
    return ValidationMiddleware.validate([
      body("title").notEmpty().withMessage("title is required").trim().isLength({ min: 4 }).withMessage("title min length is 4 char"),
      body("content")
        .notEmpty()
        .withMessage("content is required")
        .trim()
        .isLength({ min: 10 })
        .withMessage("content min length is 10 char"),
      body("category")
        .notEmpty()
        .withMessage("categoryId is required")
        .custom(async (value) => {
          if (!isValidObjectId(value)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
          const existCategory = await category.exists({ _id: value });
          if (!existCategory) throw new NotFoundError(NotFoundMessage.CategoryNotFound);
          return true;
        }),
    ]);
  },
  update: () => {
    return ValidationMiddleware.validate([
      body("title")
        .optional()
        .notEmpty()
        .withMessage("title is required")
        .trim()
        .isLength({ min: 4 })
        .withMessage("title min length is 4 char"),
      body("content")
        .optional()
        .notEmpty()
        .withMessage("content is required")
        .trim()
        .isLength({ min: 10 })
        .withMessage("content min length is 10 char"),
      body("category")
        .optional()
        .notEmpty()
        .withMessage("categoryId is required")
        .custom(async (value) => {
          if (!isValidObjectId(value)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
          const existCategory = await category.exists({ _id: value });
          if (!existCategory) throw new NotFoundError(NotFoundMessage.CategoryNotFound);
          return true;
        }),
    ]);
  },
};
