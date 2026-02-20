import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenManager } from './tokenManager';
import { clearSession, setAccessToken } from '../features/auth/authSlice';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = tokenManager.getToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions,
    );

    if (refreshResult.data?.accessToken) {
      tokenManager.setToken(refreshResult.data.accessToken);
      api.dispatch(setAccessToken(refreshResult.data.accessToken));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      tokenManager.clear();
      api.dispatch(clearSession());
    }
  }

  return result;
};

export const apiClient = createApi({
  reducerPath: 'apiClient',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Projects', 'Generations', 'Billing'],
  endpoints: () => ({}),
});

