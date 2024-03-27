import { RouterProvider, createHashRouter } from 'react-router-dom'
import { createBaseMain } from '../baseMain'
import { createRoute } from '../utils.ts'
import App from './App.tsx'

const PageMark: PageMark = 'Index'

function Root() {
  const routes = createRoute({
    mark: PageMark
  }).routes

  return (
    <RouterProvider
      router={createHashRouter([
        {
          path: '/',
          element: (
            // <BaseLayout>
            <App />
            // </BaseLayout>
          ),
          children: routes
        }
      ])}
    />
  )
}

createBaseMain({
  mark: PageMark,
  root: () => <Root />
})
