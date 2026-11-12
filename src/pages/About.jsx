const About = () => (
  <main className="page-container text-[#1f1f1f]">
    <header className="max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#46a300]">About Asclepius</p>
      <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-[-0.06em] md:text-7xl">Healthcare, without the runaround.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4b5563]">
        We make it easier to find a specialist and take the next step toward better care. Explore doctors, book an appointment, and keep your visits organized in one place.
      </p>
    </header>

    <section className="mt-10 grid gap-5 md:grid-cols-3">
      {[
        ['Discover', 'Browse specialists and find a provider who fits your needs.'],
        ['Schedule', 'Choose an appointment time and book securely online.'],
        ['Stay organized', 'Review and manage appointments from your profile.']
      ].map(([title, description], index) => (
        <article key={title} className="group min-h-56 rounded-[28px] border border-[#dfe8d9] bg-gradient-to-br from-white to-[#f5faf3] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#58cc02] hover:shadow-[0_18px_38px_rgba(88,204,2,0.12)]">
          <p className="text-xs font-black tracking-[0.3em] text-[#46a300]">0{index + 1}</p>
          <h2 className="mt-10 text-2xl font-black transition group-hover:text-[#46a300]">{title}</h2>
          <p className="mt-3 leading-7 text-[#4b5563]">{description}</p>
        </article>
      ))}
    </section>
  </main>
)

export default About
