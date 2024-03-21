"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const session = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password, name);

    if (!currentPage) {
      try {
        const res = await fetch("http://localhost:3000/api/signup", {
          method: "POST",
          body: JSON.stringify({ email, password, username: name }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("data", data);
            return data;
          });
        if (res?.message === "User is Created") {
          setCurrentPage(!currentPage);
          setEmail("");
          setName("");
          setPassword("");
          alert("User is created");
        }
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "PATCH",
          body: JSON.stringify({ email, password }),
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
        if (res?.user?.token) {
          const response = await signIn("credentials", {
            redirect: false,
            email,
          });
          console.log("response", response);
          if (response.ok) {
            localStorage.setItem("token", JSON.stringify(res?.user?.token));
            setEmail("");
            setName("");
            setPassword("");
            alert("User Looged In");
          } else if (response.error === "CredentialsSignin") {
            alert("Invalid credentials");
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    // console.log("response", response);
  };

  console.log("session", session);

  useEffect(() => {
    if (
      session?.status === "authenticated" &&
      session?.data?.message !== "UNAUTORIZED"
    ) {
      redirect("/dashboard");
    }
  }, [session?.status]);

  const handleTogglePage = () => {
    setEmail("");
    setName("");
    setPassword("");
    setCurrentPage(!currentPage);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {session?.status !== "authenticated" && (
        <form
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
          }}
          onSubmit={handleSubmit}
        >
          <h2>{currentPage ? "Login" : "Signup"} Page</h2>
          {!currentPage && (
            <input
              name="name"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            <button type="button" onClick={() => handleTogglePage()}>
              {!currentPage ? "Login" : "Signup"}
            </button>
            <button type="submit">Submit</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image
              onClick={() => signIn("google")}
              src="/google.svg"
              alt="google"
              height="40"
              width="40"
              style={{ cursor: "pointer" }}
            />
            <Image
              onClick={() => signIn("github")}
              // onClick={() => signIn()}    //if we dont give it will ask by own by giving options
              src="/github.png"
              alt="github"
              height="40"
              width="40"
              style={{ cursor: "pointer" }}
            />
            <Image
              onClick={() => signIn("azure-ad")}
              src="/microsoft.svg"
              alt="microsoft"
              height="40"
              width="40"
              style={{ cursor: "pointer" }}
            />
            <Image
              src="/facebook.svg"
              alt="facebook"
              height="40"
              width="40"
              style={{ cursor: "pointer" }}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default page;
