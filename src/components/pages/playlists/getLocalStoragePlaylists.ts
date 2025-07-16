import { playlistClass } from "./playlistClass";
import type { playlistData } from "./playlistDataInterface";

export default function getLocalStoragePlaylists():playlistClass[] {
    const localStoragePlaylists:playlistData[] = JSON.parse(localStorage.getItem('playlists') as string);
    let tempPlaylists:playlistClass[] = [];

    localStoragePlaylists.forEach((playlist) => {
        let playlistObject:playlistClass = new playlistClass(playlist.name, playlist.description);
        playlistObject.tracks = playlist.tracks;
        tempPlaylists.push(playlistObject);
    });

    return tempPlaylists;
};