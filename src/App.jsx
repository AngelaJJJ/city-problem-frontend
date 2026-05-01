import { useState } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import { isTokenExpired } from "./utils/auth"

function App(){
 //stan: czy pokazać ekran rejestracji czy logowania
  const [isRegister, setIsRegister] = useState(false)
  // pobieramy token JWT z sessionStorage
  const token = sessionStorage.getItem("token")
//autoryzacja
  if(!token || isTokenExpired(token)){
    //usuwamy niepoprawny / wygasły token
    sessionStorage.removeItem("token")
  // przełączanie między login a register
    return isRegister 
      ? <Register goToLogin={()=>setIsRegister(false)} />// pokaż rejestrację
      : <Login goToRegister={()=>setIsRegister(true)} />// pokaż logowanie
  }
  // ==================== ZALOGOWANY ====================
  // jeśli token jest OK → pokazujemy Dashboard
  return <Dashboard/>
}

export default App