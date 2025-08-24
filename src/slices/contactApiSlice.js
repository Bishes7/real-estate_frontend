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

    deleteMessage: builder.mutation({
      query: (userId) => ({
        url: `${CONTACT_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Messages"],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `${CONTACT_URL}/${id}/read`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useContactMessageMutation,
  useGetMessageQuery,
  useDeleteMessageMutation,
  useMarkAsReadMutation,
} = contactMessageSlice;
