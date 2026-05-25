import React from 'react';
import PageHeader from "../../multiPage/PageHeader.tsx";
import rawAlbumData from '../../../assets/albumsData.json' with { type: 'json' };
import Player from "../../multiPage/player/Player.tsx";
import type {Track} from "../../multiPage/player/playerTypes";

export default function Albums(): React.ReactElement {
    return (
        <React.Fragment>
            <PageHeader title={"Albums"} subtitle={"All my albums to date"} />
            {rawAlbumData.map((album, index:number):React.ReactElement => {
                const alignment:string = index % 2 === 0 ? "alignRight" : "alignLeft";

                //mutates json into tracks
                const tracks: Track[] = album.tracks.map(([fileName, trackName]) => ({
                    fileName: `albums/${album.image.replace('.jpg', '')}/${fileName}`,
                    trackName,
                }));

                return (
                    <React.Fragment key={album.frontendName}>
                        <h2 className={alignment}>{album.frontendName}</h2>
                        <p className={alignment}>Released: {album.releaseDate}</p>
                        <Player tracks={tracks} />
                        <div className={"sectionDivider glow"} />
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
}