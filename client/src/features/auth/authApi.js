import { apiClient } from '../../lib/apiClient';
import { clearSession, setSession } from './authSlice';

export const authApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSession(data));
        } catch {
          // handled by consumer
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSession(data));
        } catch {
          // handled by consumer
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearSession());
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRefreshMutation, useLogoutMutation } = authApi;

