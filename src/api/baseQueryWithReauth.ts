import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { baseUrl, endpoints } from "./config";
import { GUEST_ID_HEADER } from "../store/guestSlice";
import { tokenRefreshed, logout } from "../store/authSlice";
import type { RootState } from "../store/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/api/`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;
    const guestId = state.guest?.guestId;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    if (guestId) {
      headers.set(GUEST_ID_HEADER, guestId);
    }
    return headers;
  },
});

let refreshPromise: Promise<string | null> | null = null;

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
args, api, extraOptions ) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth?.refreshToken;

    if (!refreshToken) {
      return result;
    }

    if (!refreshPromise) {
    refreshPromise = (async () => {
    const refreshResult: any = await rawBaseQuery(
    { url: endpoints.authRoutes.refreshToken, method: "POST", body: { refreshToken } },
    api,extraOptions);
     if (refreshResult.data?.success) { api.dispatch(tokenRefreshed(refreshResult.data));
     return refreshResult.data.accessToken as string}

     api.dispatch(logout());
     return null;
      })().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;

    if (newAccessToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};