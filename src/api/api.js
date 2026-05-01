//adresy backendu - mikroserwisy
const AUTH_API = "https://auth-service-new.orangewave-a9df084a.polandcentral.azurecontainerapps.io/api/auth"
const ADMIN_API = "https://auth-service-new.orangewave-a9df084a.polandcentral.azurecontainerapps.io/api/admin"
const REPORT_API = "https://report-service-new.orangewave-a9df084a.polandcentral.azurecontainerapps.io/api"
//  LOGIN
export async function login(email, password) {

  const response = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  // 🔥 KLUCZOWA ZMIANA
  if (!response.ok) {
    const text = await response.text(); // bierzemy komunikat z backendu
    throw new Error(text); // przekazujemy go dalej
  }

  return await response.json();
}


// POBIERANIE ZGŁOSZEŃ UŻYTKOWNIKA
export async function getMyReports() {
  // pobieranie tokena z sesionStorage
  const token = sessionStorage.getItem("token")
  //zabezpieczenie — jeśli nie ma tokena, nie robimy requestu
  if (!token) throw new Error("No token")
  //wysyłamy zapytanie do backendu po zgłoszenia użytkownika
  const response = await fetch(`${REPORT_API}/reports/my`, {
    //dodajemy nagłówek Authorization z tokenem JWT
    headers: {
      Authorization: `Bearer ${token}` //autoryzacja
    }
  })
  
  //sprawdzamy czy backend zwrócił poprawną odpowiedź (status 200)
  if (!response.ok) {
    throw new Error("Error loading reports")
  }
  //zamieniamy odpowiedź (JSON) na obiekt JS i zwracamy
  return await response.json()
}


