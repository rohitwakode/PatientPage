import { Link } from 'react-router-dom'
import Reveal from './Reveal'

import generalPhysician from '../assets/optimized/general-physician.jpg'
import gynecologist from '../assets/optimized/gynecologist.jpg'
import dermatologist from '../assets/optimized/dermatologist.jpg'
import pediatrician from '../assets/optimized/pediatrician.jpg'
import neurologist from '../assets/optimized/neurologist.jpg'
import gastroenterologist from '../assets/optimized/gastroenterologist.jpg'

const specialities = [
  { name: 'General physician', image: generalPhysician },
  { name: 'Gynecologist', image: gynecologist },
  { name: 'Dermatologist', image: dermatologist },
  { name: 'Pediatricians', image: pediatrician },
  { name: 'Neurologist', image: neurologist },
  { name: 'Gastroenterologist', image: gastroenterologist },
]

const SpecialtyMenu = () => (
  <section className="bg-[#f7f7f7] py-24 max-sm:py-16" id="specialties">
    <div className="mx-auto w-[min(calc(100%-48px),1120px)] max-sm:w-[calc(100%-36px)]">
      <div className="mb-[34px] flex items-end justify-between gap-7 max-sm:mb-[23px] max-sm:flex-col max-sm:items-start max-sm:gap-[17px]">
        <div>
          <p className="text-[11px] font-black uppercase leading-[1.5] tracking-[0.18em] text-[#46a300]">01 / Care index</p>
          <h2 className="mt-[14px] text-[clamp(38px,4.3vw,60px)] font-black leading-[1.02] tracking-[-0.06em] text-[#1f1f1f] max-sm:text-[42px]">
            Explore by<br />
            <span className="text-[#58cc02]">specialty.</span>
          </h2>
        </div>
        <Link to="/doctors" className="inline-flex items-center gap-2.5 border-0 border-b border-[#dfe8d9] bg-transparent pb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#46a300] no-underline transition-all hover:gap-[15px] hover:border-[#58cc02] hover:text-[#1f1f1f]">View the directory <span aria-hidden="true">↗</span></Link>
      </div>

      <div className="grid grid-cols-3 gap-5 max-[840px]:grid-cols-2 max-sm:gap-3">
        {specialities.map((speciality, index) => (
          <Reveal key={speciality.name} delay={index * 0.06}>
            <Link to={`/doctors/${speciality.name}`} className="group block h-full overflow-hidden rounded-[24px] border border-[#dfe8d9] bg-white text-inherit no-underline transition duration-300 hover:-translate-y-1 hover:border-[#58cc02] hover:shadow-[0_18px_42px_rgba(88,204,2,0.12)]">
              <div className="relative h-[clamp(150px,17vw,205px)] overflow-hidden bg-[#f2faf0] max-sm:h-[132px]">
                <img className="h-full w-full object-cover saturate-[0.9] transition duration-500 group-hover:scale-105" src={speciality.image} alt="" loading="lazy" decoding="async" />
                <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-white/80 bg-[#58cc02]/90 text-[9px] font-black text-white backdrop-blur-lg">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="relative min-h-[82px] py-[14px] pl-[15px] pr-[43px] max-sm:min-h-[78px] max-sm:py-3 max-sm:pl-[11px] max-sm:pr-[33px]">
                <span className="text-[8px] font-black tracking-[0.14em] text-[#68737d]">CARE / SPECIALTY</span>
                <h3 className="mt-[7px] text-[15px] font-medium text-[#1f1f1f] max-sm:text-[13px]">{speciality.name}</h3>
                <span className="absolute right-[17px] top-1/2 -translate-y-1/2 text-lg text-[#58cc02] transition group-hover:translate-x-[3px] max-sm:right-[10px]" aria-hidden="true">→</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

export default SpecialtyMenu
