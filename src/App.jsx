import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import CoffeeListPage from "./pages/CoffeeListPage"
import DeleteCoffeePage from "./pages/DeleteCoffeePage"
import CoffeeDetailPage from "./pages/CoffeeDetailPage"
import EditCoffeePage from "./pages/EditCoffeePage"
import AddCoffeePage from "./pages/AddCoffeePage"
import StatisticsPage from "./pages/StatisticsPage"
import SplitViewPage from "./pages/SplitViewPage"
import CoffeeFeedPage from "./pages/CoffeeFeedPage"
import BlendListPage from "./pages/BlendListPage"
import BlendDetailPage from "./pages/BlendDetailPage"
import CreateBlendPage from "./pages/CreateBlendPage"
import PreviewBlendPage from "./pages/PreviewBlendPage"
import ChatPage from "./pages/ChatPage"
import ObservationPage from "./pages/ObservationPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import VerifyCodePage
from "./pages/VerifyCodePage"
import ForgotPasswordPage
from "./pages/ForgotPasswordPage"

import ResetPasswordPage
from "./pages/ResetPasswordPage"

import HeavyStatisticsPage
from "./pages/HeavyStatisticsPage"

function App() {

useEffect(() => {

  // keep current behavior
  if (!sessionStorage.getItem("appStarted")) {
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    sessionStorage.setItem(
      "appStarted",
      "true"
    )
  }

  let timeout

  function resetTimer() {

    clearTimeout(timeout)

    timeout = setTimeout(() => {

      localStorage.removeItem("user")
      localStorage.removeItem("token")

      alert(
        "Session expired due to inactivity"
      )

      window.location.href = "/login"

    }, 15 * 60 * 1000) // 15 minutes / 15000 -> 1 seconds
  }

  // activity listeners
  window.addEventListener(
    "mousemove",
    resetTimer
  )

  window.addEventListener(
    "keydown",
    resetTimer
  )

  window.addEventListener(
    "click",
    resetTimer
  )

  resetTimer()

  return () => {

    clearTimeout(timeout)

    window.removeEventListener(
      "mousemove",
      resetTimer
    )

    window.removeEventListener(
      "keydown",
      resetTimer
    )

    window.removeEventListener(
      "click",
      resetTimer
    )
  }

}, [])

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/coffees" element={<CoffeeListPage />} />
        <Route
          path="/delete/:id"
          element={
            <AdminRoute>
              <DeleteCoffeePage />
            </AdminRoute>
          }
        />
        <Route path="/coffee/:id" element={<CoffeeDetailPage />} />
        <Route
          path="/edit/:id"
          element={
            <AdminRoute>
              <EditCoffeePage />
            </AdminRoute>
          }
        />
        <Route
          path="/add"
          element={
            <AdminRoute>
              <AddCoffeePage />
            </AdminRoute>
          }
        />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/splitview" element={<SplitViewPage />} />
        <Route path="/feed" element={<CoffeeFeedPage />} />
        <Route path="/blends" element={<BlendListPage/>}/>
        <Route path="/blend/:id" element={<BlendDetailPage/>}/>
        <Route path="/create-blend" element={<CreateBlendPage />} />
        <Route path="/preview-blend" element={<PreviewBlendPage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/observations"
          element={
            <AdminRoute>
              <ObservationPage />
            </AdminRoute>
          }
        />
        <Route
          path="/verify"
          element={<VerifyCodePage />}
        />
        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordPage />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPasswordPage />
          }
        />
        <Route
          path="/heavy-statistics"
          element={
            <HeavyStatisticsPage />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App