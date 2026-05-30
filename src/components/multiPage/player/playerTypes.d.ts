export interface Track {
    fileName: string;
    trackName: string;
    artwork?: string;
}

export interface PlayerProps {
    tracks: Track[];
    initialIndex?: number;
    playlistName?: string;
    autoLoad?: boolean;
}