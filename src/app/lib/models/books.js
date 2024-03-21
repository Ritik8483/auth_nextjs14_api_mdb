import { Schema, model, models } from "mongoose";

const BookSchema = new Schema(
  {
    bookname: {
      type: String,
      required: [true, "Book name is required"],
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = models.Book || model("Book", BookSchema);
export default Book;
