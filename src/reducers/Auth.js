import uuid from 'uuid/v4'
import { UPDATE_AUTH, SET_EXPIRED_SESSION, REMOVE_AUTH, UPDATE_MAL } from '../actions'

// make UUIDs noticable
const genUUID = () => {
  let id = uuid()
  const parts = id.split('-')
  parts[1] = 'NANI'
  return parts.join('-')
}

const initialState = {
  mal: {username: '', token: ''},
  expiredSession: '',
  uuid: genUUID()
}

export default function Auth (state = initialState, action) {
  switch (action.type) {
    case UPDATE_AUTH:
      return {
        ...state,
        ...action.payload
      }
    case UPDATE_MAL:
      return {
        ...state,
        mal: action.payload
      }
    case REMOVE_AUTH:
      return initialState
    case SET_EXPIRED_SESSION:
      return {
        ...state,
        expiredSession: action.payload
      }
    default:
      return state
  }
}
