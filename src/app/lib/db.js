import mongoose from "mongoose";
import { NextResponse } from "next/server";

const mongooseUrl = process.env.DB_MONGO_DB;
console.log("mongooseUrl", mongooseUrl);

export const connect = async () => {
  const connectionState = mongoose.connection.readyState; //need to connect it once after that it will auto connected
  console.log("connectionState", connectionState);
  if (connectionState === 1) {
    console.log("ALREADY CONNECTED");
    return;
  } else if (connectionState === 2) {
    console.log("CONNECTING...");
    return;
  }
  try {
    const resp = mongoose.connect(mongooseUrl, {
      dbName: "nextjs_auth",
    });
    console.log("MDBRESP : ", resp);
    console.log("CONNECTED");
  } catch (error) {
    console.log("errorDetection", error);
    return new NextResponse("Error : ", error, {
      status: 500,
    });
  }
};

// import mongoose from "mongoose";

// const mongooseUrl = process.env.DB_MONGO_DB;
// console.log("mongooseUrl", mongooseUrl);

// export const connect = async () => {
//   if (mongoose.connections[0].readyState) return;
//   try {
//     await mongoose.connect(mongooseUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Mongooose Successful");
//   } catch (error) {
//     console.log("Error in Mongoose Connection");
//   }
// };
