import { LISTING_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice";

export const listingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteListing: builder.mutation({
      query: (listingId) => ({
        url: `${LISTING_URL}/delete/${listingId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteListingMutation } = listingApiSlice;
