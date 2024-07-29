import {
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders
} from 'axios'

interface BaseResponse {
  message?: string
}

export type Response<T> = T & BaseResponse
export type RequestData<T> = AxiosResponse<Response<T>, unknown>
export interface RequestReturnType<T> {
  /** 状态码 */
  code: number
  /** 请求成功的结果 */
  data?: Response<T>
  /** 响应头 */
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders
  /** 后端返回的错误文本信息（用户向） */
  errorText?: string
  /** 错误源 */
  error?: any
}
