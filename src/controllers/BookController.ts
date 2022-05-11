import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { validationResult } from "express-validator";
import _ from "lodash";
import { Book } from "../models/Book";
import { getRandomFileName } from "../utils";

const BookController = {
  list: async (req: Request, res: Response) => {
    const books = await Book.find({});
    res.send({
      books,
    });
  },
  create: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "failed",
        errors: errors.array(),
      });
    }
    if (!req.files) {
      res.status(422).send({
        status: "failed",
        message: "No image file uploaded",
      });
    } else {
      let image: UploadedFile | UploadedFile[] = req.files.image;
      if (image instanceof Array) {
        res.status(422).send({
          status: "failed",
          message: "You can only upload a single file.",
        });
      } else {
        let filename = getRandomFileName() + image.name;
        let path = "./uploads/" + filename;
        image.mv(path);
        const book = new Book({
          ..._.pick(req.body, ["title", "description", "owner"]),
          image_path: filename,
        });
        await book.save();
        res.status(201).send({
          status: "success",
          book: book,
        });
      }
    }
  },
  edit: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "failed",
        errors: errors.array(),
      });
    }
    let book;
    if (req.files) {
      let image: UploadedFile | UploadedFile[] = req.files.image;
      if (image instanceof Array) {
        res.status(422).send({
          status: "failed",
          message: "You can only upload a single file.",
        });
      } else {
        let filename = getRandomFileName() + image.name;
        let path = "./uploads/" + filename;
        image.mv(path);
        book = {
          ..._.pick(req.body, ["title", "description", "owner"]),
          image_path: filename,
        };
      }
    } else {
      book = _.pick(req.body, ["title", "description", "owner"]);
    }

    const new_book = await Book.findByIdAndUpdate(req.params?.id, book, {
      new: true,
    });

    res.send({
      status: "success",
      book: new_book,
    });
  },
  remove: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "failed",
        errors: errors.array(),
      });
    }
    await Book.findByIdAndDelete(req.params?.id);

    return res.status(204).send({});
  },
};

export default BookController;
