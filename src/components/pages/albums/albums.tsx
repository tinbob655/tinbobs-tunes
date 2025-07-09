import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import Album from './album.ts';
import * as albumsData from './albumsData.json' assert {type: 'json'};
import AlbumTrackPlayer from './albumTrackPlayer.tsx';

export default function Albums():React.ReactElement {

    //iterates for every album
    function getAlbumsHTML(albumsData:any):React.ReactElement[] {
        let tempAlbumsHTML:React.ReactElement[] = [];
        
        //for each album we have in albums data create an album class and add it to an array
        let albums:Album[] = [];
        Object.keys(albumsData).forEach((singleAlbum) => {
            
            //skip "default"
            if (singleAlbum != 'default') {
                albums.push(new Album(singleAlbum))
            };
        });

        //at this point, albums is an array of Album objects. Each Album object has a frontendName, a releaseDate and a 2D tracks array
        albums.forEach((albumObject) => {

            //generate HTML for each album
            tempAlbumsHTML.push(
                <React.Fragment>

                    {/*MARKUP FOR AN ENTIRE ALBUM'S CONTENT*/}

                    <div className="dividerLine"></div>

                    {/*track title*/}
                    <h2 className="alignLeft">
                        {albumObject.frontendName}
                    </h2>

                    {/*track release date*/}
                    <p className="noVerticalSpacing alignLeft">
                        Released on {albumObject.releaseDate.getDate()} / {albumObject.releaseDate.getMonth() +1} / {albumObject.releaseDate.getFullYear()}
                    </p>

                    {/* "tracks:" */}
                    <p className="alignLeft" style={{marginLeft: '15%'}}>
                        Tracks:
                    </p>
                    {getTracksHTML(albumObject)}
                </React.Fragment>
            );
        })

        return tempAlbumsHTML;
    };

    //iterates for every track in a single album
    function getTracksHTML(albumObject:Album):React.ReactElement[] {
        let tempTracksHTML:React.ReactElement[] = [];

        albumObject.tracks.forEach((track) => {
            tempTracksHTML.push(
                <React.Fragment>

                    {/*MARKUP FOR AN INDIVIDUAL TRACK PLAYER*/}
                    <p style={{marginBottom: 0, paddingBottom: 0}}>
                        {track[1]}
                    </p>
                    <AlbumTrackPlayer trackName={track[1]} audioName={track[0]} albumData={albumObject} />
                </React.Fragment>
            );
        });

        return tempTracksHTML;
    };

    return (
        <React.Fragment>
            <PageHeader title="Albums" subtitle="All my albums and LPs to date"/>

            <h2 className="alignRight">
                My Albums
            </h2>
            <p className="alignRight">
                Usually the idea for an album for me comes from a song originally intended to be a single which I particularly like the feel of. I then create a series of other tracks using the same / similar instruments before a full album is completed with each song having a similar vibe.
            </p>

            {getAlbumsHTML(albumsData)}
        </React.Fragment>
    );
};