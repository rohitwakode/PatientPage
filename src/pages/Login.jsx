import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { notify } from '../components/notificationService'
import { AppContext } from '../context/AppContext'
import BrandMark from '../components/BrandMark'
import { getApiErrorMessage } from '../context/apiErrors'

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [forgotStep, setForgotStep] = useState('email')
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from || '/'

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const credentials = { email, password }
      if (isSignUp) {
        await axios.post(`${backendUrl}/auth/new`, {
          user: { name, ...credentials },
          addReq: {
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            latitude: null,
            longitude: null
          }
        })
      }

      const { data } = await axios.post(`${backendUrl}/auth/login`, credentials)
      if (!data.token) throw new Error('Login response did not include a token')

      localStorage.setItem('token', data.token)
      setToken(data.token)
      notify.success(isSignUp ? 'Your account is ready' : 'Signed in')
      navigate(returnTo, { replace: true })
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Unable to sign in'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const onForgotPasswordSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      if (forgotStep === 'email') {
        await axios.post(`${backendUrl}/auth/send-otp`, null, { params: { email } })
        setForgotStep('otp')
        notify.success('A verification code has been sent to your email')
      } else if (forgotStep === 'otp') {
        const { data } = await axios.post(`${backendUrl}/auth/verify-otp`, { email, otp })
        const verifiedToken = typeof data === 'string' ? data.trim() : data?.token
        if (!verifiedToken) throw new Error('OTP verification response did not include a reset token')
        setResetToken(verifiedToken)
        setForgotStep('password')
      } else {
        await axios.post(`${backendUrl}/auth/reset-password`, {
          email,
          token: resetToken,
          password
        })
        setIsForgotPassword(false)
        setForgotStep('email')
        setOtp('')
        setPassword('')
        setResetToken('')
        setIsSignUp(false)
        notify.success('Password reset successfully. Please sign in.')
      }
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Unable to reset your password'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const startForgotPassword = () => {
    setIsForgotPassword(true)
    setForgotStep('email')
    setOtp('')
    setPassword('')
    setResetToken('')
  }

  const cancelForgotPassword = () => {
    setIsForgotPassword(false)
    setForgotStep('email')
    setOtp('')
    setPassword('')
    setResetToken('')
  }

  useEffect(() => {
    if (token) navigate(returnTo, { replace: true })
  }, [token, navigate, returnTo])

  const inputClass = 'mt-2 w-full rounded-xl border border-[#dfe8d9] bg-white px-4 py-3 text-[#1f1f1f] outline-none transition placeholder:text-[#6b7280] focus:border-[#58cc02]'

  return (
    <main className="apple-auth flex min-h-screen items-center justify-center px-5 py-12">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-[#dfe8d9] bg-white shadow-[0_24px_52px_rgba(88,204,2,0.12)] md:grid-cols-[1fr_0.9fr]">
        <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#f4faf1] via-white to-[#f7fbf6] p-8 md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#58cc02]/10" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full border border-[#58cc02]/10" />
          <BrandMark />
          <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-[#46a300]">Care begins here</p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#1f1f1f] md:text-5xl">
            {isForgotPassword ? 'Let’s get you back to your care.' : isSignUp ? 'Care starts with a simple step.' : 'Welcome back.'}
          </h1>
          <p className="mt-5 max-w-md leading-7 text-[#4b5563]">
            {isForgotPassword
              ? 'Verify your email and choose a new password for your account.'
              : isSignUp
              ? 'Create your patient account to discover specialists and manage your appointments.'
              : 'Sign in to find your doctors and keep your care organized.'}
          </p>
        </div>

        <div className="bg-white p-7 md:p-10">
          <h2 className="text-2xl font-black text-[#1f1f1f]">
            {isForgotPassword
              ? forgotStep === 'email' ? 'Forgot password' : forgotStep === 'otp' ? 'Verify your email' : 'Choose a new password'
              : isSignUp ? 'Create your account' : 'Sign in'}
          </h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            {isForgotPassword
              ? forgotStep === 'email' ? 'Enter your email to receive a verification code.' : forgotStep === 'otp' ? `Enter the code sent to ${email}.` : 'Enter a new password for your account.'
              : 'Enter your details to continue.'}
          </p>

          <form onSubmit={isForgotPassword ? onForgotPasswordSubmit : onSubmit} className="mt-7 space-y-5">
            {!isForgotPassword && isSignUp && (
              <label className="block text-sm text-[#374151]">Full name
                <input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} autoComplete="name" />
              </label>
            )}
            {(!isForgotPassword || forgotStep === 'email') && (
              <label className="block text-sm text-[#374151]">Email
                <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} autoComplete="email" readOnly={isForgotPassword && forgotStep !== 'email'} />
              </label>
            )}
            {isForgotPassword && forgotStep === 'otp' && (
              <label className="block text-sm text-[#374151]">Verification code
                <input required value={otp} onChange={(event) => setOtp(event.target.value)} className={inputClass} autoComplete="one-time-code" inputMode="numeric" />
              </label>
            )}
            {(!isForgotPassword || forgotStep === 'password') && (
              <label className="block text-sm text-[#374151]">{isForgotPassword ? 'New password' : 'Password'}
                <div className="relative">
                  <input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} pr-16`} autoComplete={isForgotPassword || isSignUp ? 'new-password' : 'current-password'} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-4 top-[calc(50%+4px)] -translate-y-1/2 text-sm font-semibold text-[#46a300] transition hover:text-[#3aa100]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>
            )}
            <button disabled={isSubmitting} type="submit" className="w-full rounded-full bg-[#58cc02] px-5 py-3.5 font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-[#58cc02]/20 transition hover:bg-[#46a300] disabled:cursor-wait disabled:opacity-60">
              {isSubmitting ? 'Please wait…' : isForgotPassword ? forgotStep === 'email' ? 'Send verification code' : forgotStep === 'otp' ? 'Verify code' : 'Reset password' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          {isForgotPassword ? (
            <button type="button" onClick={cancelForgotPassword} className="mt-6 w-full text-center text-sm font-semibold text-[#46a300] transition hover:text-[#3aa100]">
              Back to sign in
            </button>
          ) : (
            <>
              {!isSignUp && (
                <button type="button" onClick={startForgotPassword} className="mt-5 block w-full text-right text-sm font-semibold text-[#46a300] transition hover:text-[#3aa100]">
                  Forgot password?
                </button>
              )}
              <p className="mt-6 text-center text-sm text-[#4b5563]">
                {isSignUp ? 'Already have an account?' : 'New to Asclepius?'}{' '}
                <button type="button" onClick={() => setIsSignUp((value) => !value)} className="font-semibold text-[#46a300] transition hover:text-[#3aa100]">
                  {isSignUp ? 'Sign in' : 'Create account'}
                </button>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default Login
