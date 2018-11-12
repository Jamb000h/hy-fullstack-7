import React from 'react'
import { connect } from 'react-redux'
class Notification extends React.Component {
  render() {

    const { notification } = this.props

    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1,
      display: notification.show ? 'block' : 'none',
      backgroundColor: notification.type === 'success' ? 'lightgreen' : 'coral',
      border: '1px solid yellow',
      borderColor: notification.type === 'success' ? 'lightgreen' : 'coral'
    }
    return (
      <div style={style}>
        {notification.text}
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotification = connect(
  mapStateToProps
)(Notification)


export default ConnectedNotification