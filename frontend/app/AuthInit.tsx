"use client"

import { loadFromStorage } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthInit = () => {
  const dispatch = useDispatch<AppDispatch>();

  // This is because when I refresh all redux slices are lost (set to initialState again)
  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  return null;
};

export default AuthInit;
