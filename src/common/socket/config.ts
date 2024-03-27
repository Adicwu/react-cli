const { VITE_BACKEND_PATH, VITE_DEV_HTTPS } = import.meta.env

export const SOCKET_URL = `${VITE_DEV_HTTPS ? 'wss' : 'ws'}://${
  VITE_BACKEND_PATH || location.host
}`
export const TIMEOUT = 7000
