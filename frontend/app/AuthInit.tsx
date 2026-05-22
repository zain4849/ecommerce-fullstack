"use client"

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";

const AuthInit = () => {
  useCurrentUser();

  return null;
};

export default AuthInit;
