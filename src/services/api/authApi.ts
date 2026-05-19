import { ENDPOINTS } from './apiEndpoints';
import { baseApi } from './baseApi';

/**
 * Auth API slice injecting login and signup endpoints.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: ENDPOINTS.auth.login,
        method: 'POST',
        body: credentials,
      }),
      // You can invalidate tags here if needed
      // invalidatesTags: ['User'],
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: ENDPOINTS.auth.signup,
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: ENDPOINTS.auth.logout,
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } = authApi;
