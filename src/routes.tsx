import {Routes, Route} from 'react-router-dom';
import React from 'react';

//import all pages
import Home from './components/pages/home/home';
import Albums from './components/pages/albums/albums';
import Playlists from './components/pages/playlists/playlists.tsx';
import Singles from './components/pages/singles/singles';

export default function AppRoutes():React.ReactElement {

    function getRoutes():React.ReactElement[] {
        
        //will have each route appended to this array
        let tempRoutes:React.ReactElement[] = [];

        //match each page with a path
        type pageArray = [string, React.ReactElement];
        const paths:Array<pageArray> = [
            ['/', <Home/>],
            ['/albums', <Albums/>],
            ['/playlists', <Playlists/>],
            ['/singles', <Singles/>],
        ];

        paths.forEach((path:pageArray) => {
            
            //add the route to the array
            tempRoutes.push(
                <Route path={path[0]} element={path[1]} key={path[0]}/>
            );
        });

        return tempRoutes;
    };

    return (
        <Routes>
            {getRoutes()}
        </Routes>
    );
};