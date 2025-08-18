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

    getListing: builder.query({
      query: (listingId) => ({
        url: `${LISTING_URL}/get/${listingId}`,
        method: "GET",
      }),
    }),

    searchListings: builder.query({
      query: () => ({
        url: `${LISTING_URL}/get`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useDeleteListingMutation,
  useGetListingQuery,
  useSearchListingsQuery,
} = listingApiSlice;
