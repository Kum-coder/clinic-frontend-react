export default function Dashboard({ appointments }) {

  const total = appointments.length
 const pending = appointments.filter(
  a => a.status?.toLowerCase() === "pending"
).length

const confirmed = appointments.filter(
  a => a.status?.toLowerCase() === "confirmed"
).length

const cancelled = appointments.filter(
  a => a.status?.toLowerCase() === "cancelled"
).length


  const today = new Date().toDateString()
  const todayCount = appointments.filter(a =>
    new Date(a.date).toDateString() === today
  ).length

  return (
    <div className="dashboard">

      <div className="card blue">
        <h3>Total</h3>
        <p>{total}</p>
      </div>

      <div className="card yellow">
        <h3>Pending</h3>
        <p>{pending}</p>
      </div>

      <div className="card green">
        <h3>Confirmed</h3>
        <p>{confirmed}</p>
      </div>

      <div className="card red">
        <h3>Cancelled</h3>
        <p>{cancelled}</p>
      </div>

      <div className="card purple">
        <h3>Today</h3>
        <p>{todayCount}</p>
      </div>

    </div>
  )
}
