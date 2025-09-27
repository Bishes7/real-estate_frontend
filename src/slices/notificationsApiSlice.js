import { NOTIFICATIONS_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice";

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ limit = 20, page = 1 } = {}) => ({
        url: `${NOTIFICATIONS_URL}?limit=${limit}&page=${page}`,
      }),
      providesTags: ["Notifications"],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}/mark-read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/read-all`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    createNotification: builder.mutation({
      query: (data) => ({
        url: `${NOTIFICATIONS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),

    adminGetNotifications: builder.query({
      query: ({ limit = 50, page = 1 } = {}) => ({
        url: `${NOTIFICATIONS_URL}/admin?limit=${limit}&page=${page}`,
      }),
      providesTags: ["Notifications"],
    }),

    createTestNotification: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/test`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,
  useAdminGetNotificationsQuery,
  useCreateTestNotificationMutation,
} = notificationsApiSlice;
