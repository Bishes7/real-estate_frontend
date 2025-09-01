import { BOT_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice"; // assuming you have apiSlice set up already

export const botApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${BOT_URL}/message`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = botApiSlice;
