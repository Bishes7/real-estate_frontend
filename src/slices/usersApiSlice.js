import { AUTH_URL, UPLOADS_URL, USERS_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/delete-account`,
        method: "DELETE",
      }),
    }),

    demoLogin: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/demo-login`,
        method: "POST",
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-profile`,
        method: "PUT",
        body: data,
      }),
    }),

    uploadImage: builder.mutation({
      query: (data) => ({
        url: UPLOADS_URL,
        method: "POST",
        body: data,
      }),
    }),

    userListings: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/listing/${userId}`,
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUploadImageMutation,
  useUserListingsQuery,
  useDemoLoginMutation,
  useDeleteAccountMutation,
} = usersApiSlice;
