interface PageInfo {
  html: string
  route?: string[]
}
export type PageMark = 'Index' | 'Login' | 'Project'

export const LoginPage = 'login.html'
export const Page: {
  [props in PageMark]?: PageInfo
} = {
  Index: {
    html: 'index.html',
    route: ['ProjectManage']
  }
}
