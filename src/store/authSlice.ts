import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  loginTime: number | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loginTime: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken?: string; refreshToken?: string; token?: string; [key: string]: any }>
    ) => {
      const { accessToken, refreshToken, token, ...userInfo } = action.payload;
      state.user = userInfo;
      state.token = accessToken || token || null;
      state.refreshToken = refreshToken || null;
      state.loginTime = Date.now();
    },
    tokenRefreshed: (
      state,
      action: PayloadAction<{ accessToken?: string; refreshToken?: string; token?: string }>
    ) => {
      const { accessToken, refreshToken, token } = action.payload;
      state.token = accessToken || token || state.token;
      state.refreshToken = refreshToken || state.refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loginTime = null;
    },
  },
});

export const { loginSuccess, tokenRefreshed, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
