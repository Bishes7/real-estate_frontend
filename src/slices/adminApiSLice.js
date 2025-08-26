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
  }),
});

export const {
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useGetStatsQuery,
} = adminApiSlice;
