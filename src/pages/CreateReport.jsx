import { useState } from "react"
import { createReport } from "../api/api"

function CreateReport(){
  //stan dla tytułu zgłoszenia
  const [title,setTitle] = useState("")
  //stan dla opisu zgłoszenia
  const [description,setDescription] = useState("")
  //wysylanie formularza
  const submit = async e =>{

    e.preventDefault()//blokujemy przeładowanie strony przez formularz

    try{
     // wysyłamy dane do backendu
      await createReport(title.trim(), description.trim())//usuwa spacje typu " "
     //sukces
      alert("Zgłoszenie wysłane")
      //odświeżamy stronę aby pokazać nowe zgłoszenie
      window.location.reload()

    }
    catch{

      alert("Błąd")

    }

  }
 //UI
  return(

    <form onSubmit={submit}>

      <h3>Nowe zgłoszenie</h3>

      <input
        placeholder="Tytuł"
        value={title}//powiązanie ze stanem
        onChange={e=>setTitle(e.target.value)} //aktualizacja stanu
        required
        maxLength={100}// wymagana dlugosc
      />

      <textarea
        placeholder="Opis"
        value={description}
        onChange={e=>setDescription(e.target.value)}
        required
        maxLength={700}
      />

      <button>Wyślij</button>

    </form>

  )

}

export default CreateReport