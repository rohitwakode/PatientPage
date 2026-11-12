import { Component, useContext, useEffect, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Navbar from './components/Navbar'
import Notifications from './components/Notifications'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import 'react-toastify/dist/ReactToastify.css'

const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}

const RequireAuth = () => {
  const { token } = useContext(AppContext)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled app error:', error, errorInfo)
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-[70vh] w-[min(calc(100%-48px),760px)] flex-col items-center justify-center px-5 py-16 text-center max-sm:w-[calc(100%-36px)]">
          <span className="rounded-full border border-[#dfe8d9] bg-[#f5faf3] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#46a300]">
            Exception
          </span>
          <h1 className="mt-6 text-[clamp(40px,7vw,72px)] font-black leading-[0.96] tracking-[-0.07em] text-[#1f1f1f]">
            Something went wrong.
          </h1>
          <p className="mt-4 max-w-[500px] text-[15px] leading-[1.7] text-[#4b5563]">
            We hit a snag while loading this page. Please try again or head back to the homepage.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.resetErrorBoundary}
              className="rounded-full bg-[#58cc02] px-6 py-3 text-[13px] font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#46a300]"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-full border border-[#dfe8d9] bg-white px-6 py-3 text-[13px] font-black uppercase tracking-[0.08em] text-[#1f1f1f] transition hover:border-[#58cc02] hover:text-[#46a300]"
            >
              Back home
            </a>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

const App = () => {
  const { pathname } = useLocation()
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme')
    return storedTheme || 'light'
  })
  const isLoginPage = pathname === '/login'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light'
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ErrorBoundary>
      <div id="top" className={`min-h-screen bg-white text-[#1d1d1f] ${theme === 'dark' ? 'dark' : ''}`}>
        <ScrollToTop />
        <Notifications theme={theme} />
        {!isLoginPage && <Navbar theme={theme} onToggleTheme={toggleTheme} />}
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path='/' element={<Home />} />
            <Route path='/doctors' element={<Doctors />} />
            <Route path='/doctors/:speciality' element={<Doctors />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/appointment/:docId' element={<Appointment />} />
            <Route path='/my-appointments' element={<MyAppointments />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
        {!isLoginPage && <Footer />}
      </div>
    </ErrorBoundary>
  )
}

export default App