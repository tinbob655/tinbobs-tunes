import React, {useState} from 'react';
import type {Playlist} from "./playlist";
import Player from "../../multiPage/player/Player.tsx";
import removeIcon from '../../../assets/images/buttons/remove.svg';

interface params {
    inputPlaylist: Playlist;
    deletePlaylist: (name: string) => void;
    last?: boolean;
}

export default function SinglePlaylist({inputPlaylist, deletePlaylist, last}: params): React.ReactElement {

    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div className={"playlistWrapper"}>

            {/*delete button + tappable title row*/}
            <div className={"playlistTitleRow"} onClick={() => setExpanded(prev => !prev)}>
                <h2>{inputPlaylist.name}</h2>
                <div className={"playlistTitleRowRight"}>

                    {/*arrow to indicate if the playlist is expanded*/}
                    <span className={`playlistChevron${expanded ? ' open' : ''}`}>›</span>

                    {/*button to delete the playlist*/}
                    <button
                        className={"playlistDeleteButton"}
                        onClick={(e) => { e.stopPropagation(); deletePlaylist(inputPlaylist.name); }}
                    >
                        <img src={removeIcon} alt={"Remove icon"}/>
                    </button>
                </div>
            </div>

            {/*player — only rendered when expanded*/}
            {expanded && (
                <Player tracks={inputPlaylist.tracks} playlistName={inputPlaylist.name} allowShuffle={true} />
            )}

            {!last && <div className={"sectionDivider"} />}
        </div>
    );
}