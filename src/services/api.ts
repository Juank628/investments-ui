import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  // credentials: 'include' — the API authenticates with an httpOnly `access_token` cookie, which
  // the browser will not attach to cross-origin requests unless it is asked to.
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Movement'],
  endpoints: () => ({}),
});
