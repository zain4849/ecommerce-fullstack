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
    queryFn: async () => { // always returns an object with data property and error property
      /*
      response.data = {
        userData: {
          id: "123",
          email: "test@test.com",
          name: "Test",
          role: "CUSTOMER"
        }
      }
      */
      const response = await api.get("/auth/me"); // Axios response object
      return response.data; // this becomes query.data
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
