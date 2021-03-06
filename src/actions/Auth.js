import axios from 'axios'
import api, { ACCESS_TOKEN, DEVICE_TYPE, LOCALE, VERSION } from '../lib/api'

import { handleError, setHistory, setQueue } from './Data'

export const UPDATE_AUTH = 'UPDATE_AUTH'
export const updateAuth = (authData) => ({
  type: UPDATE_AUTH,
  payload: authData
})

export const REMOVE_AUTH = 'REMOVE_AUTH'
export const removeAuth = () => {
  localStorage.removeItem('auth')
  return {
    type: REMOVE_AUTH
  }
}

export const SET_EXPIRED_SESSION = 'SET_EXPIRED_SESSION'
export const setExpiredSession = (payload) => ({
  type: SET_EXPIRED_SESSION,
  payload
})

export const UPDATE_MAL = 'UPDATE_MAL'
export const updateMal = (username, token) => ({
  type: UPDATE_MAL,
  payload: {
    username,
    token
  }
})
export const removeMal = () => updateMal('', '')

export const startSession = () => (dispatch, getState) => {
  const state = getState()
  const params = {
    access_token: ACCESS_TOKEN,
    device_type: DEVICE_TYPE,
    device_id: state.Auth.uuid
  }

  if (state.Auth.token) {
    params.auth = state.Auth.token
  }

  return new Promise(async (resolve, reject) => {
    try {
      const resp = await api({route: 'start_session', params, noCancel: true})
      const data = resp.data.data
      dispatch(
        updateAuth({
          session_id: data.session_id,
          token: data.auth,
          expires: data.expires
        })
      )
      resolve()
    } catch (err) {
      handleError(err, dispatch, reject)
    }
  })
}

export const login = (username, password) => (dispatch, getState) => {
  const state = getState()
  const form = new FormData()
  form.append('account', username)
  form.append('password', password)
  form.append('session_id', state.Auth.session_id)
  form.append('locale', LOCALE)
  form.append('version', VERSION)

  return new Promise(async (resolve, reject) => {
    try {
      const resp = await api({method: 'post', route: 'login', data: form})
      if (resp.data.error) throw resp

      const data = resp.data.data
      if (data.user.premium.indexOf('anime') === -1) {
        return reject(new Error('You must have a premium Crunchyroll account.'))
      }
      dispatch(
        updateAuth({
          token: data.auth,
          expires: data.expires,
          username: data.user.username
        })
      )
      // reset expired session
      dispatch(setExpiredSession(''))
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

export const logout = (didExpire) => (dispatch, getState) => {
  const state = getState()
  return new Promise(async (resolve, reject) => {
    try {
      if (didExpire) {
        dispatch(setExpiredSession(state.Auth.username))
      }
      dispatch(removeAuth())
      await dispatch(startSession())
      resolve()
      dispatch(setHistory(0, []))
      dispatch(setQueue([]))
    } catch (err) {
      handleError(err, dispatch, reject)
    }
  })
}

export const loginMal = (username, password) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await axios.post('/.netlify/functions/mal_login', {username, password})
      if (!data.error && data.success) {
        dispatch(updateMal(data.data.username, data.data.token))
        resolve()
      } else {
        reject(new Error(data.error))
      }
    } catch (err) {
      reject(err)
    }
  })
}
