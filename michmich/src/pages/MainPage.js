import React from 'react';
import { Link } from "react-router-dom";

import './MainPage.css';


const MainPage = () => {
    return (
        <div className="mainPage">
            <h3>Bienvenue sur la V1 de MichMich</h3>
            <Link className="formRedirectionButton" to='/form'>Clique pour l'essayer !</Link>
        </div>
    );
};

export default MainPage;