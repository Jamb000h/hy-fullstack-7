import React from 'react'

const Notification = ({ notification }) => {
  if(notification.text.length > 0) {
    return (
      <div className={"notification " + notification.type}>
        {notification.text}
      </div>
    )
  }

  return null
}

export default Notification