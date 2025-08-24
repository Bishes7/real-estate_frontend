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

    getMessage: builder.query({
      query: () => ({
        url: CONTACT_URL,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
  }),
});

export const { useContactMessageMutation, useGetMessageQuery } =
  contactMessageSlice;
