import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {AuthProvider} from "./auth/AuthContext.tsx";
import {AppRouter} from "./app/router.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <AppRouter/>
      </AuthProvider>
  </StrictMode>,
)
