import React from 'react'
import PropTypes from 'prop-types';

import './Commute.css'

const Commute = ({ commuteType, feedback, indexCommute, index, onClick }) => (
    <div className={`commute ${feedback}`} onClick={() => onClick(index, indexCommute)}>
      <span className="symbol">
        {commuteType}
      </span>
    </div>
  )

Commute.propTypes = {
    commuteType: PropTypes.string.isRequired,
    indexCommute: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default Commute