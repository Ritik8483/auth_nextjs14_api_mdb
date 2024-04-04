import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import User from "@/app/lib/models/users";
import { connect } from "@/app/lib/db";
// import { connect } from "@/app/lib/db";
// import User from "@/app/lib/model/user";

// console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        // await connect();
        const res = await User.findOne({ email: credentials.email });
        console.log("res", res);
        if (res?._id) {
          const user = {
            name: res?.username,
            email: res?.email,
            token: res?.token,
          };
          return user;
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GIT_CLIENT_ID,
      clientSecret: process.env.GIT_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("account", account);
      console.log("tokenAbove", token);
      const allUsers = await User.find();
      const allRegisteredEmails = allUsers?.map((user) => user.email);
      console.log("allUsers", allRegisteredEmails);
      if (!allRegisteredEmails?.includes(token?.email) && token?.accessToken) {
        const res = await fetch("http://localhost:3000/api/signup", {
          method: "POST",
          body: JSON.stringify({
            email: token?.email,
            password: "",
            username: token?.name,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("data", data);
            return data;
          });
        console.log("res", res);
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("session", session);
      console.log("token", token);
      console.log("user", user);
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
