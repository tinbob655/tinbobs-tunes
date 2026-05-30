import React, { useState } from 'react';
import type { Track } from "../player/playerTypes";
import { usePlaylist } from '../../../hooks/usePlaylist.ts';
import './addToPlaylistPopup.scss';
import Popup from "../popup/Popup.tsx";

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

    return (
        <Popup title={"Add to Playlist"} closeFunction={onClose}>
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
        </Popup>
    )
}