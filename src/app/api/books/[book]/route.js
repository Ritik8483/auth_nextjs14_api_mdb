import { connect } from "@/app/lib/db";
import Book from "@/app/lib/models/books";
import { singleBookSchema } from "@/validations/validation";
import { NextResponse } from "next/server";

export const GET = async (req, context) => {
  //it does not takes a query parms it takes dynamic url
  const validation = singleBookSchema.safeParse(req);
  if (validation.success) {
    try {
      const params = context.params.note;
      const resp = await connect();
      const notesResp = await Book.findById(params);
      console.log("notesResp", notesResp);
      return new NextResponse(JSON.stringify(notesResp), {
        status: 200,
      });
    } catch (error) {
      console.log("error", error);
      return new NextResponse("Error in fetching users : ", error, {
        status: 500,
      });
    }
  } else {
    console.log("validation.error.format()", validation.error.format());
    return NextResponse.json(validation.error.format(), {
      status: 500,
    });
  }
};
