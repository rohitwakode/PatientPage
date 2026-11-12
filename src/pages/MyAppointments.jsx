import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { notify } from '../components/notificationService'
import { AppContext } from '../context/AppContext'
import { getApiErrorMessage } from '../context/apiErrors'

const formatDate = (date) => {
  if (!date) return ''
  const parsedDate = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [expandedPrescriptionId, setExpandedPrescriptionId] = useState(null)
  const navigate = useNavigate()

  const getUserAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/patient/myAppointments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!Array.isArray(data)) throw new Error('Appointments API returned an unexpected response')
      setAppointments(data)
    } catch (error) {
      notify.error(getApiErrorMessage(error))
    }
  }, [backendUrl, token])

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`${backendUrl}/patient/cancel/${appointmentId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      })
      notify.success('Appointment cancelled')
      await getUserAppointments()
    } catch (error) {
      notify.error(getApiErrorMessage(error))
    }
  }

  useEffect(() => {
    if (token) getUserAppointments()
  }, [getUserAppointments, token])

  if (!token) {
    return (
      <main className="page-container text-[#1f1f1f]">
        <h1 className="text-4xl font-black tracking-tight">Your appointments</h1>
        <p className="mt-3 text-[#4b5563]">Sign in to see and manage your appointments.</p>
        <button onClick={() => navigate('/login')} className="mt-5 rounded-md bg-[#46a300] px-5 py-3 font-semibold text-white hover:bg-[#4b5563]">Sign in</button>
      </main>
    )
  }

  return (
    <main className="page-container text-[#1f1f1f]">
      <header className="mb-9">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#46a300]">Your account</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Your appointments</h1>
        <p className="mt-3 text-[#4b5563]">Review upcoming visits and manage your bookings.</p>
      </header>

      {appointments.length === 0 ? (
        <section className="rounded-2xl border border-[#dfe8d9] bg-gradient-to-br from-white to-[#f5faf3] p-8">
          <h2 className="text-xl font-semibold">No appointments yet</h2>
          <p className="mt-2 text-[#4b5563]">Browse doctors to find a specialist and book your first appointment.</p>
          <button onClick={() => navigate('/doctors')} className="mt-5 rounded-md bg-[#46a300] px-5 py-3 font-semibold text-white hover:bg-[#4b5563]">Browse doctors</button>
        </section>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {appointments.map((appointment) => {
            const doctor = appointment.docData
            const address = doctor?.address ?? {}
            const appointmentId = appointment.id
            const status = appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Upcoming'
            const prescription = appointment.prescription
            const prescriptionDetails = [
              ['Diagnosis', prescription?.diagnosis],
              ['Symptoms', prescription?.symptoms],
              ['Clinical notes', prescription?.clinicalNotes],
              ['Blood pressure', prescription?.bloodPressure],
              ['Temperature', prescription?.temperature],
              ['Medicine', prescription?.medicine],
              ['Advice', prescription?.advice],
            ].filter(([, value]) => typeof value === 'string' && value.trim())

            return (
              <article key={appointmentId} className="rounded-2xl border border-[#dfe8d9] bg-gradient-to-br from-white to-[#f5faf3] p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#46a300]">{doctor?.speciality || 'Consultation'}</p>
                    <h2 className="mt-3 text-2xl font-bold">{doctor?.docName || 'Doctor'}</h2>
                  </div>
                  <span className={`shrink-0 rounded px-3 py-1 text-xs font-semibold ${appointment.cancelled ? 'bg-slate-100 text-slate-600' : appointment.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-[#f5faf3] text-[#46a300]'}`}>
                    {status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 border-t border-[#dfe8d9] pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#6b7280]">Date and time</p>
                      <p className="mt-2 text-sm text-[#374151]">{formatDate(appointment.slotDate)} at {appointment.slotTime?.slice(0, 5)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#6b7280]">Location</p>
                    <p className="mt-2 text-sm text-[#374151]">
                      {[address.address, address.city, address.state, address.pincode, address.country].filter(Boolean).join(', ') || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#6b7280]">Consultation fee</p>
                    <p className="mt-2 text-sm text-[#374151]">{appointment.fees == null ? 'Not listed' : `₹${appointment.fees}`}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#6b7280]">Payment</p>
                    <p className="mt-2 text-sm text-[#374151]">
                      {appointment.payment == null ? 'Not recorded' : appointment.payment ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                </div>

                <section className="mt-5 border-t border-[#dfe8d9] pt-5">
                  <button
                    type="button"
                    aria-expanded={expandedPrescriptionId === appointmentId}
                    aria-controls={`prescription-${appointmentId}`}
                    onClick={() => setExpandedPrescriptionId(
                      expandedPrescriptionId === appointmentId ? null : appointmentId
                    )}
                    className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#46a300]"
                  >
                    <span>{expandedPrescriptionId === appointmentId ? 'Hide prescription' : 'View prescription'}</span>
                    <span aria-hidden="true">{expandedPrescriptionId === appointmentId ? '−' : '+'}</span>
                  </button>
                  {expandedPrescriptionId === appointmentId && (
                    <div id={`prescription-${appointmentId}`} className="mt-4 rounded-2xl border border-[#dfe8d9] bg-[#f7fbf5] p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#46a300]">Visit summary</p>
                          <h4 className="mt-1 text-lg font-bold text-[#1f1f1f]">Prescription details</h4>
                        </div>
                        {appointment.isCompleted && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Visit completed
                          </span>
                        )}
                      </div>
                      {prescriptionDetails.length > 0 ? (
                        <dl className="grid gap-3 sm:grid-cols-2">
                          {prescriptionDetails.map(([label, value]) => (
                            <div
                              key={label}
                              className={`rounded-xl border border-[#e7eee2] bg-white p-3.5 ${
                                label === 'Diagnosis' || label === 'Medicine' || label === 'Advice'
                                  ? 'sm:col-span-2'
                                  : ''
                              }`}
                            >
                              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#46a300]" aria-hidden="true" />
                                {label}
                              </dt>
                              <dd className={`mt-2 whitespace-pre-line leading-relaxed ${
                                label === 'Diagnosis'
                                  ? 'text-base font-semibold text-[#1f1f1f]'
                                  : 'text-sm text-[#374151]'
                              }`}>
                                {value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="rounded-xl border border-dashed border-[#d6e2cf] bg-white px-4 py-5 text-sm text-[#6b7280]">
                          No prescription details have been added for this visit yet.
                        </p>
                      )}
                    </div>
                  )}
                </section>

                {!appointment.cancelled && !appointment.isCompleted && (
                  <button onClick={() => cancelAppointment(appointmentId)} className="mt-6 rounded-xl border border-[#dfe8d9] px-4 py-2.5 text-sm font-semibold text-[#46a300] transition hover:border-[#46a300] hover:bg-[#f5faf3]">
                    Cancel appointment
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default MyAppointments
