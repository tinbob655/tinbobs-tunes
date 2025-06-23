import React, {useEffect, useState} from 'react';

interface params {
    playlistName:string,
};

export default function Playlists({playlistName}:params):React.ReactElement {

    const [playlistTracks, setPlaylistTracks] = useState<Array<string>>([]);

    useEffect(() => {
        setPlaylistTracks(playlistName.split(' '));
    }, []);

    return (
        <React.Fragment>
            {playlistTracks}
        </React.Fragment>
    );
};