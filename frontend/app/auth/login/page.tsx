"use client";

import { useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { login, loadFromStorage } from "@/store/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

function LoginContent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get("token");
    const userData = searchParams.get("userData");
    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch(loadFromStorage());
        router.push("/");
      } catch {
        setError("OAuth login failed");
      }
    }
  }, [searchParams, dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await dispatch(login({ email, password })).unwrap();
      router.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  return (
    <div>
      <h1 className="text-[3.125rem] font-bold mb-8 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-7">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          className="pl-7 py-7 rounded-2xl placeholder:text-muted"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="w-full py-7 rounded-2xl"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <a
          href={`${apiUrl}/auth/google`}
          className="w-full flex items-center justify-center gap-3 border rounded-2xl py-4 hover:bg-gray-50 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-medium">Continue with Google</span>
        </a>

        <p className="text-center text-foreground font-[50]">
          Don&apos;t have an account?{" "}
          <Link className="text-accent font-medium" href="/auth/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
