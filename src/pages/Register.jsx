import { useState } from "react"
import { register } from "../api/api"

function Register({ goToLogin }){
  // stan dla emaila
  const [email, setEmail] = useState("")
  // stan dla hasla
  const [password, setPassword] = useState("")
//REJESTRACJA
  async function handleRegister(e){
    e.preventDefault()//blokuje reload formularza

    try{
      //wysyłamy dane do backendu (tworzenie użytkownika)
      await register(email, password)
      alert("Rejestracja udana! Możesz się zalogować")
    }
    catch(e){
      alert(e.message)//błąd z backendu (np. email zajęty)
    }
  }

  return (
     <div
    className="register-page"
    style={{
      backgroundImage: `url(/src/assets/background.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh"
    }}
  >
    <h1 className="login-title">
      System Zgłoszeń Problemów Miejskich
    </h1>

      <h2 style={{ color: "black" }}>Rejestracja</h2>

      <form onSubmit={handleRegister} style={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
      }}>

        <input
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          style={{marginBottom:"10px", padding:"10px", width:"250px"}}
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          style={{marginBottom:"10px", padding:"10px", width:"250px"}}
        />

        <button type="submit">
          Zarejestruj się
        </button>

      </form>

      <p style={{marginTop:"10px"}}>
        Masz już konto?
        <span
            onClick={goToLogin}//zmiana widoku na login
            style={{
            color:"blue",
            cursor:"pointer",
            marginLeft:"5px"
            }}
        >
            Zaloguj się
        </span>
        </p>

    </div>
  )
}

export default Register