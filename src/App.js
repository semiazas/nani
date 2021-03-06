import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logout } from './actions'
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'

import { isLoggedIn } from './lib/auth'

import AppContainer from './components/AppContainer'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AuthedRoute from './components/AuthedRoute'
import Series from './pages/Series'
import Media from './pages/Media'
import Queue from './pages/Queue'
import History from './pages/History'
import Recent from './pages/Recent'
import SeriesList from './pages/SeriesList'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTv } from '@fortawesome/free-solid-svg-icons/faTv'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl'
import { faFastForward } from '@fortawesome/free-solid-svg-icons/faFastForward'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { faCertificate } from '@fortawesome/free-solid-svg-icons/faCertificate'
import { faClosedCaptioning } from '@fortawesome/free-solid-svg-icons/faClosedCaptioning'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import { faList } from '@fortawesome/free-solid-svg-icons/faList'
import { faStepForward } from '@fortawesome/free-solid-svg-icons/faStepForward'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus'
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch'

import './App.css'

library.add(
  faTv,
  faClock,
  faSearch,
  faListOl,
  faFastForward,
  faCaretRight,
  faCaretLeft,
  faCaretDown,
  faExclamationTriangle,
  faStar,
  faCheckCircle,
  faTimesCircle,
  faCertificate,
  faClosedCaptioning,
  faHistory,
  faList,
  faStepForward,
  faUser,
  faCalendarAlt,
  faCog,
  faPlus,
  faMinus,
  faInfo,
  faCircleNotch
)

class App extends Component {
  async componentDidMount () {
    // ensure logged in
    const { dispatch, Auth } = this.props
    if (
      (Object.keys(Auth).length > 0) &&
      (!Auth.token || !Auth.expires || new Date() > new Date(Auth.expires))
    ) {
      await dispatch(logout(true))
    }
  }

  render () {
    return (
      <Router>
        <AppContainer>
          <Switch>
            <AuthedRoute exact path='/' authed={isLoggedIn()} component={Dashboard} />
            <AuthedRoute exact path='/login' redirect='/' authed={!isLoggedIn()} component={Login} />
            <AuthedRoute path='/queue' authed={isLoggedIn()} component={Queue} />
            <AuthedRoute path='/history' authed={isLoggedIn()} component={History} />
            <AuthedRoute path='/recent' authed={isLoggedIn()} component={Recent} />
            <AuthedRoute path='/series/:id/:media' authed={isLoggedIn()} component={Media} />
            <AuthedRoute path='/series/:id' authed={isLoggedIn()} component={Series} />
            <AuthedRoute path='/list/simulcast' authed={isLoggedIn()} component={(props) => <SeriesList type='simulcast' {...props} />} />
            <AuthedRoute path='/list/popular' authed={isLoggedIn()} component={(props) => <SeriesList type='popular' {...props} />} />
            <AuthedRoute path='/list/newest' authed={isLoggedIn()} component={(props) => <SeriesList type='newest' {...props} />} />
            <Redirect from='*' to='/login' />
          </Switch>
        </AppContainer>
      </Router>
    )
  }
}

export default connect((store) => {
  return {
    Auth: store.Auth
  }
})(App)
