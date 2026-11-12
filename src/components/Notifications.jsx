import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'

const NotificationIcon = ({ type }) => {
  const iconColor = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }[type] || '#64748b'

  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      {type === 'success' ? (
        <path d="M16.5 8.31V9a7.5 7.5 0 1 1-4.447-6.855M16.5 3 9 10.508l-2.25-2.25" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : type === 'error' ? (
        <path d="m5 5 8 8M13 5l-8 8" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="9" cy="9" r="7" stroke={iconColor} strokeWidth="1.5" />
          <path d={type === 'warning' ? 'M9 5.5v4M9 12.5h.01' : 'M9 8v4M9 5.5h.01'} stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

NotificationIcon.propTypes = {
  type: PropTypes.string
}

const NotificationCloseButton = ({ closeToast }) => (
  <button
    type="button"
    aria-label="Close notification"
    onClick={closeToast}
    style={{
      alignSelf: 'flex-start',
      margin: '0 0 auto 8px',
      padding: 1,
      border: 0,
      background: 'transparent',
      color: '#94a3b8',
      cursor: 'pointer',
      transition: 'color 160ms ease, transform 160ms ease'
    }}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="m3 3 8 8M11 3 3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </button>
)

NotificationCloseButton.propTypes = {
  closeToast: PropTypes.func.isRequired
}

const Notifications = ({ theme }) => {
  const isDark = theme === 'dark'

  return <ToastContainer
    position="top-right"
    autoClose={3500}
    theme={theme}
    newestOnTop
    closeOnClick
    pauseOnFocusLoss
    draggable
    hideProgressBar
    icon={NotificationIcon}
    closeButton={NotificationCloseButton}
    style={{
      width: 'min(390px, calc(100vw - 32px))',
      padding: 16
    }}
    toastStyle={{
      minHeight: 0,
      marginBottom: 10,
      padding: 12,
      border: `1px solid ${isDark ? '#38383a' : '#d2d2d7'}`,
      borderRadius: 16,
      background: isDark ? '#1c1c1e' : '#fff',
      color: isDark ? '#f5f5f7' : '#1d1d1f',
      boxShadow: isDark ? '0 12px 32px rgba(0, 0, 0, 0.3)' : '0 12px 32px rgba(29, 29, 31, 0.1)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}
    bodyStyle={{
      flex: 1,
      margin: 0,
      padding: 0,
      color: 'inherit',
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.45
    }}
  />
}

Notifications.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired
}

export default Notifications
