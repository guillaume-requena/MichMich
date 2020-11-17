import React, { Component } from 'react'

import './Map.css';

const Map = () => {
    const { resultFromPython } = this.props.location.state
    return (
        <div className="results">
            {resultFromPython}
        </div>
    );
};

export default Map;