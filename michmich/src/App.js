import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom"

//import './App.css';
import './App.sass';


import MainPage from './pages/MainPage'
import Form from './pages/Form'
import CollabForm from './pages/CollabForm'
import NotFoundPage from './pages/404'


class App extends Component {
  
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={MainPage}/>
          <Route exact path='/collabform' component={CollabForm}/>
          <Route exact path='/form' component={Form}/>
          <Route exact path='/404' component={NotFoundPage}/>
          <Redirect to='/404'/>
        </Switch>
      </Router> 
    )

  }
}

export default App;