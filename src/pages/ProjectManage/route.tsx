/** 项目 */

import { RouteObject } from 'react-router-dom'

const Index = () => import('./index')

const route: RouteObject[] = [
  {
    index: true,
    lazy: Index
  },
  {
    path: '/project-manage',
    lazy: Index,
    handle: {
      title: '项目'
    },
    children: [
      {
        path: 'blacklist',
        lazy: () => import('./routes/Blacklist'),
        handle: {
          title: '资产黑名单'
        }
      },
      {
        path: 'upcoming',
        lazy: () => import('./routes/Upcoming'),
        handle: {
          title: '我的待办'
        }
      }
    ]
  }
]

export default route
