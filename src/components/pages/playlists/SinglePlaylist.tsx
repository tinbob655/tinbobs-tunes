import React from 'react';
import type {Playlist} from "./playlist";
import Player from "../../multiPage/player/Player.tsx";

interface params {
    inputPlaylist: Playlist;
    deletePlaylist: (name: string) => void;
    last?:boolean;
}

export default function SinglePlaylist({inputPlaylist, deletePlaylist, last}:params):React.ReactElement {

    return (
        <div className={"playlistWrapper"}>
            <button className={"playlistDeleteButton"} onClick={() => {deletePlaylist(inputPlaylist.name)}} >
                X
            </button>
            <h2>
                {inputPlaylist.name}
            </h2>
            <Player tracks={inputPlaylist.tracks} />

            {!last ? <div className={"sectionDivider"} /> : <></>}
        </div>
    )
}