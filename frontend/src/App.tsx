import { Route, Routes } from "react-router-dom"
import Start from "./pages/Start"
import UserLogin from "./pages/UserLogin"
import UserSignup from "./pages/UserSignup"
import Captainlogin from "./pages/Captainlogin"
import CaptainSignup from "./pages/CaptainSignup"
import Home from "./pages/Home"
import UserProtectWrapper from "./pages/UserProtectWrapper"
import UserLogout from "./pages/UserLogout"
import CaptainHome from "./pages/CaptainHome"
import CapatinProtectWrapper from "./pages/CapatinProtectWrapper"


const App = () => {
  return (
    <div className="text-3xl">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/home" element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
          } />
        <Route path="/users/logout" element={
          <UserProtectWrapper>
          <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path="/captain-home" element={
          <CapatinProtectWrapper>
            <CaptainHome />
          </CapatinProtectWrapper>
          } />
      </Routes>
    </div>
  )
}

export default App
