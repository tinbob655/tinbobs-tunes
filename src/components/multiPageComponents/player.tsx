import React, {useState, useEffect} from 'react';
import '../../scss/player.scss';
import { Line } from 'rc-progress';

//all buttons required for player
import playButton from '../../assets/images/buttons/play.svg';
import pauseButton from '../../assets/images/buttons/pause.svg';
import rewindButton from '../../assets/images/buttons/rewind.svg';
import repeatOneOffButton from '../../assets/images/buttons/repeatOneOff.svg';
import repeatOneOnButton from '../../assets/images/buttons/repeatOneOn.svg';
import stopButton from '../../assets/images/buttons/stop.svg';
import type Album from '../pages/albums/album';
import secondsToMinutesAndSeconds from '../../functions/secondsToMinuitesAndSeconds';

interface params {
    audioName: string,
    trackName: string,
    albumData: Album,
};

export default function Player({trackName, audioName, albumData}:params):React.ReactElement {

    const [playing, setPlaying] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<[number, number]>([0, 0]);
    const [maxTime, setMaxTime] = useState<[number, number]>([0, 0]);
    const [repeatingOne, setRepeatingOne] = useState<boolean>(false);

    useEffect(() => {

        const audio = document.getElementById(trackName) as HTMLAudioElement;
        if (audio) {
    
            //will fire when the audio metadata is ready
            audio.onloadedmetadata = () => {
                audio.volume = 0.2;
    
                //set the length of the track
                setMaxTime(secondsToMinutesAndSeconds(audio.duration));
            };

            //create a function to keep the elapsed time up to date
            audio.ontimeupdate = function() {

                //update the elapsed time
                setElapsedTime(secondsToMinutesAndSeconds(audio.currentTime));

                //when the audio finishes, either stop or repeat it
                audio.addEventListener('ended', stopPlayback);
            };
        };
    }, []);

    useEffect(() => {
        const audio = document.getElementById(trackName) as HTMLAudioElement;
        if (audio) {
            if (repeatingOne) {
                audio.removeEventListener('ended', stopPlayback);
                audio.addEventListener('ended', rewind);
            }
            else {
                audio.removeEventListener('ended', rewind);
                audio.addEventListener('ended', stopPlayback);
            };
        };
    }, [repeatingOne]);

    function togglePlayPause():void {
        const audio = document.getElementById(trackName) as HTMLAudioElement;
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
        const audio = document.getElementById(trackName) as HTMLAudioElement;
        audio.pause();
        audio.currentTime = 0;
        setElapsedTime([0, 0]);
        setPlaying(false);
    };

    function rewind():void {
        const audio = document.getElementById(trackName) as HTMLAudioElement;
        audio.currentTime = 0;
        setElapsedTime([0, 0]);
        audio.play();
        setPlaying(true);
    };

    function toggleRepeatOne():void {
        setRepeatingOne(!repeatingOne);
    };

    return (
        <React.Fragment>
            <audio id={trackName} preload={"metadata"}>
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
                                    {elapsedTime[0]}:{elapsedTime[1] < 10 ? `0${elapsedTime[1]}` : elapsedTime[1]}
                                </p>
                            </td>
                            <td style={{width: '25%'}}>

                                {/*progress bar*/}
                                <Line percent={(((elapsedTime[0] * 60) + elapsedTime[1]) / ((maxTime[0] * 60) + maxTime[1])) * 100} strokeColor={'#51c276'} strokeWidth={5} trailColor='#333333' trailWidth={2} gapPosition={'top'} />
                            </td>
                            <td>

                                {/*max time*/}
                                <p>
                                    {maxTime[0]}:{maxTime[1] < 10 ? `0${maxTime[1]}` : maxTime[1]}
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
                                    <img src={!repeatingOne ? repeatOneOffButton : repeatOneOnButton} className="playerButtonImage" />
                                </button>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </React.Fragment>
    );
};