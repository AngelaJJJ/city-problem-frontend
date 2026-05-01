import { useEffect, useState } from "react"
import { getMyReports, createReport, uploadPhoto, getMe, getAllReports, updateStatus, deleteReport,addComment, getComments, getWeather, changeRole, getUsers } from "../api/api"


function Dashboard(){
  //dopasowywanie ikon do pogody
  function getWeatherIcon(weatherMain) {
    switch (weatherMain) {
      case "Rain":
        return "🌧️"
      case "Clouds":
        return "☁️"
      case "Clear":
        return "☀️"
      case "Snow":
        return "❄️"
      case "Thunderstorm":
        return "⛈️"
      default:
        return "🌤️"
    }
  }
  //lista zgłoszeń (pobranych z backendu)
  const [reports,setReports] = useState([])
  //tytuł nowego zgłoszenia (formularz)
  const [title,setTitle] = useState("")
  //opis zgłoszenia
  const [description,setDescription] = useState("")
  //plik (zdjęcie do uploadu)
  const [file,setFile] = useState(null)
  //dane zalogowanego użytkownika (email + rola)
  const [user,setUser] = useState(null)
  //aktualnie powiększone zdjęcie (modal)
  const [selectedImage, setSelectedImage] = useState(null)
  //komentarze (obiekt: reportId → lista komentarzy)
  const [comments, setComments] = useState({})
  // nowe komentarze (dla każdego zgłoszenia osobno)
  const [newComment, setNewComment] = useState({})
  // lokalizacja zgłoszenia
  const [location, setLocation] = useState("")
  //dane pogodowe z API
  const [weather, setWeather] = useState(null)
  // // lista użytkowników (pobrana z backendu przez admina)
  const [users, setUsers] = useState([])
  // ile użytkowników aktualnie wyświetlamy (do "pokaż więcej / mniej")
  const [visibleUsers, setVisibleUsers] = useState(2)

  function logout(){// wylogowywanie
    //usuwamy token JWT - użytkownik przestaje być zalogowany
    sessionStorage.removeItem("token")
    // odświeżamy stronę - powrót do logowania
    window.location.reload()
  }
//DODAWANIE ZGŁOSZENIA
  async function submitReport(e){

    e.preventDefault()//blokujemy reload formularza

    try{

        // wysyłamy zgłoszenie do backendu
        const report = await createReport(title, description, location)

        // jeśli jest zdjęcie → upload
        if(file){
            await uploadPhoto(report.id, file)
        }

        //  odświeżamy listę zgłoszeń (zależnie od roli)
        if(user.role === "Citizen"){
            const data = await getMyReports()
            setReports(data)
        }

        if(user.role === "Clerk"){
            const data = await getAllReports()
            setReports(data)
        }
        

        //  reset formularza
        setTitle("")
        setDescription("")
        setFile(null)
        setLocation("")

    }
    catch{
        alert("Błąd dodawania zgłoszenia")
    }

}
//ŁADOWANIE DANYCH
  useEffect(()=>{

    async function load(){
       // pobieramy dane użytkownika (na podstawie JWT)
        const userData = await getMe()
        setUser(userData)

        let data = []
        //jeśli Citizen - tylko jego zgłoszenia
        if(userData.role === "Citizen"){
            data = await getMyReports()
        }
        //jeśli Clerk/Admin - wszystkie zgłoszenia
        if(userData.role === "Clerk" || userData.role === "Admin"){
            data = await getAllReports()
        }
        // admin pobiera listę wszystkich użytkowników z backendu
        if(userData.role === "Admin"){
          const usersData = await getUsers()
          //zapisujemy użytkowników w state, żeby wyświetlić ich w UI
          setUsers(usersData)
        }
        //zapisujemy zgłoszenia do state
        setReports(data)
        //pobieramy komentarze do każdego zgłoszenia
        const commentsData = {}

        for (let r of data){
          //pobranie komentarzy dla konkretnego zgłoszenia
            commentsData[r.id] = await getComments(r.id)
        }
        // zapis komentarzy
        setComments(commentsData)
      }

        // POGODA
      async function loadWeather(){
      try{
        const weatherData = await getWeather()
        setWeather(weatherData)
      }catch{
        console.log("Weather error")
      }
    }

    load()
    loadWeather()

    // 🔥 odświeżanie co 10 minut
    const interval = setInterval(loadWeather, 600000)

    return () => clearInterval(interval)

  }, [])

  return (

<div style={{
  width:"100%",
  margin:"40px 0",
  padding:"20px",
  boxSizing:"border-box"   
}}>

  {/* HEADER */}
  <div style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"30px",
    paddingBottom:"10px",
    borderBottom:"1px solid #ddd",
    maxWidth:"1200px",        
    margin:"0 auto 30px auto" //  wyśrodkowanie
  }}>

    <div>
      <h2 style={{margin:0}}>Panel użytkownika</h2>
      {user && (
        <div style={{fontSize:"13px", color:"#666", marginTop:"4px"}}>
          Zalogowany jako: <b>{user.email}</b> ({user.role})
        </div>
      )}
    </div>
    {weather && (
      <div style={{
        background: "#eef6ff",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        {getWeatherIcon(weather.weather[0].main)} {weather.name} — {weather.main.temp}°C 
        <div style={{fontSize:"14px", color:"#555"}}>
          {weather.weather[0].description}
        </div>
      </div>
    )}

    <button onClick={logout} style={{
      padding:"8px 12px",
      borderRadius:"6px",
      border:"none",
      background:"#e74c3c",
      color:"white",
      cursor:"pointer"
    }}>
      Wyloguj
    </button>

  </div>

  {/* ================= CITIZEN ================= */}
{user?.role === "Citizen" && (

<>

  {/* FORMULARZ */}
  <div style={{
    background:"#d1dfe4",
    padding:"40px",
    borderRadius:"10px",
    marginBottom:"40px",
    width:"100%",
    maxWidth:"900px",
    margin:"0 auto 40px auto"
  }}>

    <h3>Nowe zgłoszenie</h3>

    <form onSubmit={submitReport} style={{
      display:"flex",
      flexDirection:"column",
      alignItems:"stretch"
    }}>

      {/* TYTUŁ */}
      <input
        placeholder="Tytuł"
        value={title}
        onChange={e=>setTitle(e.target.value)}
        maxLength={100}
        style={{
          width:"100%",
          padding:"12px",
          marginBottom:"5px",
          boxSizing:"border-box"
        }}
      />
      <div style={{
        width:"100%",
        maxWidth:"100%",
        textAlign:"right",
        fontSize:"12px",
        color:"#666",
        marginBottom:"10px"
      }}>
        {title.length}/100 znaków
      </div>

      <input
        placeholder="Lokalizacja (np. ul. Warszawska 10 / Kraków / DK7)"
        value={location}
        onChange={e=>setLocation(e.target.value)}
        required
        maxLength={100} 
        style={{
          width:"100%",
          padding:"12px",
          marginBottom:"15px",
          borderRadius:"6px",
          border:"1px solid #ccc",
          fontSize:"15px"
        }}
      />
      <div style={{
        width:"100%",
        textAlign:"right",
        fontSize:"12px",
        color:"#666",
        marginBottom:"10px"
      }}>
        {location.length}/100 znaków
      </div>

      

      {/* OPIS */}
      <textarea
        placeholder="Opis problemu"
        value={description}
        onChange={e=>setDescription(e.target.value)}
        maxLength={700}
        style={{
          width:"100%",
          maxWidth:"100%",
          height:"150px",
          padding:"12px",
          boxSizing:"border-box",
          resize:"none",
          marginBottom:"5px"
        }}
      />

      <div style={{
        width:"100%",
        maxWidth:"100%",
        textAlign:"right",
        fontSize:"12px",
        color:"#666",
        marginBottom:"10px"
      }}>
        {description.length}/700 znaków
      </div>

      {/* PLIK */}
      <input
        type="file"
        onChange={e=>setFile(e.target.files[0])}
        style={{marginBottom:"10px"}}
      />

      <button type="submit">Dodaj zgłoszenie</button>

    </form>
  </div>

  {/* LISTA */}
  <h3>Moje zgłoszenia</h3>

  {reports.map(r => (
    <div key={r.id} style={{
      border:"1px solid #ddd",
      padding:"20px",
      marginBottom:"15px",
      borderRadius:"8px"
    }}>

      <h4>{r.title}</h4>
      <div style={{fontSize:"13px", color:"#666"}}>
        Autor: <b>{r.createdBy}</b>
      </div>
      <div style={{marginBottom:"10px"}}>
        Lokalizacja: <b>{r.location}</b>
      </div>
      <p>{r.description}</p>
      <div>Status: <b>{r.status}</b></div>

      {/*  ZDJĘCIE */}
      {r.photoUrl && (
        <img
          src={`http://localhost:5231${r.photoUrl}`}
          style={{
            width:"120px",
            height:"90px",
            objectFit:"cover",
            cursor:"pointer",
            marginTop:"10px"
          }}
          onClick={() => setSelectedImage(`http://localhost:5231${r.photoUrl}`)}
        />
      )}

      {/*  KOMENTARZE */}
      <div style={{marginTop:"15px"}}>
        <b>Komentarze:</b>

        {comments[r.id]?.length === 0 && (
          <div style={{fontSize:"12px", color:"#888"}}>
            Brak komentarzy
          </div>
        )}

        {comments[r.id]?.map(c => (
          <div key={c.id} style={{
            background:"#f1f1f1",
            padding:"8px",
            marginTop:"5px",
            borderRadius:"6px"
          }}>
            {c.content}
            <div style={{fontSize:"11px", color:"#666"}}>
              {c.createdBy}
            </div>
          </div>
        ))}
      </div>

    </div>
  ))}

</>
)}

  {/* ================= CLERK ================= */}
{user?.role === "Clerk" && (

<>
  <h3>Wszystkie zgłoszenia</h3>

  {reports.map(r => (
    <div key={r.id} style={{
      border:"1px solid #ddd",
      padding:"20px",
      marginBottom:"15px",
      borderRadius:"8px"
    }}>

      <h4>{r.title}</h4>
      <div style={{fontSize:"13px", color:"#666"}}>
        Autor: <b>{r.createdBy}</b>
      </div>
      <div style={{marginBottom:"10px"}}>
        Lokalizacja: <b>{r.location}</b>
      </div>
      <p>{r.description}</p>

      <div>Status: <b>{r.status}</b></div>

      <select
        value={r.status}
        onChange={async (e)=>{
          await updateStatus(r.id, e.target.value)
          const data = await getAllReports()
          setReports(data)
        }}
      >
        <option value="Unread">Unread</option>
        <option value="InProgress">InProgress</option>
        <option value="Resolved">Resolved</option>
      </select>

      {/*  ZDJĘCIE */}
      {r.photoUrl && (
        <img
          src={`http://localhost:5231${r.photoUrl}`}
          style={{
            width:"120px",
            height:"90px",
            objectFit:"cover",
            cursor:"pointer",
            marginTop:"10px"
          }}
          onClick={() => setSelectedImage(`http://localhost:5231${r.photoUrl}`)}
        />
      )}

      {/*  KOMENTARZE */}
      <div style={{marginTop:"15px"}}>
        <b>Komentarze:</b>

        {comments[r.id]?.length === 0 && (
          <div style={{fontSize:"12px", color:"#888"}}>
            Brak komentarzy
          </div>
        )}

        {comments[r.id]?.map(c => (
          <div key={c.id} style={{
            background:"#f1f1f1",
            padding:"8px",
            marginTop:"5px",
            borderRadius:"6px"
          }}>
            {c.content}
            <div style={{fontSize:"11px", color:"#666"}}>
              {c.createdBy}
            </div>
          </div>
        ))}
      </div>

      {/*  DODAWANIE KOMENTARZA */}
      <textarea
        placeholder="Dodaj komentarz..."
        value={newComment[r.id] || ""}
        maxLength={300} 
        onChange={e => setNewComment({
          ...newComment,
          [r.id]: e.target.value
        })}
        style={{
          width:"100%",
          maxWidth:"400px",
          marginTop:"10px",
          padding:"8px",
          resize:"none"
        }}
        
      />
      <div style={{
        fontSize:"12px",
        color:"#666",
        textAlign:"right",
        maxWidth:"400px"
        }}>
        {(newComment[r.id] || "").length}/300
     </div>


      <button
        style={{marginTop:"5px"}}
        onClick={async ()=>{
          if(!newComment[r.id]) return

          await addComment(r.id, newComment[r.id])

          const updated = await getComments(r.id)

          setComments({
            ...comments,
            [r.id]: updated
          })

          setNewComment({
            ...newComment,
            [r.id]: ""
          })
        }}
      >
        Dodaj komentarz
      </button>

    </div>
  ))}

</>
)}

  {/* ================= ADMIN ================= */}
  {user?.role === "Admin" && (

    <>
      <h3>Użytkownicy</h3>

      {users.slice(0, visibleUsers).map(u => (
        <div key={u.id}>
          {u.email} ({u.role})

          <select
            value={u.role}
            onChange={async (e)=>{
              await changeRole(u.id, e.target.value)

              const updated = await getUsers()
              setUsers(updated)
            }}
          >
            <option>Citizen</option>
            <option>Clerk</option>
            <option>Admin</option>
          </select>
        </div>
      ))}
      <button onClick={() => 
        setVisibleUsers(visibleUsers === 2 ? users.length : 2)
      }>
        {visibleUsers === 2 ? "Pokaż więcej" : "Pokaż mniej"}
      </button>
      <h3>Wszystkie zgłoszenia (Admin)</h3>

      {reports.map(r => (
        <div key={r.id} style={{
          border:"1px solid #ddd",
          padding:"20px",
          marginBottom:"15px",
          borderRadius:"8px"
        }}>

          <h4>{r.title}</h4>
          <div style={{fontSize:"13px", color:"#666"}}>
            Autor: <b>{r.createdBy}</b>
          </div>
          <div style={{marginBottom:"10px"}}>
            Lokalizacja: <b>{r.location}</b>
          </div>
          <p>{r.description}</p>

          <div>Status: <b>{r.status}</b></div>

          <button onClick={async ()=>{
            await deleteReport(r.id)
            const data = await getAllReports()
            setReports(data)
          }}>
            Usuń
          </button>

          {r.photoUrl && (
            <img
              src={`http://localhost:5231${r.photoUrl}`}
              style={{
                width:"120px",
                height:"90px",
                objectFit:"cover",
                cursor:"pointer"
              }}
              onClick={() => setSelectedImage(`http://localhost:5231${r.photoUrl}`)}
            />
          )}

        </div>
      ))}
    </>
  )}

  {/* ================= MODAL ================= */}
  {selectedImage && (
    <div
      onClick={() => setSelectedImage(null)}
      style={{
        position:"fixed",
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        background:"rgba(0,0,0,0.7)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}
    >
      <img
        src={selectedImage}
        style={{maxWidth:"90%", maxHeight:"90%"}}
        onClick={(e)=>e.stopPropagation()}
      />
    </div>
  )}

</div>
)

}

export default Dashboard