import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import { useLocation } from 'react-router-dom';
import Player from '../../multiPageComponents/player';
import * as albumsData from '../albums/albumsData.json' assert {type: 'json'};

interface stateType {
    name:string;
    tracks:[string, string][];
    description?:string;
};

export default function Playlist():React.ReactElement {

    const location = useLocation();
    const state:stateType = location.state;

    function getPlayers():React.ReactElement[] {
        let tempPlayersHTML:React.ReactElement[] = [];

        //repeat for each track provided
        state.tracks.forEach((track) => {

            //work out if the track is in an album
            let albumName:string|undefined = undefined;
            Object.entries(albumsData).forEach((album) => { //repeating for every album stored in albumsData.json
                if (album[1].tracks) {
                    album[1].tracks.forEach((albumTrack) => {   //repeating for each track in that album
                        
                        //check to see if the track's audio file name is the same as the provided audio file name
                        if (albumTrack[0] === track[1]) {
                            albumName = album[0];
                        };
                    });
                };
            });

            //generate and add the HTML
            tempPlayersHTML.push(
                <React.Fragment>
                    <p style={{marginBottom: 0, paddingBottom: 0}}>
                        {track[0]}
                    </p>
                    <Player audioFileName={track[1]} trackName={track[0]} albumName={albumName} />
                </React.Fragment>
            );
        });

        return tempPlayersHTML;
    };

    return (
        <React.Fragment>
            <PageHeader title={state.name} subtitle={state.description ? state.description  : "This playlist doesn't have a description yet"} />

            {getPlayers()}
        </React.Fragment>
    );
};