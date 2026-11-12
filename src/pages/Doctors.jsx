import { useContext, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const [searchParams] = useSearchParams()
  const [query] = [searchParams.get('search') || '']
  const navigate = useNavigate()
  const { doctors, token } = useContext(AppContext)

  const filteredDoctors = useMemo(() => {
    const search = query.toLowerCase()
    return doctors.filter((doctor) => {
      const matchesSpeciality = !speciality || doctor.speciality?.toLowerCase() === speciality.toLowerCase()
      const matchesQuery = !search || `${doctor.name} ${doctor.speciality}`.toLowerCase().includes(search)
      return matchesSpeciality && matchesQuery
    })
  }, [doctors, speciality, query])

  return (
    <main className="page-container">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#46a300]">The Asclepius directory</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#1f1f1f] md:text-6xl">
          {speciality || (query ? `Results for “${query}”` : 'Find your doctor')}
        </h1>
        <p className="mt-4 text-base leading-7 text-[#4b5563]">Explore experienced specialists and choose the care that fits your needs.</p>
      </header>

      {!token ? (
        <section className="rounded-[28px] border border-[#dfe8d9] bg-gradient-to-br from-[#f8fcf5] to-white p-8 md:p-10 shadow-[0_18px_38px_rgba(88,204,2,0.08)]">
          <h2 className="text-2xl font-black text-[#1f1f1f]">Sign in to browse doctors</h2>
          <p className="mt-2 text-sm text-[#4b5563]">Your account is required to view the doctor directory.</p>
          <button onClick={() => navigate('/login')} className="mt-6 rounded-full bg-[#58cc02] px-5 py-3 font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#46a300]">Sign in</button>
        </section>
      ) : filteredDoctors.length === 0 ? (
        <p className="rounded-[24px] border border-[#dfe8d9] bg-[#f4faf1] p-8 text-[#374151]">No doctors match this search.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDoctors.map((doctor, index) => (
            <button
              type="button"
              key={doctor.id}
              onClick={() => navigate(`/appointment/${doctor.id}`)}
              className="group relative isolate min-h-80 overflow-hidden rounded-[24px] border border-[#dfe8d9] bg-[#f6faf5] text-left transition duration-300 hover:-translate-y-1 hover:border-[#58cc02] hover:shadow-[0_18px_38px_rgba(88,204,2,0.12)]"
            >
              {doctor.image && <img src={doctor.image} alt={doctor.name} className="absolute inset-0 z-0 block h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" />}
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(27,31,35,0.85),rgba(27,31,35,0.18))]" />
              <div className="absolute inset-x-0 bottom-0 z-[2] p-5 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">Specialist {String(index + 1).padStart(2, '0')}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${doctor.available ? 'bg-[#58cc02] text-white' : 'bg-slate-700 text-gray-300'}`}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-black text-white group-hover:text-gray-200">{doctor.name}</h2>
                <p className="mt-2 text-sm text-gray-200">{doctor.speciality}</p>
                <p className="mt-5 text-xs text-gray-300">{doctor.experience || 'Experienced medical professional'}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  )
}

export default Doctors
