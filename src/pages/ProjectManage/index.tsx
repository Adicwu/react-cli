import { Outlet } from 'react-router-dom'

export function Component() {
  return (
    <div className="flex h-full w-full">
      <Outlet />
    </div>
  )
}
