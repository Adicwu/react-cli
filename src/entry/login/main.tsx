import { createBaseMain } from '../baseMain'
import App from './App.tsx'

createBaseMain({
  mark: 'Login',
  root: () => <App />
})
