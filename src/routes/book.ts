import express from "express";
import BookController from "../controllers/BookController";
import {
  BookCreateValidator,
  BookDeleteValidator,
  BookEditValidator,
} from "../validators/book";

const router = express.Router();

router.get("/", BookController.list);
router.post("/", BookCreateValidator, BookController.create);
router.put("/:id", BookEditValidator, BookController.edit);
router.delete("/:id", BookDeleteValidator, BookController.remove);

export { router as booksRouter };
