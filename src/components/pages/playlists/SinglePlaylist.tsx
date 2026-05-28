import React from 'react';
import type {Playlist} from "./playlist";
import Player from "../../multiPage/player/Player.tsx";
import removeIcon from '../../../assets/images/buttons/remove.svg';

interface params {
    inputPlaylist: Playlist;
    deletePlaylist: (name: string) => void;
    last?:boolean;
}

export default function SinglePlaylist({inputPlaylist, deletePlaylist, last}:params):React.ReactElement {

    return (
        <div className={"playlistWrapper"}>
            <button className={"playlistDeleteButton"} onClick={() => {deletePlaylist(inputPlaylist.name)}} >
                <img src={removeIcon} alt={"Remove icon"}/>
            </button>
            <h2>
                {inputPlaylist.name}
            </h2>
            <Player tracks={inputPlaylist.tracks} playlistName={inputPlaylist.name} />

            {!last ? <div className={"sectionDivider"} /> : <></>}
        </div>
    )
}