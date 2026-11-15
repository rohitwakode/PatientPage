import { useContext, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AppContext } from '../context/AppContext'
import BrandMark from './BrandMark'

const Navbar = ({ theme, onToggleTheme }) => {
  const { token, setToken, userData, setUserData } = useContext(AppContext)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    setProfileMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setProfileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const search = (event) => {
    event.preventDefault()
    const value = query.trim()
    setMenuOpen(false)
    navigate(value ? `/doctors?search=${encodeURIComponent(value)}` : '/doctors')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUserData(false)
    setProfileMenuOpen(false)
    setMenuOpen(false)
    navigate('/login')
  }

  const navLinkClass = ({ isActive }) => `w-fit rounded-full px-3.5 py-2 text-[12px] font-medium tracking-normal no-underline transition-colors ${isActive ? 'bg-[#e8f2fc] text-[#06c]' : 'text-[#6e6e73]'} hover:bg-[#f5f5f7] hover:text-[#1d1d1f]`

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
        : 'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#dfe8d9] bg-[#f6fbf2] text-[#1f1f1f] transition hover:border-[#58cc02] hover:bg-[#edf9e0]'}
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
    </button>
  )

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-[#d2d2d7] bg-white/90 shadow-[0_1px_8px_rgba(29,29,31,0.04)] backdrop-blur-xl">
      <nav className="mx-auto grid min-h-[72px] w-[min(calc(100%-48px),1200px)] grid-cols-[auto_1fr_auto] items-center gap-6 max-[1024px]:flex max-[1024px]:min-h-[64px] max-[1024px]:justify-between max-sm:min-h-[58px] max-sm:w-[calc(100%-32px)]" aria-label="Main navigation">
        <NavLink to="/" aria-label="Asclepius home" className="shrink-0 rounded-lg outline-offset-4 focus-visible:outline-[#58cc02]" onClick={() => setMenuOpen(false)}>
          <BrandMark />
        </NavLink>

        <div className="flex items-center justify-center gap-1 max-[1024px]:hidden">{links}</div>

        <div className="flex items-center justify-self-end gap-3 max-[1024px]:hidden">
          <form onSubmit={search} className="flex h-9 w-[190px] items-center rounded-full border border-[#dfe8d9] bg-[#f5f5f7] px-3 text-[12px] text-[#4b5563] transition focus-within:border-[#58cc02] focus-within:shadow-[0_0_0_4px_rgba(88,204,2,0.12)]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-[#6e6e73]">
              <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.7" />
              <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a specialist"
              aria-label="Search doctors"
              className="min-w-0 flex-1 bg-transparent px-2 py-1 text-[12px] text-[#1f1f1f] outline-none placeholder:text-[#7c8a97]"
            />
            <button type="submit" aria-label="Search doctors" className="sr-only">Search</button>
          </form>

          {themeToggle(false)}

          {token ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label={`Open ${userData?.name ? `${userData.name}'s profile` : 'profile'} menu`}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[#d2d2d7] bg-[#e8f2fc] text-[12px] font-semibold text-[#06c] transition hover:ring-2 hover:ring-[#06c]/20"
              >
                {userData?.image
                  ? <img src={userData.image} alt="" className="h-full w-full object-cover" />
                  : <span aria-hidden="true">{userData?.name?.trim()?.charAt(0)?.toUpperCase() || 'P'}</span>}
              </button>
              {profileMenuOpen && (
                <div role="menu" className="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-2xl border border-[#dfe8d9] bg-white p-1.5 shadow-[0_12px_32px_rgba(29,29,31,0.14)]">
                  <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); navigate('/my-profile') }} className="w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-[#374151] transition hover:bg-[#f5f5f7]">My profile</button>
                  <button type="button" role="menuitem" onClick={logout} className="w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-[#374151] transition hover:bg-[#f5f5f7]">Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" onClick={() => navigate('/login')} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-[#06c] px-4 text-[12px] font-semibold text-white transition hover:bg-[#0077ed]">Sign in <span aria-hidden="true">↗</span></button>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d2d2d7] bg-white text-[#1d1d1f] transition hover:bg-[#f5f5f7] max-[1024px]:grid"
        >
          {menuOpen
            ? <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
        </button>
      </nav>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-[#1f1f1f]/20 backdrop-blur-[2px] min-[1025px]:hidden max-[1024px]:top-16 max-sm:top-[58px]"
        />
      )}
      <div id="mobile-navigation" hidden={!menuOpen} className="relative z-50 border-t border-[#d2d2d7] bg-white px-5 pb-5 pt-4 shadow-[0_16px_32px_rgba(29,29,31,0.12)] min-[1025px]:hidden">
        <div className="flex flex-col gap-1 [&>a]:w-full [&>a]:rounded-xl [&>a]:px-3.5 [&>a]:py-3 [&>a]:text-[14px] [&>a]:font-medium [&>a]:text-[#374151] [&>a]:transition-colors [&>a:after]:hidden [&>a[aria-current=page]]:bg-[#e8f2fc] [&>a[aria-current=page]]:text-[#06c]">
          {links}
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <form onSubmit={search} className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] px-3 text-[13px] text-[#1f1f1f] focus-within:border-[#06c]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-[#6e6e73]">
              <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.7" />
              <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a specialist"
              aria-label="Search doctors"
              className="min-w-0 flex-1 bg-transparent px-2 py-1 text-[13px] text-[#1f1f1f] outline-none placeholder:text-[#7c8a97]"
            />
            <button type="submit" aria-label="Search doctors" className="sr-only">Search</button>
          </form>
          {themeToggle(true)}
        </div>
        {token ? (
          <div className="mt-4 flex items-center gap-3 border-t border-[#d2d2d7] pt-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-[#d2d2d7] bg-[#e8f2fc] text-[13px] font-semibold text-[#06c]">
              {userData?.image
                ? <img src={userData.image} alt="" className="h-full w-full object-cover" />
                : <span aria-hidden="true">{userData?.name?.trim()?.charAt(0)?.toUpperCase() || 'P'}</span>}
            </div>
            <button type="button" onClick={() => { setMenuOpen(false); navigate('/my-profile') }} className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[13px] font-semibold text-[#1d1d1f]">{userData?.name || 'My profile'}</span>
              <span className="mt-0.5 block text-[12px] text-[#6e6e73]">View your account</span>
            </button>
            <button type="button" onClick={logout} className="rounded-full border border-[#d2d2d7] px-3 py-2 text-[12px] font-medium text-[#374151] transition hover:bg-[#f5f5f7]">Sign out</button>
          </div>
        ) : (
          <button type="button" onClick={() => { setMenuOpen(false); navigate('/login') }} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#06c] text-[13px] font-semibold text-white transition hover:bg-[#0077ed]">Sign in <span aria-hidden="true">↗</span></button>
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
