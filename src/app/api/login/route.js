import { connect } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/users";

export const PATCH = async (req) => {
  try {
    await connect();
    const body = await req.json(); //we cann't send id in params in PATCH
    const resp = await User.findOne({ email: body.email });
    const isAuth = bcrypt.compareSync(body.password, resp?.password); //resp?.password contains the hash
    if (isAuth) {
      const token = jwt.sign({ email: body.email }, "shhhhh"); //generating a new token using email
      resp.token = token;
      const finalResponse = await resp.save();
      return new NextResponse(
        JSON.stringify(
          { message: "User is updated", user: finalResponse },
          {
            status: 201,
          }
        )
      );
    } else {
      return new NextResponse(
        JSON.stringify(
          { message: "Invalid Crediniatls" },
          {
            status: 500,
          }
        )
      );
    }
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Error in fetching users : ", error, {
      status: 500,
    });
  }
};
