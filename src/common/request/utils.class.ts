import { AxiosInstance } from 'axios'

/**
 * axios辅助函数
 */
export default class AxiosUtils {
  private instance: AxiosInstance | null = null
  constructor(instance: AxiosInstance) {
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
        return response
      },
      (error) => {
        const status = Number(error?.response?.status)
        switch (status) {
          case 401: {
            // logout({
            //   withApi: false
            // })
            break
          }
        }
        if (status >= 500) {
        }
        if (error.toString().includes('timeout')) {
        }
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
      // const { token } = getUID()
      // request.headers['Authorization'] = !token ? '' : `Bearer ${token}`
      return request
    })
  }
}
