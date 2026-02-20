import { apiClient } from '../../lib/apiClient';

export const billingApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getBillingMe: builder.query({
      query: () => '/billing/me',
      providesTags: ['Billing'],
    }),
    createCheckoutSession: builder.mutation({
      query: (body) => ({
        url: '/billing/create-checkout-session',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Billing'],
    }),
  }),
});

export const { useGetBillingMeQuery, useCreateCheckoutSessionMutation } = billingApi;

