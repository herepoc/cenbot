/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DIFY_HOST: string
  readonly VITE_DIFY_API_KEY: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  // mais variáveis de ambiente...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
