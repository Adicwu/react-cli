import 'react-router-dom'
declare module 'react-router-dom' {
  function useMatches(): import('react-router-dom').UIMatch<
    unknown,
    {
      title?: string
    }
  >[]
}

declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (prop: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null
}
