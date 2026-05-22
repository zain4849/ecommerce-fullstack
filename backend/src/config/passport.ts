import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma.js";

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "http://localhost:5000/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from Google"), false);

          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            const randomPassword = crypto.randomBytes(32).toString("hex");
            const passwordHash = await bcrypt.hash(randomPassword, 10);
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || email.split("@")[0],
                passwordHash,
                role: Role.CUSTOMER,
                googleId: profile.id,
              },
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error as Error, false);
        }
      },
    ),
  );
}

export default passport;
