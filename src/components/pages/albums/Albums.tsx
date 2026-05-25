import React from 'react';
import PageHeader from "../../multiPage/PageHeader.tsx";
import rawAlbumData from '../../../assets/albumsData.json' with { type: 'json' };
import Player from "../../multiPage/player/Player.tsx";

export default function Albums():React.ReactElement {
    return (
        <React.Fragment>
            <PageHeader title={"Albums"} subtitle={"All my albums to date"} />
            {getAlbumsHTML()}
        </React.Fragment>
    )
}

function getAlbumsHTML():React.ReactElement[] {
    const res:React.ReactElement[] = [];
    let index:number = 0;
    rawAlbumData.forEach((album) => {
        const alignment:string = index % 2 === 0 ? "alignRight" : "alignLeft";
        res.push(
            <React.Fragment>
                <h2 className={alignment}>
                    {album.frontendName}
                </h2>
                <p className={alignment}>
                    Released: {album.releaseDate}
                </p>

                {getAlbumTracksHTML(album.tracks)}
                <div className={"sectionDivider glow"} />
            </React.Fragment>
        )

        index++;
    })

    return res;
}

function getAlbumTracksHTML(tracks: string[][]):React.ReactElement[] {
    const res:React.ReactElement[] = [];
    tracks.forEach((track) => {

        //extract data
        const fileName:string = track[0];
        const trackName:string = track[1];

        //create HTML
        res.push(
            <React.Fragment>
                <p>
                    {trackName}
                </p>
                <Player file={fileName} />
                <div className={"sectionDivider"} />
            </React.Fragment>
        );
    });

    return res;
}