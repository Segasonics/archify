import { apiClient } from '../../lib/apiClient';
import { setUser } from '../auth/authSlice';

export const userApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // ignore bootstrap fetch errors
        }
      },
    }),
  }),
});

export const { useGetMeQuery } = userApi;

