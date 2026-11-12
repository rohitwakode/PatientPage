import { useNavigate } from 'react-router-dom'
import heroImage from '../assets/optimized/heroSectionImage.jpg'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="overflow-hidden bg-[#f5f5f7] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid w-[min(100%,1120px)] items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div className="relative z-10 text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#d2d2d7] bg-white px-3.5 py-2 text-[12px] font-medium text-[#06c] shadow-[0_3px_0_#d2d2d7]">
            <span aria-hidden="true">✦</span> Your care journey starts here
          </p>
          <h1 className="mx-auto mt-5 max-w-[650px] text-[clamp(46px,6.6vw,78px)] font-semibold leading-[0.98] tracking-[-0.075em] text-[#1d1d1f] lg:mx-0">
            Small steps.
            <br />
            <span className="text-[#06c]">Better health.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[480px] text-[17px] leading-[1.65] text-[#6e6e73] lg:mx-0">
            Finding the right doctor doesn’t have to feel hard. We’ll help you take it one step at a time.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="duo-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#06c] px-6 text-[15px] font-medium text-white hover:bg-[#0077ed]"
            >
              Start your journey <span aria-hidden="true">→</span>
            </button>
            <span className="text-[13px] text-[#6e6e73]">It only takes a moment</span>
          </div>
          <div className="mt-9 flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex items-center -space-x-2" aria-hidden="true">
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#f5f5f7] bg-white text-lg text-[#06c]">✚</span>
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#f5f5f7] bg-[#e8f2fc] text-lg">♡</span>
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#f5f5f7] bg-white text-lg">✦</span>
            </div>
            <p className="text-left text-[12px] leading-5 text-[#6e6e73]">
              A little support goes a long way
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[490px] lg:justify-self-end">
          <div className="absolute -right-2 top-7 z-10 rounded-2xl border border-[#d2d2d7] bg-white px-4 py-3 shadow-[0_4px_0_#d2d2d7] duo-float sm:-right-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6e6e73]">Your next step</p>
            <p className="mt-1 text-[14px] font-medium text-[#1d1d1f]">Find your specialist <span className="text-[#06c]">✦</span></p>
          </div>
          <div className="relative overflow-hidden rounded-[34px] border-[5px] border-white bg-[#e8f2fc] shadow-[0_5px_0_#d2d2d7]">
            <img
              className="h-[clamp(300px,42vw,480px)] w-full object-cover object-[center_38%]"
              src={heroImage}
              alt="A doctor ready to help you take the next step in your care"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f]/55 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-left text-white sm:p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/75">A friendly place to begin</p>
              <p className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">You’ve got this.</p>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-2 grid h-[66px] w-[66px] place-items-center rounded-full border-[5px] border-white bg-[#06c] text-2xl text-white shadow-[0_4px_0_#005bb5] duo-float sm:-left-6">
            <span aria-hidden="true">✓</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
