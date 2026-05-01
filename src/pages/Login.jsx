import { useState } from "react";
import { login } from "../api/api";
// komponent przyjmuje funkcję do przejścia na rejestrację
function Login({ goToRegister }) {
  //stan dla emaila
  const [email, setEmail] = useState("");
  // stan dla hasła
  const [password, setPassword] = useState("");
 //logowanie
  const handleLogin = async (e) => {

    e.preventDefault();   //  blokuje przeładowanie formularza

    try {
      //wysyłamy dane logowania do backendu
      const data = await login(email, password);
     //zapisujemy token JWT w sessionStorage
      sessionStorage.setItem("token", data.token)
     //odświeżamy stronę - przejście do Dashboard
      window.location.reload();

    } catch (err) {
      alert(err.message);
    }

  };
//UI
  return (

    <div
      className="login-page"
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

      <p className="login-description">
        Aplikacja umożliwia mieszkańcom zgłaszanie problemów infrastruktury miejskiej
        takich jak dziury w drogach, uszkodzone oświetlenie czy nielegalne wysypiska.
      </p>
     
      <div className="login-box">

        <h2>Logowanie</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"//przeglądarka sprawdza format email
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}// aktualizacja stanu
            required
          />

          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Zaloguj
          </button>

        </form>
        
        <p style={{marginTop:"10px"}}>
        Nie masz konta?
        <span
          onClick={goToRegister}//zmiana widoku na rejestrację
          style={{
            color:"blue",
            cursor:"pointer",
            marginLeft:"5px"
          }}
        >
          Zarejestruj się
        </span>
      </p>
      </div>
    </div>
  );
}
export default Login;