import React, {useState, useEffect} from 'react';
import { Line } from 'rc-progress';
import secondsToMinutesAndSeconds from '../../functions/secondsToMinuitesAndSeconds';
import '../../scss/player.scss';

//import all button images
import playButton from '../../assets/images/buttons/play.svg';
import pauseButton from '../../assets/images/buttons/pause.svg';
import stopButton from '../../assets/images/buttons/stop.svg';
import rewindButton from '../../assets/images/buttons/rewind.svg';
import repeatOneOnButton from '../../assets/images/buttons/repeatOneOn.svg';
import repeatOneOffButton from '../../assets/images/buttons/repeatOneOff.svg';

interface params {
    audioFileName:string;
    trackName:string;
    albumName?:string
};

export default function Player({audioFileName, trackName, albumName}:params):React.ReactElement {

    const [playing, setPlaying] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<[number, number]>([0, 0]);
    const [maxTime, setMaxTime] = useState<[number, number]>([0, 0]);
    const [repeatingOne, setRepeatingOne] = useState<boolean>(false);

    useEffect(() => {
        const audio = getAudioElement();
        audio.volume = 0.2;
        setMaxTime(secondsToMinutesAndSeconds(audio.duration));

        //when the audio finishes, stop it
        audio.addEventListener('ended', stopPlayback);

        audio.onloadedmetadata = () => {
            audio.volume = 0.2;
            setMaxTime(secondsToMinutesAndSeconds(audio.duration));
            audio.addEventListener('ended', stopPlayback);
        };

        audio.ontimeupdate = function() {
            setElapsedTime(secondsToMinutesAndSeconds(audio.currentTime));
        };
    }, []);

    useEffect(() => {
        const audio = getAudioElement();
        if (repeatingOne) {

            //if we are repeating one then remove the stop event listener and add a rewind one
            audio.removeEventListener('ended', stopPlayback);
            audio.addEventListener('ended', rewind);
        }
        else {

            //if we are not repeating one then remove the rewind event listener and add a stop one
            audio.removeEventListener('ended', rewind);
            audio.addEventListener('ended', stopPlayback);
        };
    }, [repeatingOne]);

    function getAudioElement():HTMLAudioElement {
        const audio:HTMLAudioElement = document.getElementById(trackName) as HTMLAudioElement;
        if (audio) {
            return audio
        }
        else throw new Error(`Could not locate audio element with the id: ${trackName}`);
    };

    function togglePlayPause():void {
        const audio = getAudioElement();
        if (audio.paused) {

            //audio is paused, need to play it
            try {
                audio.play();
                setPlaying(true);
            }
            catch(error) {
                setPlaying(false);
                throw error;
            };
        }
        else {

            //audio is playing, need to pause it
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
        const audio = getAudioElement();
        audio.pause();
        audio.currentTime = 0;
        setElapsedTime([0, 0]);
        setPlaying(false);
    };

    function rewind():void {
        const audio = getAudioElement();
        audio.currentTime = 0;
        audio.play();
        setPlaying(true);
        setElapsedTime([0, 0]);
    };

    function toggleRepeatOne():void {
        setRepeatingOne(!repeatingOne);
    };

    return (
        <React.Fragment>
            <audio id={trackName} preload={"metadata"}>
                <source src={`/audio/${albumName ? `albums/${albumName}` : 'singles'}/${audioFileName}`} />
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
} ;