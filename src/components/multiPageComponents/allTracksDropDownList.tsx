import React from 'react';
import albumsData from '../pages/albums/albumsData.json' assert {type: 'json'};
import singlesData from '../pages/singles/singlesData.json' assert {type: 'json'};

export default function AllTracksDropDownList():React.ReactElement {

    function getOptions():React.ReactElement[] {
        let tempOptions:React.ReactElement[] = [];
        let allTracks:string[] = [];
        
        //add all singles to the array
        singlesData.forEach((single) => {
            allTracks.push(single.frontendName);
        });

        //add all tracks in albums to the array
        Object.entries(albumsData).forEach((album) => {
            album[1].tracks.forEach((albumTrack) => {
                allTracks.push(albumTrack[1]);
            });
        });

        //sort the tracks in alphabetical order
        allTracks.sort();

        //now generate an html option for each track
        allTracks.forEach((track) => {
            tempOptions.push(
                <option value={track}>
                    {track}
                </option>
            );
        });

        return tempOptions;
    };

    return (
        <React.Fragment>
            {getOptions()}
        </React.Fragment>
    );
};