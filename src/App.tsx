import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './store/authContext'
import { ProtectedLayout } from './ProtectedRoute'
import { Login } from './components/authComponents/login'
import RedirectIfLoggedIn from './PublicRoute'
import WatchList from './components/appComponents/watchlist'
import { SignUp } from './components/authComponents/signup'
import { EmailActionHandler } from './components/authComponents/EmailActionHandler'
import { ForgotPassword } from './components/authComponents/ForgotPassword'
import { ResetPassword } from './components/authComponents/ResetPassword'

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes >
          <Route element={<RedirectIfLoggedIn/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/auth/action" element={<EmailActionHandler />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<WatchList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
