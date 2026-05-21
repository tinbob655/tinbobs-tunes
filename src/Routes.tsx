import React from 'react';
import {Routes, Route} from 'react-router';

//import all pages
import Home from "./components/pages/home/Home.tsx";
import Albums from "./components/pages/albums/Albums.tsx";
import Playlists from "./components/pages/playlists/Playlists.tsx";
import Singles from "./components/pages/singles/Singles.tsx";

export default function AllRoutes():React.ReactElement {

    return (
        <div id={"content"}>
            <Routes>
                {getRoutes()}
            </Routes>
        </div>
    )
}

function getRoutes():React.ReactElement[] {
    const res:React.ReactElement[] = [];
    const pageInfo:[string, React.ReactElement][] = [
        ['', <Home/>],
        ['albums', <Albums/>],
        ['playlists', <Playlists/>],
        ['singles', <Singles/>],
    ]

    pageInfo.forEach((page) => {
        const path:string = `/${page[0]}`;
        res.push(
            <Route key={path} path={path} element={page[1]} />
        );
    });

    return res;
}