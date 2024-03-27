import { request } from '@/common/request'
import type { ApiProjectType } from '@type/api'
import useSWR from 'swr'

/**
 * 项目-列表
 * @param params
 * @returns
 */
export async function getProjectlist(
  params: PageParams<{
    name?: string
  }>
) {
  try {
    const { data } = await request<PageResult<ApiProjectType.BaseInfo>>(
      'get',
      '/api/v1/projects',
      params
    )
    const isTrueData =
      data?.list instanceof Array &&
      typeof data?.page_info.total !== 'undefined'
    return !isTrueData ? null : data
  } catch {
    return null
  }
}

/**
 * 项目-详情
 * @param id
 * @returns
 */
export function useProject(id: string) {
  return useSWR(`/api/v1/projects/${id}`, async (url) => {
    try {
      const { data } = await request<ApiProjectType.BaseInfo>('get', url)
      return data
    } catch {
      return null
    }
  })
}

/**
 * 项目-创建
 * @param params
 * @returns
 */
export async function createProject(
  params: Partial<ApiProjectType.EditableInfo>
) {
  try {
    const { data } = await request<{
      business_id: string
    }>('post', `/api/v1/projects`, params)
    return data?.business_id
  } catch {
    return null
  }
}

/**
 * 项目-删除
 * @param params
 * @returns
 */
export async function delProject(params: { business_ids: string[] }) {
  try {
    const resp = await request('delete', `/api/v1/projects`, params)
    return resp
  } catch {
    return null
  }
}

/**
 * 项目-修改
 * @param params
 * @returns
 */
export async function editProject(
  id: string,
  params: Partial<ApiProjectType.EditableInfo>
) {
  try {
    const resp = await request<{
      business_id: string
    }>('put', `/api/v1/projects/${id}`, params)
    return resp
  } catch {
    return null
  }
}
