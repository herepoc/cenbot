export const config = {
  dify: {
    host: import.meta.env.VITE_DIFY_HOST,
    apiKey: import.meta.env.VITE_DIFY_API_KEY
  },
  app: {
    title: import.meta.env.VITE_APP_TITLE,
    description: import.meta.env.VITE_APP_DESCRIPTION
  }
} as const
