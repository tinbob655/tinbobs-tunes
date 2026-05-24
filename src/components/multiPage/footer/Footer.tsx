import React from 'react';
import logo from '../../../assets/images/NR logo.png';
import './footer.scss';

export default function Footer():React.ReactElement {

    return (
        <footer>
            <div className={"sectionDivider"}/>
            <p>
                App brought to you by <a href={"https://github.com/tinbob655"}>Tinbob655</a>
            </p>
            <img src={logo} alt={"The NewRinaldi logo"}/>
        </footer>
    )
}