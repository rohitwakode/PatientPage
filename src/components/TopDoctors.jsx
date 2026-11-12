import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Reveal from './Reveal'

const TopDoctors = () => {
  const { doctors, token } = useContext(AppContext)
  const navigate = useNavigate()

  if (!token || !doctors || doctors.length === 0) return null

  return (
    <section className="w-full max-w-none bg-[#f7f7f7] px-[max(24px,calc((100vw-1120px)/2))] py-24 max-[1050px]:px-6 max-sm:px-[18px] max-sm:py-16">
      <div className="mx-auto w-[min(100%,1120px)]">
        <div className="mb-[34px] flex items-end justify-between gap-7 max-sm:mb-[23px] max-sm:flex-col max-sm:items-start max-sm:gap-[17px]">
          <div>
            <p className="text-[11px] font-black uppercase leading-[1.5] tracking-[0.18em] text-[#46a300]">02 / Selected practitioners</p>
            <h2 className="mt-[14px] text-[clamp(38px,4.3vw,56px)] font-black leading-[1.08] tracking-[-0.065em] text-[#1f1f1f] max-sm:text-[42px]">
              People behind<br />
              <span className="text-[#58cc02]">your care.</span>
            </h2>
          </div>
          <button onClick={() => navigate('/doctors')} className="inline-flex items-center gap-2.5 border-0 border-b border-[#dfe8d9] bg-transparent pb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#46a300] transition-all hover:gap-[15px] hover:border-[#58cc02] hover:text-[#1f1f1f]">View the directory <span aria-hidden="true">↗</span></button>
        </div>

        <div className="grid grid-cols-4 gap-4 max-[840px]:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-3">
          {doctors.slice(0, 8).map((doctor, index) => (
            <Reveal key={doctor.id} delay={index * 0.06}>
              <button
                type="button"
                onClick={() => navigate(`/appointment/${doctor.id}`)}
                className="group relative min-h-[320px] w-full overflow-hidden rounded-[24px] border border-[#dfe8d9] bg-white text-left text-[#1f1f1f] shadow-[0_18px_42px_rgba(29,155,0,0.08)] transition hover:-translate-y-1 hover:border-[#58cc02] hover:shadow-[0_18px_42px_rgba(88,204,2,0.15)] max-sm:min-h-[320px]"
              >
                {doctor.image && <img className="absolute inset-0 h-full w-full object-cover saturate-[.85] transition duration-700 group-hover:scale-105" src={doctor.image} alt={doctor.name} loading="lazy" decoding="async" />}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,24,0.08),rgba(17,19,24,0.72))]" />
                <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-[7px] p-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#edf8ea]">Profile / {String(index + 1).padStart(2, '0')}</span>
                  <strong className="mt-2 text-xl font-black tracking-[-0.04em] text-white">{doctor.name}</strong>
                  <span className="text-xs text-[#eef6f4]">{doctor.speciality}</span>
                  <i className="mt-2 text-[10px] not-italic font-bold uppercase tracking-[0.12em] text-[#d7f5c8]">{doctor.available ? 'Available' : 'Unavailable'}</i>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopDoctors
