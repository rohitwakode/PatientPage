import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <section className="relative mx-auto mb-20 flex min-h-[390px] w-[min(calc(100%-48px),1120px)] items-center overflow-hidden rounded-[30px] border border-[#dfe8d9] bg-[radial-gradient(circle_at_80%_20%,rgba(88,204,2,0.18),transparent_30%),linear-gradient(135deg,#edf9e6,#f7f7f7_55%,#f0f9eb)] max-sm:mb-14 max-sm:min-h-[360px] max-sm:w-[calc(100%-36px)]">
      <div className="absolute inset-y-0 right-[8%] flex w-[37%] flex-col justify-between border-x border-[#dfe8d9] p-[22px] text-[9px] font-black tracking-[0.2em] text-[#4b5563] before:absolute before:left-1/2 before:top-1/2 before:aspect-square before:w-[80%] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[-20deg] before:scale-y-[.45] before:rounded-full before:border before:border-[#58cc02]/25 before:content-[''] after:absolute after:left-1/2 after:top-1/2 after:aspect-square after:w-[58%] after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-[50deg] after:scale-y-[.55] after:rounded-full after:border after:border-[#58cc02]/25 after:content-[''] max-sm:right-[2%] max-sm:w-[57%] max-sm:opacity-50" aria-hidden="true">
        <span>ASCLÉPIUS</span>
        <span>HEALTH / 001</span>
      </div>
      <div className="relative z-10 mx-auto w-[min(100%-64px,1160px)] max-sm:w-[calc(100%-40px)]">
        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#46a300]">A good place to begin</p>
        <h2 className="mt-[18px] text-[clamp(37px,4.4vw,57px)] font-black leading-[1.03] tracking-[-0.065em] text-[#1f1f1f] max-sm:text-[40px]">Make your health<br />part of the picture.</h2>
        <p className="mt-[17px] text-sm text-[#4b5563]">Find a specialist who sees the whole you.</p>
        <button type="button" onClick={() => navigate('/doctors')} className="mt-[27px] inline-flex min-h-[46px] items-center gap-4 rounded-full bg-[#58cc02] px-[17px] text-[12px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#46a300]">
          Browse specialists <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="absolute right-5 text-[8px] font-black uppercase tracking-[0.16em] text-[#54616f] [writing-mode:vertical-rl] max-sm:right-[7px]">Your health / your pace</div>
    </section>
  )
}

export default Banner
