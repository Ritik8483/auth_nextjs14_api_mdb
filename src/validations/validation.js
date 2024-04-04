const { z } = require("zod");
import { ObjectId } from "mongodb";

const addBookSchema = z.object({
  bookname: z
    .string()
    .min(1, { message: "Bookname must be 1 or more characters long" }),
  description: z.string().min(1),
});

const updateBookSchema = z.object({
  _id: z.instanceof(ObjectId),
  bookname: z.string().min(1),
  description: z.string().min(1),
});

const singleBookSchema = z.object({
  _id: z.instanceof(ObjectId),
});

export { addBookSchema, updateBookSchema, singleBookSchema };
