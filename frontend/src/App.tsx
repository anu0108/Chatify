import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import { Toaster } from "react-hot-toast"
import { useAuthContext } from "./context/AuthContext"

function App() {
  const { authUser, loading } = useAuthContext();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )

  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={authUser ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
