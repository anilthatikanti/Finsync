import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './store/authContext'
import { ProtectedLayout } from './ProtectedRoute'
import { Login } from './components/authComponents/login'
import RedirectIfLoggedIn from './PublicRoute'
import WatchList from './components/appComponents/watchlist'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes >
          <Route element={<RedirectIfLoggedIn/>}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<WatchList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
