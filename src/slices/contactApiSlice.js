import { CONTACT_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice";

export const contactMessageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    contactMessage: builder.mutation({
      query: (data) => ({
        url: CONTACT_URL,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useContactMessageMutation } = contactMessageSlice;
