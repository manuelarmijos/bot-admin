export const APP_CONFIG = {
  ID_DEVICE:      '2becc010-3fb2-4841-8b71-411177fb3fa3',
  APPLICATION_ID: 5479896,
  ID_APP:         300,
  VERSION:        1,
  AUTH_URL:       import.meta.env.VITE_AUTH_URL  as string,
  BOT_API_BASE:   import.meta.env.VITE_BOT_API_BASE as string,
  BOT_TOKEN:      import.meta.env.VITE_BOT_TOKEN as string | undefined,
} as const;
