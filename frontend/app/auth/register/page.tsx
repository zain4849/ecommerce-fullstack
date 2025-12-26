"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AxiosError } from "axios";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { register } from "@/store/authSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(8, "Password must be atleast 8 characters"),
    confirmedPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
// // use above instead of:
// type FormData = {
//   email: string,
//   password: string,
// }
// which is w/out zod and takes more code and manual entry to get form to work

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  // const loading = useAuthStore((s) => s.loading);
  // const [error, setError] = useState("");

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Form submitted with data:", data);

    try {
      await dispatch(register({ name: data.name, email: data.email, password: data.password })).unwrap();
      console.log("Registration successful, redirecting...");
      window.location.href = "/";
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      alert(err.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div>
      <h1 className="text-[3.125rem] font-bold mb-8 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="name"
          placeholder="Name"
          // value={name}
          // onChange={(e) => setEmail(e.target.value)}
          {...registerField("name")}


        />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="email"
          placeholder="Email"
          {...registerField("email")}
        />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="password"
          placeholder="Password"
          {...registerField("password")}
        />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="password"
          placeholder="Confirm Password"
          {...registerField("confirmedPassword")}
        />
          {errors.confirmedPassword && <p className="text-red-500">{errors.confirmedPassword.message}</p>}

        <Button type="submit" className="w-full py-7 rounded-2xl">
          Sign Up
        </Button>
        <p className="text-center text-accent">
          <b>Or with</b>
        </p>
        <div className="flex justify-center items-center gap-4">
          <Image
            className="cursor-pointer"
            src="/icon-google.svg"
            width={25}
            height={25}
            alt="Login with Google"
          />
        </div>
        <p className="text-center text-foreground font-[50]">
          Already have an account?{" "}
          <Link className="text-accent font-sm" href="/auth/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
