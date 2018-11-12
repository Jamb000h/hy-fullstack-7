const initialState = {
  text: '',
  type: '',
  show: false
}

export const notify = (data, duration) => {
  return async (dispatch) => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      data
    })
    setTimeout( () => {
      dispatch({
        type: 'HIDE_NOTIFICATION'
      })
    }, duration * 1000) // Duration is given as seconds, so multiply by 1000
  }
}

const notificationReducer = (store = initialState, action) => {
  switch(action.type) {
    case 'SHOW_NOTIFICATION':
      return { text: action.data.text, type: action.data.type, show: true}
    case 'HIDE_NOTIFICATION':
      return { text: '', show: false}
    default:
      return store
  }
}

export default notificationReducer