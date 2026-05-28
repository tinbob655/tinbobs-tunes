import React, {useEffect, useState} from 'react';
import './player.scss';
import type {PlayerProps, Track} from "./playerTypes";
import {useAudioPlayer} from "../../../hooks/useAudio.ts";
import {Link} from "react-router";
import AddToPlaylistPopup from "../addToPlaylistPopup/AddToPlaylistPopup.tsx";

//import all button images
import playButton from '../../../assets/images/buttons/play.svg';
import pauseButton from '../../../assets/images/buttons/pause.svg';
import stopButton from '../../../assets/images/buttons/stop.svg';
import skipButton from '../../../assets/images/buttons/skip.svg';
import rewindButton from '../../../assets/images/buttons/rewind.svg';
import {usePlaylist} from "../../../hooks/usePlaylist.ts";

export default function Player({ tracks, initialIndex = 0, playlistName }: PlayerProps): React.ReactElement {

    const {
        currentIndex,
        isPlaying,
        progress,
        formattedCurrentTime,
        formattedDuration,
        play, pause, stop, seek,
        selectTrack, next, prev,
    } = useAudioPlayer(tracks, initialIndex);

    const [showAddPopup, setShowAddPopup] = useState<boolean>(false);
    const {removeTrackFromPlaylist} = usePlaylist();

    //always keep the current track in sync with the current index
    useEffect(() => {
        if (tracks.length === 0) {
            stop();
            return;
        }

        if (currentIndex >= tracks.length) {
            selectTrack(tracks.length - 1, false);
        }
    }, [tracks.length, currentIndex, selectTrack, stop]);

    function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
        const rect:DOMRect = e.currentTarget.getBoundingClientRect();
        seek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
    }

    //it is possible that there are no tracks to play
    if (tracks.length === 0) return (
        <React.Fragment>
            <p>
                This playlist is empty! To add tracks just visit
                the <Link to={"/albums"}>albums</Link> or <Link to={"/singles"}>singles</Link> pages.
            </p>
        </React.Fragment>
    );

    const safeIndex:number = Math.min(currentIndex, tracks.length - 1);
    const track:Track = tracks[safeIndex];
    const isFirst:boolean = safeIndex === 0;
    const isLast:boolean  = safeIndex === tracks.length - 1;

    return (
        <div className="player card">

            {/*header and track counter*/}
            <div className="playerHeader">
                <span className="playerNowLabel">♪ NOW PLAYING</span>
                <span className="playerCounter">{safeIndex + 1} / {tracks.length}</span>
            </div>

            {/*track name*/}
            <p className="playerTrackName">{track.trackName}</p>

            {/*progress bar*/}
            <div className="playerProgressBar" onClick={handleProgressClick}>
                <div className="playerProgressTrack">
                    <div className="playerProgressFill" style={{ width: `${progress}%` }} />
                    <div className="playerProgressThumb" style={{ left: `${progress}%` }} />
                </div>
            </div>

            {/*time information*/}
            <div className="playerTime">
                <span>{formattedCurrentTime}</span>
                <span>{formattedDuration}</span>
            </div>

            {/*track transport controls*/}
            <div className="playerControls">

                {/*rewind*/}
                <button
                    className="icon playerBtn"
                    onClick={() => prev()}
                    disabled={isFirst}
                    aria-label="Previous track"
                >
                    <img src={rewindButton} alt={"Rewind button"} />
                </button>

                {/*play / pause*/}
                {isPlaying ? (
                    <button
                        className="icon playerBtn playerBtnPrimary"
                        aria-label="Pause"
                        onClick={() => pause()}
                    >
                        <img src={pauseButton} alt={"Pause button"} />
                    </button>
                ) : (
                    <button
                        className="icon playerBtn playerBtnPrimary"
                        onClick={() => play()}
                        aria-label="Play"
                    >
                        <img src={playButton} alt={"Play button"} />
                    </button>
                )}

                {/*stop*/}
                <button
                    className="icon playerBtn playerBtnStop"
                    onClick={() => {stop()}}
                    aria-label="Stop"
                >
                    <img src={stopButton} alt={"Stop button"} />
                </button>

                {/* add to playlist */}
                <button
                    className="icon playerBtn"
                    onClick={(e:React.MouseEvent) => {
                        e.stopPropagation();
                        setShowAddPopup(true)
                    }}
                    aria-label="Add to playlist"
                >
                    <span style={{ fontSize: '20px', color: '#e3e3e3', lineHeight: 1 }}>+</span>
                </button>

                {/*skip*/}
                <button
                    className="icon playerBtn"
                    onClick={() => {next()}}
                    disabled={isLast}
                    aria-label="Next track"
                >
                    <img src={skipButton} alt={"Skip button"} />
                </button>
            </div>

            {/*track list (only if there is one more than one track)*/}
            {tracks.length > 1 && (
                <div className="playerTracklist">
                    {tracks.map((t, i) => (
                        <button
                            key={t.fileName}
                            className={`playerTrackItem${i === safeIndex ? ' active' : ''}`}
                            onClick={() => selectTrack(i)}
                        >
                            <span className="playerTrackNum">{i + 1}</span>
                            <span className="playerTrackTitle">{t.trackName}</span>

                            {/*show a "remove from playlist" button if we are in a playlist*/}
                            {playlistName && (
                                <span
                                    className={"playerXIcon"}
                                    onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
                                        event.stopPropagation();
                                        removeTrackFromPlaylist(playlistName, t.trackName);
                                    }}
                                >✕</span>
                            )}

                            {/*play an animation next to currently playingTrack*/}
                            {i === safeIndex && isPlaying && (
                                <span className="playerBars" aria-hidden="true">
                                    <span /><span /><span />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {showAddPopup && (
                <AddToPlaylistPopup
                    track={track}
                    onClose={() => setShowAddPopup(false)}
                />
            )}
        </div>
    );
}