import {useState, useEffect, useRef, useCallback, type RefObject} from 'react';
import type {Track} from "../components/multiPage/player/playerTypes";

//audio files are in public/audio
const AUDIO_BASE = '/audio/';

//number of section -> 10:00 (for example)
function formatTime(secs: number): string {
    if (!isFinite(secs) || secs < 0) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export function useAudioPlayer(tracks: Track[], initialIndex = 0) {
    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    //gives stable access to elements
    const audioRef:RefObject<HTMLAudioElement | null>   = useRef<HTMLAudioElement | null>(null);
    const indexRef:RefObject<number> = useRef(initialIndex);
    const playingRef:RefObject<boolean> = useRef(false);
    const tracksRef:RefObject<Track[]> = useRef(tracks);

    //keeps refs in sync with state
    useEffect(() => {
        indexRef.current  = currentIndex;
        }, [currentIndex]);
    useEffect(() => {
        playingRef.current = isPlaying;
        }, [isPlaying]);
    useEffect(() => {
        tracksRef.current = tracks;
    }, [tracks]);

    //create our audio element
    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;

        //keep the elapsed time in sync
        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        //keep the total time of the track in sync
        audio.addEventListener('durationchange', () => {
            setDuration(isFinite(audio.duration) ? audio.duration : 0);
        });

        //when a track ends, play the next track
        audio.addEventListener('ended', () => {
            const nextTrackIndex:number = indexRef.current + 1;

            //if there is another track available
            if (nextTrackIndex < tracksRef.current.length) {
                indexRef.current = nextTrackIndex;
                setCurrentIndex(nextTrackIndex);
                setCurrentTime(0);
                audio.src = AUDIO_BASE + tracksRef.current[nextTrackIndex].fileName;
                audio.play().catch(() => {});
            }

            //if we reached the end of the Tracks[]
            else {
                setIsPlaying(false);
                playingRef.current = false;
                setCurrentTime(0);
            }
        });

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    //loads a file and optionally starts playing
    const selectTrack:(index:number, play?: boolean) => void = useCallback((index: number, play = true) => {

        //make sure we have an audio element
        const audio:HTMLAudioElement|null = audioRef.current;
        if (!audio) return;

        //set state values
        indexRef.current = index;
        setCurrentIndex(index);
        setCurrentTime(0);
        setDuration(0);

        //load up the next track
        audio.pause();
        audio.src = AUDIO_BASE + tracksRef.current[index].fileName;

        //we also have been told to play the music
        if (play) {
            audio.play().catch(() => {});
            setIsPlaying(true);
            playingRef.current = true;
        }

        //we don't need to play the music
        else {
            setIsPlaying(false);
            playingRef.current = false;
        }
    }, []);

    //plays music
    const play:() => void = useCallback(() => {

        //make sure we have an audio element
        const audio:HTMLAudioElement|null = audioRef.current;
        if (!audio) return;

        //if nothing is loaded, then load something
        if (!audio.src || audio.src === window.location.href) {
            audio.src = AUDIO_BASE + tracksRef.current[indexRef.current].fileName;
        }

        //play the audio
        audio.play().catch(() => {});
        setIsPlaying(true);
        playingRef.current = true;
    }, []);

    //pauses music
    const pause:() => void = useCallback(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
        playingRef.current = false;
    }, []);

    //resets music
    const stop:() => void = useCallback(() => {

        //make sure we have an audio element
        const audio:HTMLAudioElement|null = audioRef.current;
        if (!audio) return;

        //pause the music
        audio.pause();
        setIsPlaying(false);

        //reset the music
        audio.currentTime = 0;
        playingRef.current = false;
        setCurrentTime(0);
    }, []);

    //percentage -> progress bar's units
    const seek:(pct:number) => void = useCallback((pct: number) => {
        const audio = audioRef.current;
        if (!audio || !isFinite(audio.duration)) return;
        audio.currentTime = (pct / 100) * audio.duration;
    }, []);

    //advances playback
    const next:() => void = useCallback(() => {

        //make sure we can actually advance
        if (indexRef.current < tracksRef.current.length - 1)
            selectTrack(indexRef.current + 1, playingRef.current);
    }, [selectTrack]);

    //rewinds playback
    const prev:() => void = useCallback(() => {

        //make sure we can actually rewind
        if (indexRef.current > 0)
            selectTrack(indexRef.current - 1, playingRef.current);
    }, [selectTrack]);

    //exports
    return {
        currentIndex,
        isPlaying,
        progress: duration > 0 ? (currentTime / duration) * 100 : 0,
        formattedCurrentTime: formatTime(currentTime),
        formattedDuration: formatTime(duration),
        play, pause, stop, seek,
        selectTrack, next, prev,
    };
}