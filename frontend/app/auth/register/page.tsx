"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AxiosError } from "axios";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Register() {
  const { register } = useAuth();
  // const loading = useAuthStore((s) => s.loading);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // clear already displayed error
    try {
      await register(name, email, password);
      window.location.href = "/";
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      alert(err.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div>
      <h1 className="text-[3.125rem] font-bold mb-8 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-7">
        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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
          <Image
            className="cursor-pointer"
            src="/icon-github.svg"
            width={25}
            height={25}
            alt="Login with Github"
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
