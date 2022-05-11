import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_path: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);

export { Book };
