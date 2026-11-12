import { useNavigate } from 'react-router-dom'

import Hero from '../components/Hero'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Slider from '../components/Slider'
import Banner from '../components/Banner'

const Home = () => {
  const navigate = useNavigate()

  return (
    <main className="w-full overflow-hidden bg-white">

      {/* Hero Section */}
      <Hero />

      {/* Care Process Strip */}
      <section
        id="care-index"
        aria-label="Our care process"
        className="relative z-10 bg-white px-5 py-14 sm:px-8 sm:py-16"
      >
        <div className="mx-auto w-[min(100%,920px)]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#06c]">Your care path</p>
              <h2 className="mt-2 text-[32px] font-medium tracking-[-0.05em] text-[#1d1d1f] sm:text-[40px]">Three little steps</h2>
            </div>
            <span className="rounded-full bg-[#f5f5f7] px-4 py-2 text-[12px] font-medium text-[#6e6e73]">Easy does it <span aria-hidden="true">✦</span></span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Meet your match', 'Explore doctors who understand what you need.', '⌕'],
              ['02', 'Pick your time', 'Choose an appointment that fits your day.', '◷'],
              ['03', 'Feel good about it', 'Keep your care details together in one place.', '♡'],
            ].map(([number, title, description, icon], index) => (
              <article key={number} className="group relative rounded-[24px] border border-[#d2d2d7] bg-[#f5f5f7] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_4px_0_#d2d2d7]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[21px] text-[#06c] shadow-[0_3px_0_#d2d2d7]">{icon}</span>
                  <span className="text-[11px] font-medium tracking-[0.08em] text-[#6e6e73]">STEP {number}</span>
                </div>
                <h3 className="mt-5 text-[18px] font-medium text-[#1d1d1f]">{title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#6e6e73]">{description}</p>
                {index < 2 && <span className="absolute -right-[17px] top-10 z-10 hidden text-xl text-[#06c] md:block" aria-hidden="true">›</span>}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Specialities */}
      <section
        aria-label="Explore medical specialities"
        className="relative"
      >
        <SpecialityMenu />
      </section>

      {/* Top Doctors */}
      <section
        aria-label="Featured doctors"
        className="relative"
      >
        <TopDoctors />
      </section>

      {/* Promotional Slider */}
      <section
        aria-label="Healthcare highlights"
        className="relative"
      >
        <Slider />
      </section>

      {/* Call to Action Banner */}
      <section aria-label="Get started with healthcare">
        <Banner />
      </section>

      {/* Final Call To Action */}
      <section className="relative isolate overflow-hidden px-6 pb-[100px] pt-16 text-center max-sm:px-5 max-sm:pb-20 max-sm:pt-12">

        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[min(75vw,650px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(121_188_178_/_15%),transparent_70%)] blur-2xl"
        />

        <div className="relative mx-auto max-w-[760px]">

          <p className="text-[11px] font-black uppercase tracking-[0.075em] text-[#46a300]">
            Your next step starts here
          </p>

          <h2 className="mt-[18px] text-[clamp(42px,6vw,78px)] font-semibold leading-[1.03] tracking-[-0.065em] text-[#1d1d1f] max-sm:text-[40px]">
            Make room for
            <br />
            <span className="text-[#06c]">feeling better.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-[420px] text-[15px] leading-[1.7] text-[#4b5563] max-sm:text-sm">
            Better healthcare starts with finding the right person.
            Discover specialists and take the next step with confidence.
          </p>

          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="duo-button mt-[30px] inline-flex min-h-[46px] items-center justify-center gap-4 rounded-full bg-[#06c] px-6 text-[13px] font-black uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0077ed] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06c]"
          >
            Explore the directory
            <span aria-hidden="true">↗</span>
          </button>

        </div>
      </section>

    </main>
  )
}

export default Home
