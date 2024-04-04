"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const session = useSession();
  console.log("session", session);
  const [books, setBooks] = useState([]);
  const userToken = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    getAllTheBooks();
  }, []);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      redirect("/");
    }
  }, [session]);

  const getAllTheBooks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/books", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            userToken || "token" + " " + session?.data?.accessToken,
        },
      })
        .then((resp) => resp.json())
        .then((data) => data);
      if (res?.length) {
        setBooks(res);
      }
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSignout = () => {
    localStorage.removeItem("token");
    signOut({ callbackUrl: "http://localhost:3000" });
  };
  return (
    <>
      {session?.status === "loading" ? (
        <div>Loading</div>
      ) : session?.status === "unauthenticated" ? (
        <div>Unauthenticated</div>
      ) : (
        <div>
          <h2>Dashboard</h2>
          <div>
            Signed in as {session?.data?.user?.name} <br />
            <button onClick={() => handleSignout()}>Sign out</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Book Name</th>
                <th>Book Description</th>
              </tr>
            </thead>
            <tbody>
              {books?.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.bookname}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default page;
