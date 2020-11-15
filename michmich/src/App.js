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
    console.log(value)

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
  
    if (allCommuteWays[index] === indexCommute) {
      return 'hidden'
    }
    else {
      return 'visible'
    }
  }

  handleAddAddressClick = () => {
    const { allAddresses, amountOfUsers, allCommuteWays } = this.state
    allAddresses.push('')
    allCommuteWays.push('')
    var newAmountOfUsers
    if (amountOfUsers === ''){
      newAmountOfUsers = 1
    }
    else {
      newAmountOfUsers = parseInt(amountOfUsers) + 1
    }
    this.setState({allAddresses, amountOfUsers: newAmountOfUsers, allCommuteWays})
  }

  sendData(){
    fetch('http://127.0.0.1:5000/optim-load',{
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pallets: this.pallets.map(function(pallet){
          return {
            type:{
              length:parseInt(pallet.length, 10),
              width:parseInt(pallet.width, 10)
            }
          }
        }),
        truck:{
          length: parseInt(this.Length, 10),
          width: parseInt(this.Width, 10)
        }
      })
    })
      .then((response) => {
        response.json().then((data) => {
          this.data=data
          console.log('data',data)
        })
      })
  }

  render() {
    const { amountOfUsers, activity, allAddresses, commuteTypes } = this.state

    return (
      <form className="formulaire">
        <label className="people">
          <span>Vous êtes combien ?</span>
          <input className="peopleInput"
              type="int"
              onChange={this.handleAmountOfUsersUpdate}
              autoComplete="given-name"
              placeholder="3"
              value={amountOfUsers}
              required={true}
          />
        </label>
        <label className="activity">
          <span>Pour quoi faire ?</span>
          <input className="activityInput"
              type="text"
              onChange={this.handleActivityUpdate}
              autoComplete="given-name"
              placeholder="Bar"
              value={activity}
              required={true}
          />
        </label>
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
                                          console.log(allAddresses)
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
        <button type="submit" className="button" onClick={()=>this.sendData()}>Testons MichMich</button>
      </form>
    )
  }
}

export default App;