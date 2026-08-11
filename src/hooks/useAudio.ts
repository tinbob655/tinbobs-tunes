import {useState, useEffect, useRef, useCallback, type RefObject} from 'react';
import type {Track} from "../components/multiPage/player/playerTypes";
import {MediaSession, type MediaSessionAction} from "@capgo/capacitor-media-session";
import toDataUri from "../functions/toDataURI.ts";
import shuffleArray from "../functions/shuffleArray.ts";

//audio files are in public/audio
const AUDIO_BASE = '/audio/';

//number of section -> 10:00 (for example)
function formatTime(secs: number): string {
    if (!isFinite(secs) || secs < 0) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

interface exports {
    currentIndex: number;
    currentTrack: Track | undefined;
    isPlaying: boolean;
    progress: number;
    formattedCurrentTime: string;
    formattedDuration: string;

    selectTrack: (index:number, play?: boolean) => void;
    play: () => void;
    pause: () => void;
    stop: () => void;
    seek: (pct:number) => void;
    next: () => void;
    prev: () => void;
    shuffle: (enable: boolean) => void;
}

export function useAudioPlayer(foreignTracks:Track[], initialIndex = 0):exports {
    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [tracks, setTracks] = useState<Track[]>(foreignTracks);

    //gives stable access to elements
    const audioRef:RefObject<HTMLAudioElement | null>   = useRef<HTMLAudioElement | null>(null);
    const indexRef:RefObject<number> = useRef(initialIndex);
    const playingRef:RefObject<boolean> = useRef(false);
    const tracksRef:RefObject<Track[]> = useRef(tracks);
    const currentFileRef:RefObject<string | null> = useRef<string | null>(null);

    function shuffle(enable: boolean): void {
        const newTracks = enable ? shuffleArray(foreignTracks) : foreignTracks;
        const currentFile = currentFileRef.current;

        const newIndex: number = currentFile ? newTracks.findIndex(track => track.fileName === currentFile) : indexRef.current;

        tracksRef.current = newTracks;
        setTracks(newTracks);

        if (newIndex !== -1) {
            indexRef.current = newIndex;
            setCurrentIndex(newIndex);
        }
    }

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
        const fileName:string = tracksRef.current[index].fileName;
        if (play) {
            audio.src = AUDIO_BASE + fileName;
            currentFileRef.current = fileName;
        }
        else {
            audio.removeAttribute('src');
            audio.load();
            currentFileRef.current = null;
        }

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
            const fileName:string = tracksRef.current[indexRef.current].fileName;
            audio.src = AUDIO_BASE + fileName;
            currentFileRef.current = fileName;
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
            selectTrack(indexRef.current + 1);
    }, [selectTrack]);

    //rewinds playback
    const prev:() => void = useCallback(() => {

        //make sure we can actually rewind
        if (indexRef.current > 0) {

            if (currentTime < 5) {
                selectTrack(indexRef.current - 1);
            }
            else {
                setCurrentTime(0);
            }
        }
    }, [currentTime, selectTrack]);

    //keeps refs in sync with state
    useEffect(() => {
        indexRef.current = currentIndex;
        }, [currentIndex]);
    useEffect(() => {
        playingRef.current = isPlaying;

        //android play/pause in media session
        void MediaSession.setPlaybackState({
            playbackState: isPlaying ? 'playing' : 'paused',
        });
        }, [isPlaying]);
    useEffect(() => {
        tracksRef.current = tracks;
    }, [tracks]);

    //register action handlers
    useEffect(() => {
        const actions: [MediaSessionAction, () => void][] = [
            ['play', play],
            ['pause', pause],
            ['stop', stop],
            ['previoustrack', prev],
            ['nexttrack', next],
        ]

        actions.forEach((handlerInfo) => {
            void MediaSession.setActionHandler({action: handlerInfo[0]}, handlerInfo[1]);
        });

        void MediaSession.setActionHandler({action: 'seekto'}, (details) => {
            if (details?.seekTime) {
                seek((details.seekTime / duration) * 100);
            }
        })
    }, [play, pause, stop, prev, next, seek, duration]);

    //keep android media session's bar in sync
    useEffect(() => {
        if (duration === 0) return;
        void MediaSession.setPositionState({
            duration,
            playbackRate: 1,
            position: Math.min(currentTime, duration),
        })
    }, [currentTime, duration]);

    //android session metadata
    useEffect(() => {
        if (!isPlaying) return;
        const track = tracksRef.current[currentIndex];
        if (!track) return;

        const update = async ():Promise<void> => {
            const artworkSrc:string|undefined = track.artwork
                ? await toDataUri(track.artwork)
                : undefined;

            void MediaSession.setMetadata({
                title: track.trackName,
                artist: 'Tinbob',
                album: "Tinbob's Tunes",
                artwork: artworkSrc
                    ? [{ src: artworkSrc, sizes: '512x512', type: 'image/jpeg' }]
                    : undefined,
            });
        };

        void update();
    }, [currentIndex, isPlaying]);

    //when the tracks array changes we need to change the underlying track
    useEffect(() => {

        //if we have now got no tracks then stop everything
        if (tracks.length === 0) {
            stop();
            currentFileRef.current = null;
            return;
        }

        //otherwise, move the track along one
        const currentFile:string | null = currentFileRef.current;
        const existingIndex:number = currentFile
            ? tracks.findIndex(t => t.fileName === currentFile)
            : -1;
        const nextIndex:number = existingIndex !== -1
            ? existingIndex
            : Math.min(indexRef.current, tracks.length - 1);

        if (nextIndex !== indexRef.current) {
            indexRef.current = nextIndex;
            setCurrentIndex(nextIndex);
        }

        //update the underlying file
        const nextFile:string = tracks[nextIndex].fileName;
        if (currentFile !== nextFile) {
            if (playingRef.current) {
                selectTrack(nextIndex, playingRef.current);
            }
            else {
                currentFileRef.current = null;
            }
        }
    }, [selectTrack, stop, tracks]);

    //create our audio element
    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;
        audio.volume = 0.4;
        audio.preload = 'none';

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
                const nextFile:string = tracksRef.current[nextTrackIndex].fileName;
                audio.src = AUDIO_BASE + nextFile;
                currentFileRef.current = nextFile;
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

    //exports
    return {
        currentIndex,
        currentTrack: tracks[currentIndex],
        isPlaying,
        progress: duration > 0 ? (currentTime / duration) * 100 : 0,
        formattedCurrentTime: formatTime(currentTime),
        formattedDuration: formatTime(duration),
        play, pause, stop, seek,
        selectTrack, next, prev, shuffle,
    };
}