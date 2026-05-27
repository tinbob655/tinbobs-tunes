import React, {createContext, useState, useEffect, type Context} from "react";
import type {Playlist} from "../components/pages/playlists/playlist";

const LOCAL_STORAGE_KEY = 'tunesPlaylists';

interface PlaylistContextType {
    playlists: Playlist[];
    createPlaylist: (playlist: Playlist) => void;
    deletePlaylist: (name: string) => void;
}

//create default playlist
const PlaylistContext:Context<PlaylistContextType> = createContext<PlaylistContextType>({
    playlists: [],
    createPlaylist: () => {},
    deletePlaylist: () => {},
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

    return (
        <PlaylistContext.Provider value={{playlists, createPlaylist, deletePlaylist}}>
            {children}
        </PlaylistContext.Provider>
);
}

export {PlaylistContext, PlaylistProvider};
export type { PlaylistContextType };
