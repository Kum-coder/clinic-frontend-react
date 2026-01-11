import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import "./App.css"
import AppointmentList from "./AppointmentList"

const API_URL = "http://localhost:8000/api/appointments/"

function Home() {

  const [patient, setPatient] = useState("")
  const [doctor, setDoctor] = useState("")
  const [date, setDate] = useState("")
  const navigate = useNavigate()

  function bookAppointment() {
     
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient,
        doctor,
        date,
        status: "pending"
      })
    })
    .then(() => navigate("/appointments"))
  }

  return (
    <div className="container">
      <h2>Clinic Appointment App</h2>

      <input
        placeholder="Patient Name"
        value={patient}
        onChange={e => setPatient(e.target.value)}
      />

      <select value={doctor} onChange={e => setDoctor(e.target.value)}>
        <option value="">Select Doctor</option>
        <option>Dr. Sharma</option>
        <option>Dr. Khan</option>
        <option>Dr. Mehta</option>
      </select>

      <input
        type="datetime-local"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <button onClick={bookAppointment}>
        Book Appointment
      </button>

      <button
        className="secondary-btn"
        onClick={() => navigate("/appointments")}
      >
        View Appointments →
      </button>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/appointments" element={<AppointmentList />} />
    </Routes>
  )
}
