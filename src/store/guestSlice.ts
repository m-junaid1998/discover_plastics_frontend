import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export const GUEST_ID_HEADER = "X-Guest-Id";

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;

interface GuestState {
  guestId: string;
}

const initialState: GuestState = { guestId: `guest_${generateId()}` };

export const guestSlice = createSlice({
  name: "guest",
  initialState,
  reducers: {
    setGuestId: (state, action: PayloadAction<string>) => {
      if (action.payload) state.guestId = action.payload;
    },
  },
});

export const { setGuestId } = guestSlice.actions;
export const guestReducer = guestSlice.reducer;

