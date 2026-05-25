export interface Track {
    fileName: string;
    trackName: string;
}

export interface PlayerProps {
    tracks: Track[];
    initialIndex?: number;
}