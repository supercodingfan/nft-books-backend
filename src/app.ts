import express, { Application, Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import mongoose from "mongoose";

import router from "./routes";

const app: Application = express();
const port: number = 3001;

mongoose.connect("mongodb://localhost:27017/nft_books", () => {
  console.log("connected to database");
});

app.use(
  fileUpload({
    createParentPath: true,
    uriDecodeFileNames: true,
  }),
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
app.use(router);

app.post("/upload-image", async (req, res) => {
  try {
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
        let path = "/uploads/" + image.name;
        image.mv(path);
        res.send({
          status: "success",
          name: image.name,
        });
      }
    }
  } catch (e: any) {
    res.status(500).send(e);
  }
});

app.listen(port, function () {
  console.log(`App is listening on port ${port}`);
});
