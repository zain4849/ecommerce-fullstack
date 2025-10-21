"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AxiosError } from "axios";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const { register } = useAuth()
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
      const err = error as AxiosError<{error: string}>
      alert(err.response?.data?.error || "Registration Failed")
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  );
}
