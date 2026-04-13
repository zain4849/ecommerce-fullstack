"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { register } from "@/store/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmedPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    setLoading(true);
    try {
      await dispatch(
        register({ name: data.name, email: data.email, password: data.password }),
      ).unwrap();
      router.push("/");
    } catch (err: any) {
      setServerError(
        err?.response?.data?.error || err?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-[3.125rem] font-bold mb-8 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {serverError}
          </div>
        )}
        <div>
          <Input
            className="pl-7 py-7 rounded-2xl placeholder:text-muted"
            type="text"
            placeholder="Name"
            {...registerField("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input
            className="pl-7 py-7 rounded-2xl placeholder:text-muted"
            type="email"
            placeholder="Email"
            {...registerField("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Input
            className="pl-7 py-7 rounded-2xl placeholder:text-muted"
            type="password"
            placeholder="Password"
            {...registerField("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <Input
            className="pl-7 py-7 rounded-2xl placeholder:text-muted"
            type="password"
            placeholder="Confirm Password"
            {...registerField("confirmedPassword")}
          />
          {errors.confirmedPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmedPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full py-7 rounded-2xl" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
        <p className="text-center text-foreground font-[50]">
          Already have an account?{" "}
          <Link className="text-accent font-medium" href="/auth/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
