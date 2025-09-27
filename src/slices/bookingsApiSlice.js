import { BOOKINGS_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice";

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: `${BOOKINGS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bookings"],
    }),

    getMyBookings: builder.query({
      query: () => ({
        url: `${BOOKINGS_URL}/me`,
      }),
      providesTags: ["Bookings"],
    }),

    adminGetBookings: builder.query({
      query: () => ({
        url: `${BOOKINGS_URL}/admin`,
      }),
      providesTags: ["Bookings"],
    }),

    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${BOOKINGS_URL}/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useAdminGetBookingsQuery,
  useUpdateBookingStatusMutation,
} = bookingsApiSlice;


