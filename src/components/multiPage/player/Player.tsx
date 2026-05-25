import React from 'react';
import './player.scss';
import type {PlayerProps, Track} from "./playerTypes";
import {useAudioPlayer} from "../../../hooks/useAudio.ts";

//import all button images
import playButton from '../../../assets/images/buttons/play.svg';
import pauseButton from '../../../assets/images/buttons/pause.svg';
import stopButton from '../../../assets/images/buttons/stop.svg';
import skipButton from '../../../assets/images/buttons/skip.svg';
import rewindButton from '../../../assets/images/buttons/rewind.svg';

export default function Player({ tracks, initialIndex = 0 }: PlayerProps): React.ReactElement {

    const {
        currentIndex,
        isPlaying,
        progress,
        formattedCurrentTime,
        formattedDuration,
        play, pause, stop, seek,
        selectTrack, next, prev,
    } = useAudioPlayer(tracks, initialIndex);

    const track:Track  = tracks[currentIndex];
    const isFirst:boolean = currentIndex === 0;
    const isLast:boolean  = currentIndex === tracks.length - 1;

    function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
        const rect:DOMRect = e.currentTarget.getBoundingClientRect();
        seek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
    }

    return (
        <div className="player card">

            {/*header and track counter*/}
            <div className="playerHeader">
                <span className="playerNowLabel">♪ NOW PLAYING</span>
                <span className="playerCounter">{currentIndex + 1} / {tracks.length}</span>
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
                            className={`playerTrackItem${i === currentIndex ? ' active' : ''}`}
                            onClick={() => selectTrack(i)}
                        >
                            <span className="playerTrackNum">{i + 1}</span>
                            <span className="playerTrackTitle">{t.trackName}</span>

                            {/*play an animation next to currently playingTrack*/}
                            {i === currentIndex && isPlaying && (
                                <span className="playerBars" aria-hidden="true">
                                    <span /><span /><span />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}