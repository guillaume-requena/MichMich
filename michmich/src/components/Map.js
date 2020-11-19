import React, { Component } from 'react'

import './Map.css';

class Map extends Component {
    
    render() {
        const { resultFromPython } = this.props
        return (
            <div className="pageMap">
            {resultFromPython.map((result, index) => (
              <li key={index}>
                {result.name}: {result.rating}
              </li>
            ))} 
          </div>
        )
    }
};

Map.propTypes = {
}

export default Map;