import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Appointments.css"

const API_URL = "http://localhost:8000/api/appointments/"

export default function AppointmentList() {

  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setAppointments(data))
  }, [])

  function formatIndianDateTime(dateString) {
  const date = new Date(dateString)

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })
}


  function updateStatus(id, status) {
    fetch(`${API_URL}${id}/status/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
    .then(() => {
      setAppointments(
        appointments.map(a =>
          a.id === id ? { ...a, status } : a
        )
      )
    })
  }

  function deleteAppointment(id) {
    fetch(`${API_URL}${id}/`, { method: "DELETE" })
      .then(() => {
        setAppointments(appointments.filter(a => a.id !== id))
      })
  }

  return (
    <div className="list-page">

      <div className="top-bar">
        <h2>Appointments</h2>
        <button onClick={() => navigate("/")}>+ New</button>
      </div>

      {appointments.map(app => (
        <div className={`card ${app.status}`} key={app.id}>

          <div className="card-header">
            <h3>{app.patient}</h3>
            <span className={`badge ${app.status}`}>
              {app.status}
            </span>
          </div>

          <p>👨‍⚕️ {app.doctor}</p>
          <p>📅 {formatIndianDateTime(app.date)}</p>

          <select
            value={app.status}
            onChange={e => updateStatus(app.id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            className="delete"
            onClick={() => deleteAppointment(app.id)}
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  )
}
