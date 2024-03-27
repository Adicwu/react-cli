import { Icon } from '@/components/Icon'
import React from 'react'
import { cn, createLastUpdateDiff, dateFormat } from '.'

export const Formatter = {
  loading(
    content: React.ReactNode,
    loading: boolean,
    {
      key = ''
    }: Partial<{
      key: number | string
    }> = {}
  ) {
    const contentLen = content instanceof Array ? content.length : 1

    return (
      <div className="relative z-[1]" key={key}>
        {loading && (
          <div className="absolute left-0 top-0 z-[3] h-full w-full">
            {Array(contentLen)
              .fill(0)
              .map((_, i) => (
                <p key={i} className="skeleton h-5 w-full"></p>
              ))}
          </div>
        )}
        <div
          style={{
            opacity: loading ? 0 : 1
          }}
        >
          {content}
        </div>
      </div>
    )
  },
  /**
   * 超链接
   * @param v
   * @param t
   * @param opt
   * @returns
   */
  link(v: string, t: string, { target = '_blank' } = {}) {
    return (
      <a href={v} target={target} className="!text-color-base hover:underline">
        {t}
      </a>
    )
  },
  outerLink(
    link: string,
    text: React.ReactNode | string,
    props?: Partial<{
      className: string
      innerClassName: string
    }>
  ) {
    return (
      <div
        className={cn(
          'flex max-w-full items-baseline text-color-base',
          props?.className
        )}
      >
        <Icon
          name="Frame15"
          className="mr-1 cursor-pointer"
          size={14}
          title="访问"
          control
          onClick={() => {
            window.open(link)
          }}
        />
        <div
          className={cn('line-clamp-1 text-ellipsis', props?.innerClassName)}
          style={{
            maxWidth: 'calc(100% - 14px)'
          }}
        >
          {text}
        </div>
      </div>
    )
  }
}
