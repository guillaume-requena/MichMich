import PropTypes from 'prop-types'
import React, { Component } from 'react'

const Button = ({ index, onClick }) => (
    <div className={`button ${index}`} onClick={() => onClick(index)}>
      <button className="delete">
        X
      </button>
    </div>
  )

  Button.propTypes = {
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default Button