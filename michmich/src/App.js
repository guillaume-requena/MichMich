import React, { Component } from 'react'

import './App.css';

import Commute from './Commute'

const COMMUTE = ['🚶🏽‍♂️', '🚇', '🚗', '🚲']

class App extends Component {
  state = {
    amountOfUsers: '',
    activity: '',
    allAddresses: [],
    allCommuteWays: [],
    commuteTypes: COMMUTE
  }

  // Arrow fx for binding
  handleAmountOfUsersUpdate = (event) => {
    const value = event.target.value
      // Remove all non-digits
      .replace(/\D/, '')
      .slice(0, 2)
    this.setState({amountOfUsers: value})

    var newAllAddresses = []
    var newAllCommuteWays = []
    for (let step = 0; step < value; step++) {
      newAllAddresses.push('')
      newAllCommuteWays.push('')
    }
    
    this.setState({allAddresses: newAllAddresses, allCommuteWays: newAllCommuteWays})
  }  

  // Arrow fx for binding
  handleActivityUpdate = (event) => {
    const value = event.target.value
      // Remove all non-digits
      .replace(/\d/, '')

    this.setState({activity: value})
  }

  handleDeleteClick = index => {
    const { allAddresses, allCommuteWays, amountOfUsers } = this.state
    allAddresses.splice(index, 1)
    allCommuteWays.splice(index, 1)
    const newAmountOfUsers = amountOfUsers - 1
    this.setState({allAddresses, amountOfUsers: newAmountOfUsers, allCommuteWays})
  }

  handleCommuteTypeClick = (index, indexCommute) => {
    let {allCommuteWays} = this.state
    allCommuteWays.splice(index, 1, indexCommute)
    console.log(allCommuteWays)
    this.setState({ allCommuteWays });
  }

  getFeedbackForCommuteButton = (index, indexCommute) => {
    const {allCommuteWays} = this.state
    console.log(allCommuteWays[index])
  
    if (allCommuteWays[index] === indexCommute) {
      return 'hidden'
    }
    else {
      return 'visible'
    }
  }

  handleAddAddressClick = () => {
    const { allAddresses, amountOfUsers, commuteTypes, allCommuteWays } = this.state
    allAddresses.push('')
    allCommuteWays.push('')
    console.log(commuteTypes)
    var newAmountOfUsers
    if (amountOfUsers === ''){
      newAmountOfUsers = 1
    }
    else {
      newAmountOfUsers = parseInt(amountOfUsers) + 1
    }
    this.setState({allAddresses, amountOfUsers: newAmountOfUsers, allCommuteWays})
  }

  render() {
    const { amountOfUsers, activity, allAddresses, commuteTypes } = this.state

    return (
      <form className="formulaire">
        <div className="people">
          <label>
            Vous êtes combien ?
            <input
                type="int"
                onChange={this.handleAmountOfUsersUpdate}
                autoComplete="given-name"
                placeholder="3"
                value={amountOfUsers}
                required={true}
            />
          </label>
        </div>
        <div className="activity">
          <label>
            Pour quoi faire ?
            <input
                type="text"
                onChange={this.handleActivityUpdate}
                autoComplete="given-name"
                placeholder="Bar"
                value={activity}
                required={true}
            />
          </label>
        </div>
        <div className="addresses">
            Quelles sont les adresses ?
            {allAddresses.map((address, index) => (
              <div className="addressCommute" key={index}>
                <div className="address" >
                  <input
                      className="addressInput"
                      type="text"
                      onChange={(e) => {
                                          let {allAddresses} = this.state
                                          allAddresses.splice(index, 1, e.target.value)
                                          this.setState({ allAddresses });
                                        } }
                      autoComplete="given-name"
                      placeholder={'Adresse '+(index+1)}
                      value={address}
                      required={true}
                  />
                  <div className="delete" onClick={() => this.handleDeleteClick(index)}>
                      <button className="deleteButton">
                        <span className="deleteSymbol">X</span>
                      </button>
                  </div>
                </div>
                <div className="commutes">
                  {commuteTypes.map((commuteType, indexCommute) => (
                    <Commute commuteType={commuteType} key={indexCommute} feedback={this.getFeedbackForCommuteButton(index, indexCommute)} indexCommute={indexCommute} index={index} onClick={() => this.handleCommuteTypeClick(index, indexCommute)}/>
                  ))} 
                </div>
              </div>
            ))}
            <div className="addAddressButton" onClick={() => this.handleAddAddressClick()}>
                <button className="addAddress">
                    +
                </button>
            </div>
        </div>
        <button type="submit" className="button">Testons MichMich</button>
      </form>
    )
  }
}

export default App;