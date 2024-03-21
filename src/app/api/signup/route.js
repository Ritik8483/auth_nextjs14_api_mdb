import { connect } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/users";

export const POST = async (req, res) => {
  try {
    await connect();
    const body = await req.json();
    const token = jwt.sign({ email: body.email }, "shhhhh");
    const hash = bcrypt.hashSync(body.password, 10);
    const payload = {
      ...body,
      token: token,
      password: hash,
    };
    const users = new User(payload);
    const finalResp = await users.save();
    return new NextResponse(
      JSON.stringify(
        { message: "User is Created", user: finalResp },
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
