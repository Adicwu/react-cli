import { getToken, logout } from '@/entry/utils'
import { AxiosInstance } from 'axios'

/**
 * axios辅助函数
 */
export default class AxiosUtils {
  private instance: AxiosInstance | null = null
  constructor(instance: AxiosInstance) {
    console.log('AxiosUtils init')

    this.instance = instance
    this.response()
    this.request()
  }
  /**
   * 响应拦截器
   */
  private response() {
    if (this.instance === null) return
    this.instance.interceptors.response.use(
      (response) => {
        // const res = response.data
        // const token = getToken()
        // if (res.code === 401) {
        //   logout()
        // }
        // if (res.code === 402 && token) {
        //   // error('暂无此操作权限！')
        // }
        return response
      },
      (error) => {
        // const status = error.toString()
        // const errText = error.response?.data?.error

        // if (status.includes('500')) {
        //   error(errText)
        // }
        // if (status.includes('404')) {
        //   error('request notfound')
        // }
        // if (errText) {
        //   return Promise.reject(errText)
        // }
        // if (status.includes('timeout')) {
        // error('请求超时，请稍后重试！')
        // }
        return Promise.reject(error)
      }
    )
  }
  /**
   * 请求拦截器
   */
  private request() {
    if (this.instance === null) return
    this.instance.interceptors.request.use((request) => {
      const token = getToken()
      request.headers['Authorization'] = !token ? '' : `Bearer ${token}`
      return request
    })
  }
}
