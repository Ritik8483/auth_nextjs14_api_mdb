// import { NextResponse } from "next/server";
// import { authMiddleware } from "./app/middlewares/apis/authMiddleware";

// export const config = {
//   matcher: "/api/:path*",
// };
// export default function middleware(req) {
//   const authResult = authMiddleware(req);
//   console.log("authResult", authResult);
//   if (authResult?.isValid) {
//     return NextResponse.next();
//   } else {
//     return;
//   }
// }

import * as jose from "jose";
import { NextResponse } from "next/server";

export const config = {
  matcher: "/api/books/:path*", //Now it will run only for books api
  //   matcher: ["/api/books"],
};
export default async function middleware(req) {
  const Bearertoken = req.headers.get("Authorization")?.split(" ")[1];
  const token = req.headers.get("Authorization");
  console.log("token", token);
  try {
    if (token !== undefined && token?.length) {
      const jwtConfig = {
        secret: new TextEncoder().encode("shhhhh"),
      };
      if (token.split(" ").includes("token")) {
        console.log("token.split", token.split(" ").includes("token"));
        return NextResponse.next();
      } else {
        const decoded = await jose.jwtVerify(
          token.split(" ").includes("Bearer") ? Bearertoken : token,
          jwtConfig.secret
        );
        console.log("decoded", decoded);
        if (decoded?.payload?.email) {
          return NextResponse.next();
        }
      }
    } else {
      return new NextResponse("Token ERROR", {
        status: 500,
      });
    }
  } catch (error) {
    console.log("errorDecoded => ", error);
    return new NextResponse(error, {
      status: 500,
    });
  }
  // if (token !== undefined && token?.length) {
  //   console.log("called Inside");
  //   return NextResponse.next();
  // } else {
  //   return new NextResponse("MIDDLEWARE ERROR", {
  //     status: 500,
  //   });
  // }
}
