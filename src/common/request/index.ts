import { mergeUrlQuery } from '@/utils'
import axios, { AxiosRequestConfig } from 'axios'
import { BASE_URL, TIMEOUT } from './config'
import * as Type from './type'
import AxiosUtils from './utils.class'

const instance = axios.create({
  timeout: TIMEOUT,
  baseURL: BASE_URL,
  withCredentials: true
})
new AxiosUtils(instance)

/**
 *
 * @param type
 * @param url
 * @param params
 * @param config
 * @returns
 */
export async function request<T>(
  type: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  params = {},
  config: AxiosRequestConfig = {},
  customConfig?: Partial<{
    baseURL: string
    /** 是否使用encodeURIComponent对参数的value进行编码 */
    encodeQueryValue: boolean
  }>
): Promise<Type.RequestReturnType<T>> {
  type Resp = Type.Response<T>
  try {
    const { baseURL = '/api/v1/' } = customConfig || {}
    const path = baseURL + url
    let data: Type.RequestData<T>
    switch (type) {
      case 'get': {
        data = await instance.get<Resp>(
          mergeUrlQuery(path, params, {
            encodeValue: customConfig?.encodeQueryValue
          }),
          {
            ...config
          }
        )
        break
      }
      case 'post': {
        data = await instance.post<Resp>(path, params, config)
        break
      }
      case 'put': {
        data = await instance.put<Resp>(path, params, config)
        break
      }
      case 'delete': {
        data = await instance.delete<Resp>(path, {
          data: params,
          ...config
        })
        break
      }
      case 'patch': {
        data = await instance.patch<Resp>(path, params, config)
        break
      }
    }
    return {
      code: data.status,
      data: data.data,
      headers: data.headers
    }
  } catch (error: any) {
    console.error(error)
    return {
      error,
      code: error?.response?.status,
      errorText: error?.response?.data?.message
    }
  }
}
