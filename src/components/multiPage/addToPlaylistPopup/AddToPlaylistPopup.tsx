import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Track } from "../player/playerTypes";
import { usePlaylist } from '../../../hooks/usePlaylist.ts';
import './addToPlaylistPopup.scss';

interface Params {
    track: Track;
    onClose: () => void;
}

export default function AddToPlaylistPopup({ track, onClose }: Params): React.ReactElement {

    const { playlists, addTrackToPlaylist } = usePlaylist();
    const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null);

    //fires when we attempt to add the track
    function handleAdd(playlistName: string): void {
        try {
            addTrackToPlaylist(playlistName, track);
            setFeedback({ message: `Added to "${playlistName}"`, ok: true });
        } catch {
            setFeedback({ message: 'Track already in playlist', ok: false });
        }
    }

    return createPortal(
        <div className="atpBackdrop" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <div className="atpCard card" onClick={e => e.stopPropagation()}>

                <div className="atpHeader">
                    <span className="atpTitle">Add to playlist</span>
                    <button className="icon atpClose" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <p className="atpTrackName">{track.trackName}</p>

                {feedback && (
                    <p className={`atpFeedback ${feedback.ok ? 'ok' : 'err'}`}>
                        {feedback.message}
                    </p>
                )}

                {playlists.length === 0 ? (
                    <p className="atpEmpty">You have no playlists yet. Create one on the Playlists page!</p>
                ) : (
                    <ul className="atpList">
                        {playlists.map(pl => (
                            <li key={pl.name}>
                                <button className="atpPlaylistBtn" onClick={() => handleAdd(pl.name)}>
                                    <span className="atpPlaylistName">{pl.name}</span>
                                    <span className="atpPlaylistCount">{pl.tracks.length} tracks</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>,
        document.body  //render the rest of the page outside the popup
    );
}