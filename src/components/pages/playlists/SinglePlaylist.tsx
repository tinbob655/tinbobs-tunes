import React from 'react';
import type {Playlist} from "./playlist";
import Player from "../../multiPage/player/Player.tsx";
import {usePlaylistManager} from "./usePlaylistManager.ts";

interface params {
    inputPlaylist: Playlist;
}

export default function SinglePlaylist({inputPlaylist}:params):React.ReactElement {

    const {deletePlaylist} = usePlaylistManager();

    return (
        <div className={"playlistWrapper"}>
            <button className={"playlistDeleteButton"} onClick={() => {deletePlaylist(inputPlaylist.name)}} >
                X
            </button>
            <h2>
                {inputPlaylist.name}
            </h2>
            <Player tracks={inputPlaylist.tracks} />
        </div>
    )
}