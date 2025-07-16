import type { playlistClass } from "../components/pages/playlists/playlistClass";

interface playlistData {
    name:string;
    description?:string;
    tracks:string[];
};

export default function savePlaylists(playlistArray:playlistClass[]):void {
    let tempPlaylists:playlistData[] = [];

    //generate an array which can be json stringified
    playlistArray.forEach((playlist) => {
        tempPlaylists.push(
            {
                name: playlist.name,
                description: playlist.description? playlist.description : '',
                tracks: playlist.tracks,
            },
        );
    });

    //save the array to localStorage
    localStorage.setItem('playlists', JSON.stringify(tempPlaylists));
};