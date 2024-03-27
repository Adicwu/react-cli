import {
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders
} from 'axios'

interface BaseResponse {
  error?: string
}

export type Response<T> = T & BaseResponse
export type RequestData<T> = AxiosResponse<Response<T>, unknown>
export interface RequestReturnType<T> {
  code: number
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders
  errorText?: string
  data?: Response<T>
}
