// @ts-ignore
import { Page } from '../../page.config'

import { jumpLogin } from '@/router/jump'
import { wait } from '@/utils'
import { RouteObject } from 'react-router-dom'

export const pathIsInView = (p: string, views?: string[]) => {
  const viewName = p.match(/\/src\/pages\/(.*?)\/route\.ts/)?.[1]
  return viewName && views?.includes(viewName)
}
export const createRoute = (props: { mark: PageMark }) => {
  const route = {
    routes: [] as RouteObject[],
    routeMap: new Map<string, RouteObject>()
  }

  if (window.mark === props.mark) {
    const mods = import.meta.glob<{
      default: RouteObject
    }>('@/pages/*/route.tsx', {
      eager: true
    })
    return Object.entries(mods).reduce((total, [k, v]) => {
      if (pathIsInView(k, Page[props.mark]?.route)) {
        const list = v.default instanceof Array ? v.default : [v.default]
        total.routes.push(...list)
      }
      return total
    }, route)
  } else {
    return route
  }
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}
export function getToken() {
  return localStorage.getItem('token') || ''
}
export const removeToken = () => {
  localStorage.removeItem('token')
}
export async function logout() {
  // Api.authLogout()
  removeToken()
  await wait(1000)
  jumpLogin()
}
