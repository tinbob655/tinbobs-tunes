import React, {useState, useEffect} from 'react';
import '../../scss/player.scss';

//all buttons required for player
import playButton from '../../assets/images/buttons/play.svg';
import pauseButton from '../../assets/images/buttons/pause.svg';
import rewindButton from '../../assets/images/buttons/rewind.svg';
import repeatOneOffButton from '../../assets/images/buttons/repeatOneOff.svg';
import repeatOneOnButton from '../../assets/images/buttons/repeatOneOn.svg';
import stopButton from '../../assets/images/buttons/stop.svg';
import type Album from '../pages/albums/album';

interface params {
    audioName: string,
    trackName: string,
    albumData: Album,
};

export default function Player({trackName, audioName, albumData}:params):React.ReactElement {

    const [playing, setPlaying] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [maxTime, setMaxTime] = useState<number>(0);
    const [repeatingOne, setRepeatingOne] = useState<boolean>(false);

    //setup audio element
    const audio:HTMLAudioElement = new Audio(`/audio/albums/${albumData.parentAlbum}/${audioName}`);
    audio.volume = 0.2;
    
    useEffect(() => {
        console.log(audio.currentTime);
    }, []);

    function togglePlayPause():void {
        if (audio.paused) {

            //the audio is paused, play it
            try {
                audio.play();
                setPlaying(true);
            }
            catch(error) {
                setPlaying(false);
                throw (error)
            }
        }
        else {

            //the audio is playing, pause it
            try {
                audio.pause();
                setPlaying(false);
            }
            catch(error) {
                setPlaying(true);
                throw (error)
            };
        };
    };

    function stopPlayback():void {
    };

    function rewind():void {
    };

    function toggleRepeatOne():void {
    };

    return (
        <React.Fragment>
            <audio id={trackName}>
                <source src={`/audio/albums/${albumData.parentAlbum}/${audioName}`} />
            </audio>
            <div className="playerWrapper">
                <table>
                    <thead>
                        <tr>
                            <td>

                                {/*pause / play button*/}
                                <button onClick={togglePlayPause} type="button">
                                    <img src={playing ? pauseButton : playButton} className="playerButtonImage" />
                                </button>
                            </td>
                            <td>

                                {/*elapsed time */}
                                <p>
                                    {elapsedTime}
                                </p>
                            </td>
                            <td style={{width: '25%'}}>

                                {/*progress bar*/}
                                <progress max={maxTime} value={elapsedTime} />
                            </td>
                            <td>

                                {/*max time*/}
                                <p>
                                    {maxTime}
                                </p>
                            </td>
                            <td>

                                {/*stop button*/}
                                <button onClick={stopPlayback} type="button">
                                    <img src={stopButton} className="playerButtonImage" />
                                </button>
                            </td>
                            <td>

                                {/*rewind button*/}
                                <button onClick={rewind} type="button">
                                    <img src={rewindButton} className="playerButtonImage" />
                                </button>
                            </td>
                            <td>

                                {/*repeat one button*/}
                                <button onClick={toggleRepeatOne} type="button">
                                    <img src={repeatingOne ? repeatOneOffButton : repeatOneOnButton} className="playerButtonImage" />
                                </button>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </React.Fragment>
    );
};