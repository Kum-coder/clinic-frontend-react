import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Appointments.css"
import Dashboard from "./Dashboard"

const API_URL = "http://localhost:8000/api/appointments/"

/* ===============================
   🆕 DOCTOR DIRECTORY (DOMAIN DATA)
   =============================== */
const DOCTORS = {
  "dr. sharma": {
    speciality: "Cardiologist",
    treats: "Heart problems, BP, Chest pain"
  },
  "dr. khan": {
    speciality: "Dermatologist",
    treats: "Skin allergy, Acne, Hair fall"
  },
  "dr. mehta": {
    speciality: "Orthopedic",
    treats: "Bone pain, Fracture, Joint issues"
  }
}

export default function AppointmentList() {

  const [appointments, setAppointments] = useState([])
  const [pendingDelete, setPendingDelete] = useState(null)
  const [undoTimer, setUndoTimer] = useState(null)

  const navigate = useNavigate()

  /* ===============================
     LOAD APPOINTMENTS
     =============================== */
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setAppointments(data))
  }, [])

  /* ===============================
     FORMAT INDIAN DATE
     =============================== */
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

  /* ===============================
     🆕 GET DOCTOR INFO (SAFE MATCH)
     =============================== */
  function getDoctorInfo(name) {
    const key = name?.toLowerCase().trim()

    return DOCTORS[key] || {
      speciality: "General Physician",
      treats: "General health issues"
    }
  }

  /* ===============================
     UPDATE STATUS
     =============================== */
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

  /* ===============================
     DELETE WITH UNDO
     =============================== */
  function deleteAppointment(id) {

    const toDelete = appointments.find(a => a.id === id)

    setAppointments(appointments.filter(a => a.id !== id))
    setPendingDelete(toDelete)

    const timer = setTimeout(() => {
      fetch(`${API_URL}${id}/`, { method: "DELETE" })
      setPendingDelete(null)
    }, 5000)

    setUndoTimer(timer)
  }

  /* ===============================
     UNDO DELETE
     =============================== */
  function undoDelete() {
    clearTimeout(undoTimer)

    if (pendingDelete) {
      setAppointments(prev => [pendingDelete, ...prev])
    }

    setPendingDelete(null)
  }

  return (
    <div className="list-page">

      <Dashboard appointments={appointments} />

      <div className="top-bar">
        <h2>Appointments</h2>
        <button className="add-btn" onClick={() => navigate("/")}>+ New</button>
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

          {/* 🆕 DOCTOR SPECIALITY & TREATMENT */}
          <p className="doctor-info">
            🩺 <b>{getDoctorInfo(app.doctor).speciality}</b><br />
            💊 Treats: {getDoctorInfo(app.doctor).treats}
          </p>

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

      {pendingDelete && (
        <div className="undo-toast">
          Appointment deleted
          <button onClick={undoDelete}>UNDO</button>
        </div>
      )}

    </div>
  )
}
