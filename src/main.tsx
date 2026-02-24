import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import {AuthProvider} from "./auth/AuthContext.tsx";
import {AppRouter} from "./app/router.tsx";
import rentoraTheme from './theme/theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider theme={rentoraTheme}>
      <CssBaseline />
      <AuthProvider>
          <AppRouter/>
      </AuthProvider>
      </ThemeProvider>
  </StrictMode>,
)
