import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'

const Footer = () => (
  <footer className="border-t border-[#d2d2d7] bg-[#f5f5f7]">
    <div className="mx-auto flex w-[min(calc(100%-48px),1120px)] items-center justify-between gap-6 py-12 max-sm:w-[calc(100%-36px)] max-sm:flex-col max-sm:items-start max-sm:py-9">
      <div>
        <Link to="/" aria-label="Asclepius home" className="inline-flex"><BrandMark /></Link>
        <p className="mt-3.5 text-xs leading-[1.8] text-[#4b5563]">Considered care for real life.<br />A better connection starts here.</p>
      </div>
      <nav className="flex flex-wrap gap-6 max-sm:gap-4" aria-label="Footer navigation">
        <Link className="text-[11px] font-black uppercase tracking-[0.12em] text-[#374151] no-underline hover:text-[#1f1f1f]" to="/">Home</Link>
        <Link className="text-[11px] font-black uppercase tracking-[0.12em] text-[#374151] no-underline hover:text-[#1f1f1f]" to="/doctors">Specialists</Link>
        <Link className="text-[11px] font-black uppercase tracking-[0.12em] text-[#374151] no-underline hover:text-[#1f1f1f]" to="/about">About</Link>
        <Link className="text-[11px] font-black uppercase tracking-[0.12em] text-[#374151] no-underline hover:text-[#1f1f1f]" to="/contact">Contact</Link>
      </nav>
      <a className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#374151] no-underline hover:text-[#1f1f1f]" href="#top" onClick={(event) => {
        event.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}>
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </div>
    <div className="mx-auto flex min-h-[50px] w-[min(calc(100%-48px),1120px)] items-center justify-between border-t border-[#e5e7eb] text-[9px] uppercase tracking-[0.12em] text-[#68737d] max-sm:w-[calc(100%-36px)] max-sm:flex-col max-sm:items-start max-sm:justify-center max-sm:gap-2 max-sm:py-3">
      <span>© 2026 ASCLÉPIUS HEALTH</span>
      <span>Care / with clarity</span>
    </div>
  </footer>
)

export default Footer
