import {useState, useEffect} from 'react';
import type {Playlist} from "./playlist";

const LOCAL_STORAGE_LOCATION:string = "tunesPlaylists";

export function usePlaylistManager() {

    //state for export
    const [playlists, setPlaylists] = useState<Playlist[]>(JSON.parse(localStorage.getItem(LOCAL_STORAGE_LOCATION) as string) ?? []);

    //always keep playlists up to date with local storage
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_LOCATION, JSON.stringify(playlists));
    }, [playlists])

    //functions for export
    function createPlaylist(playlist:Playlist):void {

        //refuse to create playlists with duplicate names
        if (playlists.some(p => p.name === playlist.name)) {

            //duplicate found
            throw new Error("Cannot create playlists with duplicate names");
        }
        else setPlaylists(prev => [playlist, ...prev]);
    }

    function deletePlaylist(name:string) {
        setPlaylists(prev => prev.filter(p => p.name !== name));
    }

    return {
        playlists,
        createPlaylist,
        deletePlaylist,
    }
}