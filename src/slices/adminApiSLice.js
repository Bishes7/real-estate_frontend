import { ADMIN_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `${ADMIN_URL}/users`,
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${ADMIN_URL}/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    updateUserRole: builder.mutation({
      query: (id, role) => ({
        url: `${ADMIN_URL}/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    getStats: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/stats`,
      }),
    }),

    getAdvancedAnalytics: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/analytics`,
      }),
    }),

    getAllListingsAdmin: builder.query({
      query: ({ limit = 50, startIndex = 0 } = {}) => ({
        url: `${ADMIN_URL}/listings?limit=${limit}&startIndex=${startIndex}`,
      }),
      providesTags: ["Listings"],
    }),

    approveListing: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/listings/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["Listings"],
    }),

    rejectListing: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/listings/${id}/reject`,
        method: "PUT",
      }),
      invalidatesTags: ["Listings"],
    }),
  }),
});

export const {
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useGetStatsQuery,
  useGetAdvancedAnalyticsQuery,
  useApproveListingMutation,
  useRejectListingMutation,
  useGetAllListingsAdminQuery,
} = adminApiSlice;
