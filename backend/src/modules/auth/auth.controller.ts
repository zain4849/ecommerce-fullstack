import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import { createToken, loginUser, registerUser } from "./auth.service.js";

const attachTokenCookie = (res: Response, token: string) => { 
  res.cookie("token", token, { // Once sent to client, it is stored in the browser's cookies automatically
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};
/*
  httpOnly: true
 - The cookie cannot be accessed by JavaScript in the browser
 - Protects against XSS attacks (malicious scripts stealing tokens)
 - Why the name “HttpOnly”?
    The name comes from the idea:
    “This cookie is only for HTTP(S) requests.”

    Meaning:

    accessible by the network layer / browser request system
    not accessible by client-side scripting APIs (e.g. document.cookie)


  sameSite: "lax"
  - Controls when cookies are sent in cross-site requests:
    - "lax" means:
      - Sent on normal navigation (clicking links, GET requests)
      - Not sent in most cross-site POST requests
    - Helps reduce CSRF attacks while keeping usability.
*/

const toUserData = (user: { id: string; email: string; name: string; role: "CUSTOMER" | "ADMIN" }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    if (!user) return res.status(400).json({ error: "User already exists" });
    const token = createToken(user.id, user.role);
    attachTokenCookie(res, token); // attaches the token to the response cookie
    return res.status(201).json({ message: "User created", userData: toUserData(user) });
  } catch (error) {
    logger.error({ error, reqId: req.id }, "Failed to register user");
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const token = createToken(user.id, user.role);
    attachTokenCookie(res, token);
    return res.json({ userData: toUserData(user) });
  } catch (error) {
    logger.error({ error, reqId: req.id }, "Failed to login user");
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true },
    });
    /*
    user = {
      id: "123",
      email: "test@test.com",
      name: "Test",
      role: "CUSTOMER"
    }
    */
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ userData: user });
  } catch (error) {
    logger.error({ error, reqId: req.id }, "Failed to fetch current user");
    return res.status(500).json({ error: "Internal server error" });
  }
};
