import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './Address.css'

class Address extends Component {
    state = {
        address: '',
    }

    // Arrow fx for binding
    handleAddressUpdate = (event) => {
        this.setState({address: event.target.value})
    }

    render() {
        const { index, onClick } = this.props
        return (
            <div className="address">
                <div className="addressInput">
                    <label>
                        <input
                            type="text"
                            onChange={this.handleAddressUpdate}
                            autoComplete="given-name"
                            placeholder={'Adresse '+(index+1)}
                            value={this.state.address}
                            required={true}
                        />
                    </label>
                </div>
                <div className="deleteButton">
                    <div className={`button ${index}`} onClick={() => onClick(index)}>
                        <button className="delete">
                            X
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

Address.propTypes = {
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
  }

export default Address