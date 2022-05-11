import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
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
        let path = "./uploads/" + getRandomFileName() + image.name;
        image.mv(path);
        const book = new Book({
          ..._.pick(req.body, ["title", "description", "owner"]),
          image_path: path,
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
    let book;
    if (req.files) {
      let image: UploadedFile | UploadedFile[] = req.files.image;
      if (image instanceof Array) {
        res.status(422).send({
          status: "failed",
          message: "You can only upload a single file.",
        });
      } else {
        let path = "./uploads/" + getRandomFileName() + image.name;
        image.mv(path);
        book = {
          ..._.pick(req.body, ["title", "description", "owner"]),
          image_path: path,
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
    await Book.findByIdAndDelete(req.params?.id);

    return res.status(204).send({});
  },
};

export default BookController;
