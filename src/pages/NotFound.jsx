import { Link } from 'react-router-dom'

const NotFound = () => (
  <main className="mx-auto flex min-h-[65vh] w-[min(calc(100%-48px),760px)] flex-col items-start justify-center py-16 max-sm:w-[calc(100%-36px)]">
    <p className="text-[11px] font-black uppercase tracking-[0.075em] text-[#46a300]">404 / PAGE NOT FOUND</p>
    <h1 className="mt-5 text-[clamp(48px,8vw,82px)] font-black leading-[0.98] tracking-[-0.075em] text-[#1f1f1f]">This page took<br />a wrong turn.</h1>
    <p className="mt-[19px] max-w-[440px] text-[15px] leading-[1.7] text-[#4b5563]">The page you’re looking for may have moved or no longer exists.</p>
    <Link to="/" className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#58cc02] px-4 py-3 text-[13px] font-black uppercase tracking-[0.08em] text-white no-underline transition hover:-translate-y-0.5 hover:bg-[#46a300]">Back to home <span aria-hidden="true">→</span></Link>
  </main>
)

export default NotFound
