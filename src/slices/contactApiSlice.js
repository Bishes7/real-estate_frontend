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
      invalidatesTags: ["Messages"],
    }),

    getMessage: builder.query({
      query: () => ({
        url: CONTACT_URL,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),

    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `${CONTACT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Messages"],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `${CONTACT_URL}/${id}/mark-read`,
        method: "PUT",
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useContactMessageMutation,
  useGetMessageQuery,
  useDeleteMessageMutation,
  useMarkAsReadMutation,
} = contactMessageSlice;
