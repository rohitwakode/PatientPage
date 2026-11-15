import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { notify } from '../components/notificationService'
import { AppContext } from '../context/AppContext'
import { getApiErrorMessage } from '../context/apiErrors'

const MyProfile = () => {
  const { token, setToken, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()

  const updateUserProfileData = async () => {
    try {
      await axios.put(`${backendUrl}/patient/update`, {
        user: {
          name: userData.name,
          email: userData.email,
          image: userData.image,
          phone: userData.phone,
          gender: userData.gender ? userData.gender.toUpperCase() : null,
          dateOfBirth: userData.dob ? `${userData.dob}T00:00:00` : null
        },
        addReq: {
          address: userData.address.line1 ?? '',
          city: userData.address.city ?? '',
          state: userData.address.state ?? '',
          pincode: userData.address.pincode ?? '',
          country: userData.address.country ?? '',
          latitude: userData.address.latitude ?? null,
          longitude: userData.address.longitude ?? null
        }
      }, { headers: { Authorization: `Bearer ${token}` } })
      await loadUserProfileData()
      setIsEdit(false)
      notify.success('Profile updated')
    } catch (error) {
      notify.error(getApiErrorMessage(error))
    }
  }

  const deletePatientAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account?')) return
    try {
      await axios.delete(`${backendUrl}/patient/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      localStorage.removeItem('token')
      setToken('')
      setUserData(false)
      notify.success('Account deleted')
      navigate('/login')
    } catch (error) {
      notify.error(getApiErrorMessage(error))
    }
  }

  const updateField = (field, value) => {
    setUserData((current) => ({ ...current, [field]: value }))
  }

  const updateAddress = (field, value) => {
    setUserData((current) => ({
      ...current,
      address: { ...current.address, [field]: value }
    }))
  }

  if (!userData) {
    return (
      <main className="page-container text-[#1f1f1f]">
        <p className="text-[#4b5563]">Sign in to view your profile.</p>
        <button onClick={() => navigate('/login')} className="mt-5 rounded-md bg-[#46a300] px-5 py-3 font-semibold text-white hover:bg-[#4b5563]">Sign in</button>
      </main>
    )
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-[#dfe8d9] bg-white px-4 py-3 text-[#1f1f1f] outline-none transition focus:border-[#46a300] disabled:border-[#dfe8d9] disabled:bg-[#f5faf3] disabled:text-[#6b7280]'
  const fields = [
    ['line1', 'Street address'],
    ['city', 'City'],
    ['state', 'State'],
    ['pincode', 'Postal code'],
    ['country', 'Country']
  ]

  return (
    <main className="page-container text-[#1f1f1f]">
      <header className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div className="flex items-center gap-5">
          {userData.image && (
            <img
              src={userData.image}
              alt={`${userData.name}'s profile`}
              className="h-20 w-20 rounded-full border border-[#dfe8d9] object-cover"
            />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#46a300]">Your account</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{userData.name}</h1>
            <p className="mt-2 text-[#4b5563]">{userData.email}</p>
          </div>
        </div>
        {!isEdit && <button onClick={() => setIsEdit(true)} className="rounded-xl border border-[#dfe8d9] bg-[#f5faf3] px-5 py-3 font-semibold transition hover:border-[#dfe8d9] hover:bg-[#f5faf3]">Edit profile</button>}
      </header>

      <section className="max-w-4xl rounded-2xl border border-[#dfe8d9] bg-gradient-to-br from-white to-[#f5faf3] p-6 md:p-8">
        <h2 className="mb-6 text-xl font-bold">Personal details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm text-[#4b5563]">Full name
            <input disabled={!isEdit} value={userData.name ?? ''} onChange={(event) => updateField('name', event.target.value)} className={inputClass} />
          </label>
          <label className="text-sm text-[#4b5563]">Phone
            <input disabled={!isEdit} value={userData.phone ?? ''} onChange={(event) => updateField('phone', event.target.value)} className={inputClass} />
          </label>
          <label className="text-sm text-[#4b5563]">Gender
            <select disabled={!isEdit} value={userData.gender ?? ''} onChange={(event) => updateField('gender', event.target.value)} className={inputClass}>
              <option value="">Not selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label className="text-sm text-[#4b5563]">Date of birth
            <input type="date" disabled={!isEdit} value={userData.dob ?? ''} onChange={(event) => updateField('dob', event.target.value)} className={inputClass} />
          </label>
        </div>

        <h2 className="mb-5 mt-9 border-t border-[#dfe8d9] pt-7 text-xl font-bold">Address</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(([field, label]) => (
            <label key={field} className="text-sm text-[#4b5563]">{label}
              <input disabled={!isEdit} value={userData.address?.[field] ?? ''} onChange={(event) => updateAddress(field, event.target.value)} className={inputClass} />
            </label>
          ))}
        </div>

        {isEdit && (
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={updateUserProfileData} className="rounded-md bg-[#46a300] px-5 py-3 font-semibold text-white hover:bg-[#4b5563]">Save changes</button>
            <button onClick={() => { setIsEdit(false); loadUserProfileData() }} className="rounded-xl border border-[#dfe8d9] bg-[#f5faf3] px-5 py-3 font-semibold hover:bg-[#f5faf3]">Discard</button>
          </div>
        )}
      </section>

      <section className="mt-8 flex max-w-4xl flex-wrap items-center justify-between gap-4 border-t border-[#dfe8d9] pt-6">
        <div>
          <h2 className="font-semibold text-[#1f1f1f]">Delete account</h2>
          <p className="mt-1 text-sm text-[#6b7280]">Permanently remove your patient account.</p>
        </div>
        <button onClick={deletePatientAccount} className="rounded-xl border border-red-800/70 px-4 py-2.5 text-sm text-red-300 transition hover:border-red-500 hover:bg-red-950/60">Delete account</button>
      </section>
    </main>
  )
}

export default MyProfile
