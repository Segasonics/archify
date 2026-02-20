import { apiClient } from '../../lib/apiClient';

export const projectsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    listProjects: builder.query({
      query: ({ page = 1, pageSize = 10 } = {}) => `/projects?page=${page}&pageSize=${pageSize}`,
      providesTags: ['Projects'],
    }),
    createProject: builder.mutation({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Projects', id }],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),
    uploadBlueprint: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/projects/${id}/upload-blueprint`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Projects'],
    }),
    generateRenders: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}/generate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Generations', 'User', 'Billing'],
    }),
    listGenerations: builder.query({
      query: ({ id, page = 1, pageSize = 20 }) =>
        `/projects/${id}/generations?page=${page}&pageSize=${pageSize}`,
      providesTags: ['Generations'],
    }),
  }),
});

export const {
  useListProjectsQuery,
  useCreateProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadBlueprintMutation,
  useGenerateRendersMutation,
  useListGenerationsQuery,
} = projectsApi;

