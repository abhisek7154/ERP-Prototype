"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";


export default function LoginPage() {

  const router = useRouter();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);



  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();


    const response =
      await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );


    if (response.ok) {

      router.push(
        "/dashboard"
      );

    } else {

      alert(
        "Invalid credentials"
      );

    }

  }



  return (

    <div className="flex min-h-screen items-center justify-center">


      <form
        onSubmit={handleLogin}
        className="flex w-80 flex-col gap-4"
      >


        <h1 className="text-2xl font-bold">
          Admin Login
        </h1>



        <input

          className="rounded-md border p-2"

          placeholder="Email"

          type="email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

        />



        <div className="relative">


          <input

            className="w-full rounded-md border p-2 pr-10"

            placeholder="Password"

            type={
              showPassword
                ? "text"
                : "password"
            }

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

          />



          <button

            type="button"

           className="absolute right-3 top-1/2 -translate-y-1/2"

            onClick={() =>
              setShowPassword(
                value => !value
              )
            }

          >

            {
              showPassword
                ? <EyeOff size={18} />
                : <Eye size={18} />
            }


          </button>


        </div>



        <button

         className="rounded-md bg-black p-2 text-white"

        >

          Login

        </button>



      </form>


    </div>

  );

}