import { useState } from "react"
import { uploadPhoto } from "../api/api"

function UploadPhoto({ reportId }) {//przyjmujemy ID zgłoszenia jako props

  const [file, setFile] = useState(null)//stan przechowujący wybrany plik
  //wybor pliku
  const handleFileChange = (e) => {
    // pobieramy pierwszy wybrany plik
    const selectedFile = e.target.files[0]
   //jeśli użytkownik nic nie wybrał → przerywamy
    if (!selectedFile) return

    // walidacja typu pliku
    const allowedTypes = ["image/jpeg", "image/png"]
    //jeśli plik nie jest JPG/PNG → blokujemy
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Dozwolone tylko pliki JPG lub PNG")
      return
    }

    //  walidacja rozmiaru (5MB)
    const maxSize = 5 * 1024 * 1024
    //jeśli plik za duży → blokujemy
    if (selectedFile.size > maxSize) {
      alert("Plik jest za duży (max 5MB)")
      return
    }
    //zapisujemy plik w stanie
    setFile(selectedFile)

  }
  //upload
  const handleUpload = async () => {
    //brak pliku → nie wysyłamy
    if (!file) {
      alert("Wybierz plik")
      return
    }

    try {
      //wysyłamy plik do backendu
      await uploadPhoto(reportId, file)
     //sukces
      alert("Zdjęcie dodane")
      //odświeżamy stronę żeby pokazać nowe zdjęcie
      window.location.reload()

    }
    catch {
      alert("Błąd uploadu")
    }

  }

  return (

    <div style={{ marginTop: "10px" }}>
      // input do wyboru pliku 
      <input
        type="file"
        accept="image/png,image/jpeg"//ograniczenie typów w przeglądarce
        onChange={handleFileChange}
      />
      //przycisk uploadu
      <button onClick={handleUpload}>
        Dodaj zdjęcie
      </button>

    </div>

  )

}

export default UploadPhoto