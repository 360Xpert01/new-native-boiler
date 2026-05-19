import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '@store/store';

import { BASE_URL } from './apiEndpoints';

/**
 * Base API slice using RTK Query.
 * All other API features will inject their endpoints here.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Pull token from auth slice
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Chat', 'Notification'],
  endpoints: () => ({}), // Endpoints are injected from other files
});
