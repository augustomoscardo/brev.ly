import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Toaster} from 'sonner'
import { App } from './app'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={ queryClient }>
      <App />
      <Toaster richColors />
    </QueryClientProvider>
  </StrictMode>,
)
