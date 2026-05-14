/**
 * chatSlice — Manages chat messages and local state.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@store/store';

// ── Types ──────────────────────────────────────────────────────
export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: number;
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [
    {
      id: '1',
      text: 'Welcome to the real-time chat! 🚀',
      sender: 'other',
      timestamp: Date.now(),
    },
  ],
};

// ── Slice ──────────────────────────────────────────────────────
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /** Add a new message to the list */
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    /** Clear all messages */
    clearChat: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearChat } = chatSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
export const selectMessages = (state: RootState) => state.chat.messages;

export default chatSlice.reducer;
