import React, { Component } from 'react'
import { Link } from "react-router-dom";

import './Form.css';

import Commute from '../components/Commute'

const COMMUTE = ['🚶🏽‍♂️', '🚇', '🚗', '🚲']

class Form extends Component {
    state = {
      amountOfUsers: '',
      activity: '',
      allAddresses: [],
      allCommuteWays: [],
      commuteTypes: COMMUTE,
      resultFromPython: []
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
  
    handleDeleteClick = (index, e) => {
      e.preventDefault();
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
  
    sendData = (e) => {
      e.preventDefault();
      fetch('/test',{
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amountOfUsers: this.state.amountOfUsers,
          activity: this.state.activity,
          addresses: this.state.allAddresses.map((address, index) => {
            return {
              address: address,
              commuteType: this.state.allCommuteWays[index]
            }
          })
          })
        })
        .then((response) => {
          response.json().then((data) => {
            console.log(data)
            this.setState({resultFromPython: data})
          })
        })
    }
  
    render() {
      const { amountOfUsers, activity, allAddresses, commuteTypes, resultFromPython } = this.state
  
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
                    <div className="delete" onClick={(e) => this.handleDeleteClick(index, e)}>
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
          <button type="submit" className="button"><Link to={{
                                                                                            pathname: '/map',
                                                                                            state: {
                                                                                              resultFromPython: resultFromPython
                                                                                            }
                                                                                          }}
                                                                                          onClick={(e)=>this.sendData(e)}>Testons MichMich</Link></button>
        </form>
      )
    }
  }
  
  export default Form;