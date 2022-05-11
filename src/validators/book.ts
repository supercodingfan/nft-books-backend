import { check } from "express-validator";
import { Book } from "../models/Book";

const BookCreateValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("owner").not().isEmpty().withMessage("Owner is required."),
  check("image")
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (!req.file) throw new Error("Book image is required");
      return true;
    }),
];

const BookEditValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("owner")
    .not()
    .isEmpty()
    .withMessage("Owner is required.")
    .custom(async (value, { req }) => {
      const book = await Book.findOne({ id: req.params?.id });
      if (book.owner === value) return true;
      return false;
    })
    .withMessage("Only owner can edit a book."),
  check("image").custom((value, { req }) => {
    if (!req.file) throw new Error("Book image is required");
    return true;
  }),
];

const BookDeleteValidator = [
  check("owner")
    .not()
    .isEmpty()
    .withMessage("Owner is required.")
    .custom(async (value, { req }) => {
      const book = await Book.findOne({ id: req.params?.id });
      if (book.owner === value) return true;
      return false;
    })
    .withMessage("Only owner can delete a book."),
];

export { BookCreateValidator, BookEditValidator, BookDeleteValidator };
