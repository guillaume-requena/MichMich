import React from 'react';
import { Link } from "react-router-dom";

import './MainPage.css';


const MainPage = () => {
    return (
        <div className="mainPage">
            <img src="Logo.png" alt="MichMichText" width="400"></img>
            <br></br>
            <Link className="button is-primary" to='/form'>Mode Solo</Link>
            <br></br>
            <Link className="button is-primary" to='/collabform' >Mode Partagé</Link>
        </div>
    );
};

export default MainPage;