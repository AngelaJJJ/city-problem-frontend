//sprawdzanie czy token JWT jest przeterminowany
export function isTokenExpired(token){

  try{
  //rozdzielamy token JWT (format: header.payload.signature)
  // bierzemy część payload (środkową)
    const payload = JSON.parse(atob(token.split('.')[1]))
   //aktualny czas w sekundach (JWT używa sekund, nie ms)
    const now = Date.now() / 1000
    // porównujemy czas wygaśnięcia tokena z aktualnym czasem
    return payload.exp < now

  }
  catch{
   //jeśli token jest niepoprawny - traktujemy jako wygasły
    return true

  }

}