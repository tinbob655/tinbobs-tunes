import React from 'react';
import logoImage from '../../assets/images/NR logo.png';
import '../../scss/footer.scss';

export default function Footer():React.ReactElement {

    return (
        <React.Fragment>
            <div className="dividerLine"></div>
            
            <div id="footerWrapper">
                <img src={logoImage} alt="NewRinaldi Logo" style={{width: 'auto', height: '25vh'}} />

                <p>
                    All music here is created by William Rutland, aka NewRinaldi / Tinbob655. If you would like to use my music in your own projects, please do not hesitate to contact me at{' '}
                    <a href="mailto:newrinaldisings@gmail.com" target="_blank">
                        <u><b>
                            newrinaldisings@gmail.com
                        </b></u>
                    </a>
                </p>
            </div>
        </React.Fragment>
    );
};