// TWORZENIE ZGŁOSZENIA
export async function createReport(title, description, location){

  const token = sessionStorage.getItem("token")

  //wysyłamy nowe zgłoszenie
  const response = await fetch(`${REPORT_API}/reports`,{

    method:"POST",

    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`//wymagany token
    },
   // wysylamy dane zgloszenia
   body: JSON.stringify({
    title,
    description,
    location
  })

  })

  if(!response.ok){
    throw new Error("Create report failed")
  }

  return await response.json()

}


//  UPLOAD ZDJĘCIA
export async function uploadPhoto(reportId,file){

  const token = sessionStorage.getItem("token")
  // tworzymy formularz (do plikow)
  const formData = new FormData()
  // dodajemy plik do formularza
  formData.append("file",file)

  const response = await fetch(`${REPORT_API}/reports/${reportId}/photo`,{

    method:"POST",

    headers:{
      Authorization:`Bearer ${token}`
      //NIE dodajemy Content-Type → przeglądarka ustawia sama
    },

    body:formData// wysylamy plik

  })

  if(!response.ok){
    throw new Error("Upload failed")
  }

  return await response.json()

}
// INFO O UZYTKOWNIKU
export async function getMe(){
  //pobieramy token JWT z sessionStorage (czyli dane zalogowanego użytkownika)
  const token = sessionStorage.getItem("token")
  //wysyłamy zapytanie do backendu o dane aktualnego użytkownika
  if (!token) throw new Error("No token")//brak logowania
   const response = await fetch(`${AUTH_API}/me`,{
    //dodajemy nagłówek Authorization z tokenem
    //backend na tej podstawie wie kto wysłał zapytanie
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  if (!response.ok) throw new Error("User error")//blad backendu
  //zamieniamy odpowiedź (JSON) na obiekt JavaScript
  return await response.json()
}
//WSZYSTKIE ZGLOSZENIA
export async function getAllReports(){
   //  pobieramy token
  const token = sessionStorage.getItem("token")

  //  jeśli brak tokena → brak dostępu
  if (!token) throw new Error("No token")

  // wysyłamy zapytanie do backendu po wszystkie zgłoszenia (dla Clerk/Admin)
  const res = await fetch(`${REPORT_API}/reports`, {
    //dodajemy token JWT w nagłówku Authorization
    headers:{
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  })
  //  sprawdzamy czy backend zwrócił poprawną odpowiedź
  if(!res.ok) throw new Error("Error loading reports")

  // zamieniamy odpowiedź JSON na obiekt JavaScript
  return await res.json()
}
//ZMIANA STATUSU
export async function updateStatus(id, status){
  // wysyłamy zapytanie do backendu, aby zmienić status zgłoszenia
  await fetch(`${REPORT_API}/reports/${id}/status`, {
    method: "PUT",//metoda PUT = aktualizacja danych
    headers:{
      "Content-Type": "application/json",//wysyłamy dane jako JSON
      "Authorization": "Bearer " + sessionStorage.getItem("token")//dodajemy token JWT do autoryzacji
    },
    //wysyłamy nowy status (np. "Open", "InProgress", "Resolved")
    body: JSON.stringify(status)
  })
}
//USUWANIE ZGLOSZENIA
export async function deleteReport(id){
  //wysyłamy zapytanie do backendu o usunięcie zgłoszenia o danym id
  await fetch(`${REPORT_API}/reports/${id}`, {
    method: "DELETE",//metoda DELETE = usuwanie zasobu
    headers:{
      //dodajemy token JWT do autoryzacji
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  })
}
//KOMENATARZE
export async function getComments(reportId){
  //wysyłamy zapytanie do backendu o komentarze dla danego zgłoszenia
  const res = await fetch(`${REPORT_API}/reports/${reportId}/comments`, {
    //dodajemy token JWT do autoryzacji
    headers: {
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  })
  //zamieniamy odpowiedź JSON na obiekt JS
  return res.json()
}
//DODAWANIE KOMENATARZY
export async function addComment(reportId, content){
  //wysyłamy nowy komentarz do backendu
  const res = await fetch(`${REPORT_API}/reports/${reportId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",//wysyłamy JSON
      // token JWT
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    },
    // wysyłamy treść komentarza
    body: JSON.stringify({ content })//wysylamy komentarz
  })
  //zwracamy odpowiedź
  return res.json()
}
//REJESTRACJA
export async function register(email, password){
  // wysyłamy dane rejestracji do backendu
  const res = await fetch(`${AUTH_API}/register`, {
    method: "POST",//tworzenie nowego użytkownika
    headers: {
      "Content-Type": "application/json"//wysyłamy dane w formacie JSON
    },
    //dane użytkownika
    body: JSON.stringify({
      email: email.trim(),//usuwamy spacje z emaila (walidacja frontend)
      password
    })
  })
  //pobieramy odpowiedź jako tekst (bo backend zwraca string, nie JSON)
  const text = await res.text()
  // debug — pokazuje odpowiedź backendu w konsoli
  console.log("REGISTER RESPONSE:", text)
  //jeśli backend zwróci błąd (np. email zajęty)
  if(!res.ok){
    throw new Error(text)// pokazujemy dokładny błąd z backendu
  }

  return text   // zwracamy tekst (np. "User registered")
}
//POGODA
export async function getWeather() {
  // wysyłamy zapytanie do backendu o dane pogodowe
  //backend łączy się z zewnętrznym API (np. OpenWeather)
  const res = await fetch(`${REPORT_API}/weather?city=Krakow`)
  // sprawdzamy czy odpowiedź jest poprawna (status 200)
  if (!res.ok) throw new Error("Weather error")
  //zamieniamy JSON na obiekt JS i zwracamy dane pogodowe
  return res.json()
}

export async function getUsers(){
  const res = await fetch(`${ADMIN_API}/users`, {
    headers:{
      Authorization: "Bearer " + sessionStorage.getItem("token")
    }
  })

  return res.json()
}

export async function changeRole(id, role){
  await fetch(`${ADMIN_API}/users/${id}/role`, {
    method: "PUT",
    headers:{
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token")
    },
    body: JSON.stringify(role)
  })
}