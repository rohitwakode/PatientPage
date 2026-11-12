import PropTypes from 'prop-types'

const NotificationContent = ({ title, message }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <h3 style={{
      margin: '0 0 2px',
      color: '#334155',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.4
    }}>
      {title}
    </h3>
    <p style={{
      margin: 0,
      color: '#64748b',
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.45
    }}>
      {message}
    </p>
  </div>
)

NotificationContent.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired
}

export default NotificationContent
