import React, { Component } from 'react'
import { Link } from "react-router-dom";

import './Form.css';

import Commute from '../components/Commute'
import MapContainer from '../components/Map'

const COMMUTE = ['🚶🏽‍♂️', '🚇', '🚗', '🚲']
const COMMUTE_ICONS = ['fas fa-walking', 'fas fa-train', 'fas fa-car-side', 'fas fa-bicycle']

class Form extends Component {
  state = {
    amountOfUsers: '2',
    activity: 'Bar',
    allAddresses: ['Place Monge, Paris', 'Pont de Neuilly'],
    allCommuteWays: [0, 3],
    commuteTypes: COMMUTE_ICONS,
    form: true,
    displayFormResult: false,
    resultLocationInfo: {},
    formSending: false,
    displayMap:true
  }

  // Arrow fx for binding
  handleAmountOfUsersUpdate = (event) => {
    const value = event.target.value
      // Remove all non-digits
      .replace(/\D/, '')
      .slice(0, 2)
    this.setState({ amountOfUsers: value })

    var newAllAddresses = []
    var newAllCommuteWays = []
    for (let step = 0; step < value; step++) {
      newAllAddresses.push('')
      newAllCommuteWays.push('')
    }

    this.setState({ allAddresses: newAllAddresses, allCommuteWays: newAllCommuteWays })
  }

  // Arrow fx for binding
  handleActivityUpdate = (event) => {
    const value = event.target.value
      // Remove all non-digits
      .replace(/\d/, '')
    console.log(value)

    this.setState({ activity: value })
  }

  handleDeleteClick = (index, e) => {
    e.preventDefault();
    const { allAddresses, allCommuteWays, amountOfUsers } = this.state
    allAddresses.splice(index, 1)
    allCommuteWays.splice(index, 1)
    const newAmountOfUsers = amountOfUsers - 1
    this.setState({ allAddresses, amountOfUsers: newAmountOfUsers, allCommuteWays })
  }

  handleCommuteTypeClick = (index, indexCommute) => {
    let { allCommuteWays } = this.state
    allCommuteWays.splice(index, 1, indexCommute)
    console.log(allCommuteWays)
    this.setState({ allCommuteWays });
  }

  getFeedbackForCommuteButton = (index, indexCommute) => {
    const { allCommuteWays } = this.state

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
    if (amountOfUsers === '') {
      newAmountOfUsers = 1
    }
    else {
      newAmountOfUsers = parseInt(amountOfUsers) + 1
    }
    this.setState({ allAddresses, amountOfUsers: newAmountOfUsers, allCommuteWays })
  }

  backToForm = () => {
    this.setState({ displayFormResult:false, formSending:false })
  }

  displayMap = () => {
    this.setState({ displayMap:true })
  }

  displayList = () => {
    this.setState({ displayMap:false })
  }

  sendData = (e) => {
    e.preventDefault();
    this.setState({ formSending:true })
    fetch('/test', {
      method: 'POST',
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
          // this.setState({ resultFromPython: Object.values(data), results: true, form: false })
          this.setState({
            resultLocationInfo:data[0],
            displayFormResult: true
          })
        })
      })
  }
  
    render() {
      const { amountOfUsers, activity, allAddresses, commuteTypes, displayFormResult, formSending, displayMap } = this.state
  
      return (
        <div>
          {!displayFormResult && (
          <form className="formulaire">
            <label className="people">
              <span>Vous êtes combien ?</span>
              <input className="input is-hovered"
                  type="number"
                  onChange={this.handleAmountOfUsersUpdate}
                  autoComplete="given-name"
                  placeholder="3"
                  value={amountOfUsers}
                  required={true}
              />
            </label>
            <label className="activity">
              <span>Pour quoi faire ?</span>
              <input className="input"
                  type="text"
                  onChange={this.handleActivityUpdate}
                  autoComplete="given-name"
                  placeholder="Bar"
                  value={activity}
                  required={true}
              />
            </label>
            <div className="addresses">
              <p>Quelles sont les adresses ?</p>
              <div className="block">
                {allAddresses.map((address, index) => (
                  <div className="box" key={index}>
                    <div className="block">
                      <input
                          className="input"
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
                    </div>
                    <div className="buttons is-centered">
                      {commuteTypes.map((commuteType, indexCommute) => (
                        <Commute commuteType={commuteType} key={indexCommute} feedback={this.getFeedbackForCommuteButton(index, indexCommute)} indexCommute={indexCommute} index={index} onClick={() => this.handleCommuteTypeClick(index, indexCommute)}/>
                      ))}
                      <button className="button is-primary is-outlined" onClick={(e) => this.handleDeleteClick(index, e)}>
                        <span className="icon is-small">
                          <i className="fas fa-times"></i>
                        </span>
                      </button> 
                    </div>
                  </div>
                  
                ))}
                <button className="button is-link is-outlined " onClick={() => this.handleAddAddressClick()}>
                  <span> Ajoute une adresse</span>
                  <span className="icon is-small">
                    <i className="fas fa-plus"></i>
                  </span>
                </button>
              </div>
            </div>
            {!formSending ? (<button type="submit" className="button is-primary" onClick={(e)=>this.sendData(e)}>Testons MichMich</button>)
                          : (<button type="submit" className="button is-loading" onClick={(e)=>this.sendData(e)}>Testons MichMich</button>)}
            </form>
            )}
          {displayFormResult && (
            <div className="resultPage">
                {displayMap && (
                  <div className="block">
                    <MapContainer resultLocationInfo={this.state.resultLocationInfo}/>
                    <div className = "buttons has-addons is-centered">
                      <button className="button is-primary is-selected" onClick={()=> this.displayMap()} disabled>Map</button>
                      <button className="button is-primary" onClick={()=> this.displayList()}>List</button>
                    </div>
                    <div className = "buttons has-addons is-centered">
                      <button className="button is-primary" onClick={()=> this.backToForm()}>Retour au formulaire</button>
                    </div>
                  </div>
                  )}
                {!displayMap && (
                  <div className="block">
                    <div className = "buttons has-addons is-centered">
                      <button className="button is-primary" onClick={()=> this.displayMap()}>Map</button>
                      <button className="button is-primary is-selected" onClick={()=> this.displayList()} disabled>List</button>
                    </div>
                    <div className = "buttons has-addons is-centered">
                      <button className="button is-primary" onClick={()=> this.backToForm()}>Retour au formulaire</button>
                    </div>
                    <p className="box is-centered">
                      {this.state.resultLocationInfo.name}
                    </p>
                  </div>
                  )}
            </div>
          )}
        </div>
      )
    }
  }

export default Form;