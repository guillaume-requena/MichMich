import React from 'react'
import PropTypes from 'prop-types';

import './Commute.css'

const Commute = ({ commuteType, feedback, indexCommute, index, onClick }) => (
  !(feedback === 'hidden') ? 
                          (<button className='button is-primary is-rounded' onClick={() => onClick(index, indexCommute)}>
                            <span class="icon is-small">
                              <i className={commuteType}></i>
                            </span>
                          </button>)
                          : (<button className='button is-primary is-rounded' onClick={() => onClick(index, indexCommute)} disabled>
                              <span class="icon is-small">
                                <i className={commuteType}></i>
                              </span>
                            </button>)
  )

Commute.propTypes = {
    commuteType: PropTypes.string.isRequired,
    indexCommute: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default Commute