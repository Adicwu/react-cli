import { getToken } from '@/entry/utils'
import { jsonParse, wait } from '@/utils'
import { SOCKET_URL } from './config'
import { useEffect } from 'react'

/**
 * 主动响应类型
 */
export enum RespType {
  Bad = -1,
  TaskState = 1,
  TaskAssets = 2
}

type EventCbParams = { type?: RespType; detail?: string }

let socket: null | WebSocket
let heartTimer: null | NodeJS.Timeout
let reConnectCount = 0
const events = new Map<RespType, Set<(e: unknown) => void>>()

const startHeartBeat = () => {
  endHeartBeat()
  heartTimer = setInterval(() => {
    socket?.send('heart')
  }, 1000 * 3)
}
const endHeartBeat = () => {
  if (heartTimer) {
    clearInterval(heartTimer)
  }
}
const connect = async () => {
  if (reConnectCount > 5) {
    reConnectCount = 0
    // console.log('链接失败！')
    return
  }
  reConnectCount++
  const soc = await createWebSocket()
  if (soc) {
    socket = soc
  } else {
    await wait(1000 * 10)
    // console.log('重新链接....')
    connect()
  }
}

const createWebSocket = () =>
  new Promise<WebSocket | null>((resolve, reject) => {
    const token = getToken()
    if (!token) return reject()
    const soc = new WebSocket(`${SOCKET_URL}/api/v1/task/ws?token=${token}`)
    soc.onopen = () => {
      soc.send('Hello Server!')
      startHeartBeat()
      resolve(soc)
    }
    soc.onerror = (e) => {
      console.error(e)
      resolve(null)
    }
  })

/**
 * Socket初始化
 * @returns
 */
export const init = async () => {
  try {
    await connect()
    if (!socket) return
    socket.addEventListener('message', (e) => {
      const { detail = {}, type = -1 } = jsonParse<EventCbParams>(e.data, {})
      events.has(type) &&
        [...events.get(type)!].forEach((cb) => {
          cb(detail)
        })
    })
    socket.addEventListener('error', () => {
      socket = null
    })
    socket.addEventListener('close', () => {
      socket = null
      endHeartBeat()
      connect()
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * Socket监听
 * @param type
 * @param cb
 */
export function on(type: RespType, cb: (e: any) => void) {
  if (events.has(type)) {
    const evt = events.get(type)
    evt?.add(cb)
  } else {
    events.set(type, new Set([cb]))
  }
}
/**
 * Socket取消监听
 * @param type
 * @param cb
 */
export function off(...[type, cb]: Parameters<typeof on>) {
  if (events.has(type)) {
    const evt = events.get(type)!
    evt.delete(cb)
  }
}

interface UseSocketListener {
  (
    type: RespType.TaskState,
    cb: (e: { taskId: string; state: number }) => void
  ): void
  (
    type: RespType.TaskAssets,
    cb: (e: { taskId: string; assets: string[] }) => void
  ): void
}
/**
 * Socket监听hooks
 * @param args
 */
export const useSocketListener: UseSocketListener = (...args) => {
  useEffect(() => {
    on(...args)
    return () => {
      off(...args)
    }
  }, [])
}
