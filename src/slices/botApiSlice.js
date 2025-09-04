import { BOT_URL } from "../utils/constants";
import { apiSlice } from "./apiSlice";

export const botApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Save a message (user or bot) in DB
    saveMessage: builder.mutation({
      query: (data) => ({
        url: `${BOT_URL}/save`,
        method: "POST",
        body: data,
      }),
    }),

    // Get chat history for a session
    getChatHistory: builder.query({
      query: (sessionId) => ({
        url: `${BOT_URL}/history/${sessionId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    // Send a message to bot for dynamic reply
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${BOT_URL}/message`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSaveMessageMutation,
  useGetChatHistoryQuery,
  useSendMessageMutation, // <-- Added hook
} = botApiSlice;
