import { connect } from "@/app/lib/db";
import Book from "@/app/lib/models/books";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  try {
    const resp = await connect();
    console.log("resp", resp);
    const books = await Book.find();
    return new NextResponse(JSON.stringify(books), {
      status: 200,
    });
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Error in fetching books : ", error, {
      status: 500,
    });
  }
};

export const POST = async (req, res) => {
  try {
    const body = await req.json();
    await connect();
    const books = new Book(body);
    const finalResp = await books.save();
    return new NextResponse(
      JSON.stringify(
        { message: "Book is Created", user: books },
        {
          status: 201,
        }
      )
    );
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Error in fetching books : ", error, {
      status: 500,
    });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    console.log("params", params); //IT WILL ONLY WORK IN [USER]
    const body = await req.json(); //we cann't send id in params in PATCH
    await connect();
    const resp = await Book.findOneAndUpdate({ _id: body._id }, body);
    console.log("respon", resp);
    return new NextResponse(
      JSON.stringify(
        { message: "Book is Updated", user: resp },
        {
          status: 201,
        }
      )
    );
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Error in fetching users : ", error, {
      status: 500,
    });
  }
};

export const DELETE = async (req, res) => {
  try {
    console.log(req.query);
    const { searchParams } = new URL(req.url);
    console.log("searchParams", searchParams);
    const userId = searchParams.get("id");
    console.log("userId", userId);
    const resp = await Book.findOneAndDelete({ _id: userId });
    console.log("resp", resp);
    return new NextResponse(
      JSON.stringify(
        { message: "User is DELETED SUCCESSFULLY", user: resp },
        {
          status: 201,
        }
      )
    );
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Error in deleting user : ", error, {
      status: 500,
    });
  }
};
