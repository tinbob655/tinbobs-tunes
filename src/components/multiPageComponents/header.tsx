import React, {useState, useEffect} from 'react';
import {Divide as Hamburger} from 'hamburger-react';
import { useNavigate } from 'react-router-dom';
import '../../scss/header.scss';

export default function Header():React.ReactElement {

    const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);
    const navigator = useNavigate();

    useEffect(() => {

        //will fire when the hamburger button is pressed
        const wrapper:HTMLElement|null = document.getElementById('headerWrapper');

        if (!wrapper) {
            throw new Error('Could not find the header');
        };

        wrapper.classList.toggle('active', hamburgerOpen);
    }, [hamburgerOpen])

    function getHeaderLinks():React.ReactElement[] {
        let tempHeaderLinks:React.ReactElement[] = [];

        //data structure for every page required
        type page = [string, string];
        const paths:Array<page> = [
            ['/', 'Home'],
            ['/albums', 'Albums'],
            ['/playlists', 'Playlists'],
            ['/singles', 'Singles'],
        ];

        //add a link for every page
        paths.forEach((path:page) => {
            tempHeaderLinks.push(
                <React.Fragment>
                    <button type="button" onClick={() => {
                        navigator(path[0]);

                        //close hamburger after a link was pressed
                        setHamburgerOpen(false);

                        //make the page scroll to the top when a link was pressed
                        window.scrollTo(0, 0);
                    }}>
                        <h3 className="headerLink" style={{whiteSpace: 'pre-wrap'}}>
                            <br/>
                            <br/>
                            {path[1]}
                            <br/>
                            <br/>
                        </h3>
                    </button>
                </React.Fragment>
            );
        });

        return tempHeaderLinks;
    };

    return (
        <React.Fragment>
            <div id="headerWrapper">
                <table>
                    <thead>
                        <tr>
                            <td style={{width: '80%'}}>

                                {/*the buttons of the header go here*/}
                                <div style={{backgroundColor: '#050505dd', width: '100%', borderRadius: '10px'}}>
                                    {getHeaderLinks()}
                                </div>
                            </td>
                            <td>

                                {/*the hamburger button goes here*/}
                                <div style={{position: 'absolute', top: 20}}>
                                    <Hamburger toggled={hamburgerOpen} toggle={setHamburgerOpen} color={'white'} />
                                </div>

                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </React.Fragment>
    );
};