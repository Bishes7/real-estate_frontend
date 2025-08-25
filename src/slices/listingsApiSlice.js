import { LISTING_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice";

export const listingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query({
      query: ({ limit, startIndex }) => ({
        url: `${LISTING_URL}/get?limit=${limit}&startIndex=${startIndex}`,
        method: "GET",
      }),
      providesTags: ["Listings"],
    }),

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
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        console.log("Frontend hitting:", `${LISTING_URL}/get?${queryString}`);
        return {
          url: `${LISTING_URL}/get?${queryString}`,
          method: "GET",
        };
      },
    }),

    updateListing: builder.mutation({
      query: ({ id, data }) => ({
        url: `${LISTING_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useDeleteListingMutation,
  useGetListingQuery,
  useSearchListingsQuery,
  useGetListingsQuery,
  useUpdateListingMutation,
} = listingApiSlice;
