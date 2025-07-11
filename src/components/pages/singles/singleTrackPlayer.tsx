import React, {useState, useEffect} from 'react';
import type single from './single';
import { Line } from 'rc-progress';
import secondsToMinutesAndSeconds from '../../../functions/secondsToMinuitesAndSeconds';

//import button images
import playButton from '../../../assets/images/buttons/play.svg';
import pauseButton from '../../../assets/images/buttons/pause.svg';
import repeatOneOnButton from '../../../assets/images/buttons/repeatOneOn.svg';
import repeatOneOffButton from '../../../assets/images/buttons/repeatOneOff.svg';
import stopButton from '../../../assets/images/buttons/stop.svg';
import rewindButton from '../../../assets/images/buttons/rewind.svg';

interface params {
    track:single;
};

export default function SingleTrackPlayer({track}:params):React.ReactElement {

    const [playing, setPlaying] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<[number, number]>([0, 0]);
    const [maxTime, setMaxTime] = useState<[number, number]>([0, 0]);
    const [repeatingOne, setRepeatingOne] = useState<boolean>(false);

    useEffect(() => {
        const audio:HTMLAudioElement = document.getElementById(track.frontendName) as HTMLAudioElement;
        audio.volume = 0.2;
        setMaxTime(secondsToMinutesAndSeconds(audio.duration))
        audio.addEventListener('ended', stopPlayback);

        //will fire once the audio has loaded the metadata (not the audio source)
        audio.onloadedmetadata = () => {
            audio.volume = 0.2;
            setMaxTime(secondsToMinutesAndSeconds(audio.duration));

            //also deal with the audio finishing
            audio.addEventListener('ended', stopPlayback);
        };
        
        //will fire every time the currentTime of the audio changes
        audio.ontimeupdate = function() {
            
            //update the elapsed time
            setElapsedTime(secondsToMinutesAndSeconds(audio.currentTime));
        };
    }, []);

    //keeps the ending behaviour of the track consistent with repeating one or not repeating one
    useEffect(() => {
        const audio:HTMLAudioElement = document.getElementById(track.frontendName) as HTMLAudioElement;
        if (audio) {
            if (repeatingOne) {
    
                //if we are repeating one
                audio.removeEventListener('ended', stopPlayback);
                audio.addEventListener('ended', rewind);
            }
            else {
    
                //if we are not repeating one
                audio.removeEventListener('ended', rewind);
                audio.addEventListener('ended', stopPlayback);
            };
        };
    }, [repeatingOne]);

    function togglePlayPause():void {
        const audio:HTMLAudioElement = document.getElementById(track.frontendName) as HTMLAudioElement;
        if (audio.paused) {

            //the audio is paused, play it
            try {
                audio.play();
                setPlaying(true);
            }
            catch(error) {
                setPlaying(false);
                throw error;
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
                throw error;
            };
        };
    };

    function stopPlayback():void {
        const audio:HTMLAudioElement = document.getElementById(track.frontendName) as HTMLAudioElement;
        audio.pause();
        audio.currentTime = 0;
        setElapsedTime([0, 0]);
        setPlaying(false);
    };

    function rewind():void {
        const audio:HTMLAudioElement = document.getElementById(track.frontendName) as HTMLAudioElement;
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
            <audio id={track.frontendName} preload={"metadata"}>
                <source src={`/audio/singles/${track.audioFileName}`} />
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
                                <Line percent={(((elapsedTime[0] * 60) + elapsedTime[1]) / ((maxTime[0] * 60) + maxTime[1])) * 100} strokeColor={'#51c276'} strokeWidth={12} trailColor='#333333' trailWidth={7} gapPosition={'top'} />
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