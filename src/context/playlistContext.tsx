import React, {createContext, useState, useEffect, type Context} from "react";
import type {Playlist} from "../components/pages/playlists/playlist";
import type {Track} from "../components/multiPage/player/playerTypes";

const LOCAL_STORAGE_KEY = 'tunesPlaylists';

interface PlaylistContextType {
    playlists: Playlist[];
    createPlaylist: (playlist: Playlist) => void;
    deletePlaylist: (name: string) => void;
    addTrackToPlaylist: (playlistName: string, track: Track) => void;
    removeTrackFromPlaylist: (playlistName: string, trackName:string) => void;
}

//create default playlist
const PlaylistContext:Context<PlaylistContextType> = createContext<PlaylistContextType>({
    playlists: [],
    createPlaylist: () => {},
    deletePlaylist: () => {},
    addTrackToPlaylist: () => {},
    removeTrackFromPlaylist: () => {},
});

function PlaylistProvider({children}: {children: React.ReactNode}):React.ReactElement {

    const [playlists, setPlaylists] = useState<Playlist[]>(() => {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '[]');
    });

    //keep playlists in sync with storage
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(playlists));
    }, [playlists]);

    //fires if another component wants to create a playlist
    function createPlaylist(playlist: Playlist): void {

        //disallow duplicates
        if (playlists.some(p => p.name === playlist.name)) {
            throw new Error("Cannot create playlists with duplicate names");
        }
        setPlaylists(prev => [playlist, ...prev]);
    }

    //fires if another component wants to delete a playlist
    function deletePlaylist(name: string): void {
        setPlaylists(prev => prev.filter(p => p.name !== name));
    }

    //fires if another component wants to add a track to a playlist
    function addTrackToPlaylist(playlistName: string, track: Track): void {
        setPlaylists(prev => prev.map(p => {
            if (p.name !== playlistName) return p;

            //reject duplicates
            if (p.tracks.some(t => t.fileName === track.fileName)) {
                throw new Error('Track already in playlist');
            }

            //otherwise add the track
            return { ...p, tracks: [...p.tracks, track] };
        }));
    }

    //fires if another component wants to remove a track from the playlist
    function removeTrackFromPlaylist(playlistName: string, trackTitle: string) {

        //make sure we have a matching playlist
        const playlistToEdit:Playlist|undefined = playlists.find((playlist) => playlist.name === playlistName);
        if (!playlistToEdit) throw new Error(`Could not find playlist: ${playlistName}`);

        //make sure the requested track is in that playlist
        const trackToDelete:Track|undefined = playlistToEdit.tracks.find((track) => track.trackName === trackTitle);
        if (!trackToDelete) throw new Error(`Could not find track: ${trackTitle} in playlist: ${playlistToEdit}`);

        //if we pass all that, delete the track
        setPlaylists(prev => prev.map(p => {
            if (p.name !== playlistName) return p;

            //filter out the unwanted track
            return {
                name: playlistName,
                tracks: p.tracks.filter(t => t.trackName !== trackTitle),
            };
        }));
    }

    return (
        <PlaylistContext.Provider value={{playlists, createPlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist}}>
            {children}
        </PlaylistContext.Provider>
);
}

export {PlaylistContext, PlaylistProvider};
export type { PlaylistContextType };
