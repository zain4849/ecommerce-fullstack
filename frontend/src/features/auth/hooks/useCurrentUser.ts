"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/authSlice";
import { useEffect } from "react";

export function useCurrentUser() {
  const dispatch = useDispatch();
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (query.data?.userData) {
      dispatch(setCurrentUser(query.data));
    }
  }, [dispatch, query.data]);

  return query;
}
