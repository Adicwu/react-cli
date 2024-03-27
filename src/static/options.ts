import { TargetGradeEnum } from '@/enum'

export interface BaseOption {
  label: string
  value: number | string
  child?: BaseOption[]
}

export function createOption<T extends BaseOption[] = []>(org: T) {
  const res = org as T & {
    findName: (v: BaseOption['value'], dfTxt?: string) => string
  }
  res.findName = function (v: BaseOption['value'], dfTxt = '-') {
    return org.find((item) => item.value === v)?.label || dfTxt
  }
  return res
}

export const TargetGrade = createOption([
  {
    label: '核心',
    value: TargetGradeEnum.Core
  },
  {
    label: '一般',
    value: TargetGradeEnum.General
  },
  {
    label: '边缘',
    value: TargetGradeEnum.Edge
  }
])
