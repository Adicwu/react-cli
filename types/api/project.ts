export interface BaseInfo {
  created_at: number
  updated_at: number
  business_id: string
  name: string
  running_task_num: number
  targets: string[]
}

export interface EditableInfo {
  name: string
}
