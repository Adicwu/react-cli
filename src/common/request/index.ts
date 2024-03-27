import { mergeUrlQuery } from '@/utils'
import axios, { AxiosRequestConfig } from 'axios'
import { TIMEOUT } from './config'
import * as Type from './type'
import AxiosUtils from './utils.class'

export const BASE_URL = import.meta.env.DEV ? 'backend/' : ''

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
  config: AxiosRequestConfig = {}
): Promise<Type.RequestReturnType<T>> {
  type Resp = Type.Response<T>
  try {
    let data: Type.RequestData<T>
    switch (type) {
      case 'get': {
        data = await instance.get<Resp>(mergeUrlQuery(url, params), {
          ...config
        })
        break
      }
      case 'post': {
        data = await instance.post<Resp>(url, params, config)
        break
      }
      case 'put': {
        data = await instance.put<Resp>(url, params, config)
        break
      }
      case 'delete': {
        data = await instance.delete<Resp>(url, {
          data: params,
          ...config
        })
        break
      }
      case 'patch': {
        data = await instance.patch<Resp>(url, params, config)
        break
      }
    }
    return {
      code: data.status,
      data: data.data,
      headers: data.headers
    }
  } catch (err: any) {
    console.log(err)
    return {
      code: err?.response?.status,
      errorText: err?.response?.data?.error
    }
  }
}
