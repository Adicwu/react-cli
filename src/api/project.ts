import { request } from '@/common/request'
import type { ApiProjectType } from '@type/api'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

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
      'api/v1/projects',
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
  return useSWR(`api/v1/projects/${id}`, async (url) => {
    try {
      const { data } = await request<ApiProjectType.BaseInfo>('get', url)
      return data
    } catch {
      return null
    }
  })
}

/**
 * 项目-修改
 * @returns
 */
export function useEditProject() {
  return useSWRMutation(
    'projects/{id}',
    async (
      url,
      {
        arg
      }: {
        arg: ApiProjectType.EditableInfo & {
          id: string
        }
      }
    ) => {
      return await request<{
        business_id: string
      }>('put', `projects/${arg.id}`, arg)
    }
  )
}
