import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import './Map.css'
const mapStyles = {
    width: '100%',
    height: '50%'
    
};

export class MapContainer extends Component {

    state = {
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            text: marker.text || ''
        });

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };
    render() {

        return (
            <Map
                google={this.props.google}
                zoom={18}
                style={mapStyles}
                initialCenter={
                    this.props.resultLocationInfo.geometry.location
                    // { lat: 48.8587275, lng: 2.2944984 }
                }
            >

                <Marker
                    onClick={this.onMarkerClick}
                    name={this.props.resultLocationInfo.name}
                />
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div className={'placeCard'}>
                        <h2>{this.state.selectedPlace.name}</h2>
                        <h3>{this.props.resultLocationInfo.vicinity}</h3>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBV2UD7aRLnODU9qpJOzG7wHkjtF6c4l-M'
})(MapContainer);