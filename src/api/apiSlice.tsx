import { createApi } from "@reduxjs/toolkit/query/react";
import { dataToQueryParameter } from "./APIHelper";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

interface GenericArg {
  endpoint: string;
  method?: string;
  data?: any;
  params?: any;
  headers?: any;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    get: builder.query<any, any>({
      query: (arg) => {
        const endpoint = arg?.endpoint || arg;
        const params = arg?.params ? dataToQueryParameter(arg.params) : "";
        return `${endpoint}${params}`;
      },
    }),

    crud: builder.mutation<any, GenericArg>({
      query: ({ endpoint, method = "POST", data, params, headers }) => ({
        url: params ? `${endpoint}${dataToQueryParameter(params)}` : endpoint,
        method,
        body: data,
        headers: headers || { "Content-Type": "application/json" },
      }),
    }),

    upload: builder.mutation<any, GenericArg>({
      query: ({ endpoint, data, method = "POST", params }) => {
        let bodyData = data;

        if (data && !(data instanceof FormData)) {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]: [string, any]) => {
            if (Array.isArray(value)) {
              value.forEach((item) => formData.append(key, item));
            } else if (value !== undefined && value !== null) {
              formData.append(key, value);
            }
          });
          bodyData = formData;
        }

        return {
          url: params ? `${endpoint}${dataToQueryParameter(params)}` : endpoint,
          method,
          body: bodyData,
        };
      },
    }),
  }),
});

export const { useLazyGetQuery, useGetQuery, useCrudMutation, useUploadMutation } = apiSlice;