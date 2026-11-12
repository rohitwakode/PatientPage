import { useContext, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AppContext } from '../context/AppContext'
import BrandMark from './BrandMark'

const Navbar = ({ theme, onToggleTheme }) => {
  const { token, setToken, userData, setUserData } = useContext(AppContext)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUserData(false)
    setMenuOpen(false)
    navigate('/login')
  }

  const search = (event) => {
    event.preventDefault()
    const value = query.trim()
    setMenuOpen(false)
    navigate(value ? `/doctors?search=${encodeURIComponent(value)}` : '/doctors')
  }

  const navLinkClass = ({ isActive }) => `w-fit rounded-full px-3 py-2 text-[12px] font-normal tracking-normal no-underline transition-colors ${isActive ? 'bg-[#e8f2fc] text-[#06c]' : 'text-[#6e6e73]'} hover:bg-[#f5f5f7] hover:text-[#1d1d1f]`

  const links = (
    <>
      <NavLink to="/" onClick={() => setMenuOpen(false)} className={navLinkClass}>Home</NavLink>
      <NavLink to="/doctors" onClick={() => setMenuOpen(false)} className={navLinkClass}>Specialists</NavLink>
      <NavLink to="/about" onClick={() => setMenuOpen(false)} className={navLinkClass}>About</NavLink>
      <NavLink to="/contact" onClick={() => setMenuOpen(false)} className={navLinkClass}>Contact</NavLink>
      {token && <NavLink to="/my-appointments" onClick={() => setMenuOpen(false)} className={navLinkClass}>Appointments</NavLink>}
    </>
  )

  const themeToggle = (compact = false) => (
    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={compact
        ? 'grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#dfe8d9] bg-[#f6fbf2] text-[#1f1f1f] transition hover:border-[#58cc02] hover:bg-[#edf9e0]'
        : 'inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-[#dfe8d9] bg-[#f6fbf2] px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1f1f1f] transition hover:border-[#58cc02] hover:bg-[#edf9e0]'}
    >
      {theme === 'dark' ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={compact ? 'h-[18px] w-[18px]' : 'h-4 w-4'}>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={compact ? 'h-[18px] w-[18px]' : 'h-4 w-4'}>
          <path d="M20.2 15.4A8.6 8.6 0 0 1 8.6 3.8 8.7 8.7 0 1 0 20.2 15.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {!compact && <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>}
    </button>
  )

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-[#d2d2d7] bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[60px] w-[min(calc(100%-48px),1024px)] items-center justify-between gap-7 max-[1050px]:gap-[18px] max-[900px]:min-h-[60px] max-[900px]:w-[calc(100%-48px)] max-sm:min-h-[56px] max-sm:w-[calc(100%-36px)]" aria-label="Main navigation">
        <NavLink to="/" aria-label="Asclepius home" className="shrink-0 rounded-full outline-offset-4 focus-visible:outline-[#58cc02]" onClick={() => setMenuOpen(false)}>
          <BrandMark />
        </NavLink>

        <div className="flex items-center gap-[clamp(18px,2.2vw,36px)] max-[1050px]:gap-[14px] max-[900px]:hidden">{links}</div>

        <div className="flex items-center gap-[18px] max-[1050px]:gap-2.5 max-[900px]:hidden">
          <form onSubmit={search} className="flex items-center rounded-full border border-[#dfe8d9] bg-white px-3 py-2 text-[11px] text-[#4b5563] transition focus-within:border-[#58cc02] focus-within:shadow-[0_0_0_4px_rgba(88,204,2,0.12)]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a specialist"
              aria-label="Search doctors"
              className="w-[150px] bg-transparent py-0.5 text-[11px] text-[#1f1f1f] outline-none placeholder:text-[#7c8a97] max-[1050px]:w-[120px]"
            />
            <button type="submit" aria-label="Search doctors" className="ml-2 grid h-7 w-7 place-items-center rounded-full bg-[#eafad7] text-[#46a300] transition hover:bg-[#d7f5c8]">↗</button>
          </form>

          {themeToggle()}

          {token ? (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/my-profile')} className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap bg-transparent text-[11px] font-bold uppercase tracking-[0.12em] text-[#374151] transition hover:text-[#1f1f1f]">
                {userData?.name || 'Profile'}
              </button>
              <button onClick={logout} className="inline-flex min-h-[39px] shrink-0 items-center rounded-full bg-[#58cc02] px-3.5 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#46a300]">Sign out</button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="inline-flex min-h-[39px] shrink-0 items-center gap-2 rounded-full bg-[#58cc02] px-3.5 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#46a300]">Patient sign in <span aria-hidden="true">↗</span></button>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-[#dfe8d9] bg-[#f6fbf2] text-xl text-[#1f1f1f] transition hover:border-[#58cc02] max-[900px]:grid"
        >
          <span>{menuOpen ? '×' : '☰'}</span>
        </button>
      </nav>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-[#1f1f1f]/20 backdrop-blur-[2px] min-[901px]:hidden max-sm:top-[60px]"
        />
      )}
      <div id="mobile-navigation" hidden={!menuOpen} className="relative z-50 border-t border-[#e5e7eb] bg-[#f7f7f7] px-5 pb-[22px] pt-[18px] shadow-lg min-[901px]:hidden">
        <div className="flex flex-col gap-2 [&>a]:w-full [&>a]:rounded-full [&>a]:px-3 [&>a]:py-2.5 [&>a]:text-[12px] [&>a]:font-bold [&>a]:uppercase [&>a]:tracking-[0.12em] [&>a]:text-[#374151] [&>a]:transition-colors [&>a:after]:hidden [&>a[aria-current=page]]:bg-[#eafad7] [&>a[aria-current=page]]:text-[#1f1f1f]">
          {links}
        </div>
        <div className="mt-4 flex items-center gap-2.5 pb-1">
          {themeToggle(true)}
          <form onSubmit={search} className="flex flex-1 items-center rounded-full border border-[#dfe8d9] bg-white px-3 py-2.5 text-[12px] text-[#1f1f1f]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a specialist"
              aria-label="Search doctors"
              className="w-full bg-transparent text-[12px] text-[#1f1f1f] outline-none placeholder:text-[#7c8a97]"
            />
            <button type="submit" className="ml-2 grid h-7 w-7 place-items-center rounded-full bg-[#eafad7] text-[#46a300]">↗</button>
          </form>
        </div>
        {token ? (
          <div className="mt-4 space-y-2.5">
            <button onClick={() => navigate('/my-profile')} className="w-full rounded-full bg-[#eafad7] px-3 py-2.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#1f1f1f]">My profile</button>
            <button onClick={logout} className="w-full rounded-full bg-[#58cc02] px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-white">Sign out</button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="mt-4 w-full rounded-full bg-[#58cc02] px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-white">Patient sign in</button>
        )}
      </div>
    </header>
  )
}

Navbar.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}

export default Navbar
