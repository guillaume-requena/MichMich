import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom"

import './App.css';

import MainPage from './pages/MainPage'
import Form from './pages/Form'
import NotFoundPage from './pages/404'
import Map from './pages/Map'


class App extends Component {
  
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={MainPage}/>
          <Route exact path='/form' component={Form}/>
          <Route exact path='/map'component={Map}/>
          <Route exact path='/404' component={NotFoundPage}/>
          <Redirect to='/404'/>
        </Switch>
      </Router> 
    )

  }
}

export default App;