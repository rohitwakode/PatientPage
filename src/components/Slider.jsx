import Reveal from './Reveal'

const benefits = [
  {
    number: '01',
    title: 'Find the right fit',
    description: 'Explore a considered directory of experienced medical professionals.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=85',
    tag: 'DISCOVER',
  },
  {
    number: '02',
    title: 'Time, on your terms',
    description: 'Choose a consultation time that makes sense for your life.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=85',
    tag: 'SCHEDULE',
  },
  {
    number: '03',
    title: 'One place to return',
    description: 'Keep your visits and the details that matter close at hand.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=85',
    tag: 'STAY CONNECTED',
  },
]

const Slider = () => (
  <section className="bg-[#f7f7f7] py-24 max-sm:py-16">
    <div className="mx-auto w-[min(calc(100%-48px),1120px)] max-sm:w-[calc(100%-36px)]">
      <div className="mb-[34px] flex items-end justify-between gap-7 max-sm:mb-[23px] max-sm:flex-col max-sm:items-start max-sm:gap-[17px]">
        <div>
          <p className="text-[11px] font-black uppercase leading-[1.5] tracking-[0.18em] text-[#46a300]">03 / A more thoughtful experience</p>
          <h2 className="mt-[14px] text-[clamp(38px,4.3vw,56px)] font-black leading-[1.08] tracking-[-0.065em] text-[#1f1f1f] max-sm:text-[42px]">
            Care that moves<br />
            <span className="text-[#58cc02]">with you.</span>
          </h2>
        </div>
        <p className="mb-[7px] max-w-[260px] text-[13px] leading-[1.8] text-[#4b5563]">From the first search to the follow-up, everything has a place.</p>
      </div>

      <div className="grid grid-cols-3 gap-5 max-[840px]:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-3">
        {benefits.map((benefit) => (
          <Reveal key={benefit.number} delay={Number(benefit.number) * 0.08}>
            <article className="group h-full overflow-hidden rounded-[24px] border border-[#dfe8d9] bg-white transition hover:-translate-y-1 hover:border-[#58cc02] hover:shadow-[0_18px_42px_rgba(88,204,2,0.12)]">
              <div className="relative h-[210px] overflow-hidden max-sm:h-[190px]">
                <img className="h-full w-full object-cover saturate-[.85] transition duration-500 group-hover:scale-105" src={benefit.image} alt="" loading="lazy" />
                <span className="absolute left-[13px] top-[13px] rounded-full bg-[#1f1f1f]/75 px-[9px] py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-lg">{benefit.tag}</span>
                <strong className="absolute right-4 top-[15px] grid h-[29px] w-[29px] place-items-center rounded-full bg-[#58cc02] text-[10px] font-black text-white">{benefit.number}</strong>
              </div>
              <div className="p-[19px]">
                <h3 className="text-lg font-black tracking-[-0.025em] text-[#1f1f1f]">{benefit.title}</h3>
                <p className="mt-2.5 text-xs leading-[1.7] text-[#4b5563]">{benefit.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

export default Slider
