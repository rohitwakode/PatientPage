import React from 'react'
import { toast } from 'react-toastify'
import NotificationContent from './NotificationContent'

const createNotification = (title, message) => React.createElement(NotificationContent, { title, message })

export const notify = {
  success: (message) => toast.success(createNotification('Successfully saved!', message)),
  error: (message) => toast.error(createNotification('Something went wrong.', message)),
  warning: (message) => toast.warning(createNotification('Please note', message)),
  info: (message) => toast.info(createNotification('Information', message))
}
