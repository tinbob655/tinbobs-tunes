import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import { Link } from 'react-router-dom';

interface playlist {
    name:string;
    description?:string;
    tracks:[string, string][];
};

const testData:playlist[] = [
    {
        name: 'Test playlist',
        tracks: [
            [
                'Cut it Out',
                'cutItOut.flac'
            ],
            [
                'Bloom',
                'bloom.flac',
            ],
            
        ],
        description: 'A playlist to test the playlist system while in development',
    },
];

export default function Playlists():React.ReactElement {

    const [playlistHTML, setPlaylistHTML] = useState<React.ReactElement[]|React.ReactElement>([]);

    useEffect(() => {
        let userPlaylists:playlist[];

        //gives the option to use test data rather than having to use localStorage during development
        if (testData) {
            userPlaylists = testData;
        }
        else {
            userPlaylists = JSON.parse(sessionStorage.getItem('playlists') as string);
        };

        //if userPlaylists does not exist then the user must have no playlists
        if (!userPlaylists || userPlaylists.length < 1) {
            setPlaylistHTML(
                <p>
                    You haven't created any playlists yet!
                </p>
            );
        }
        else {

            //the user has at least one playlist
            let tempPlaylistHTML:React.ReactElement[] = [];
            userPlaylists.forEach((singlePlaylist:playlist) => {
                tempPlaylistHTML.push(
                    <React.Fragment>
                        <Link to={'/playlist'} state={{tracks: singlePlaylist.tracks, name: singlePlaylist.name, description: singlePlaylist.description}}>
                            <h2 className="alignLeft">
                                {singlePlaylist.name}
                            </h2>
                            <p className="alignLeft">
                                {singlePlaylist.description}
                            </p>
                        </Link>

                        <div className="dividerLine"></div>
                    </React.Fragment>
                );
            });

            setPlaylistHTML(tempPlaylistHTML);
        };
    }, []);

    function createPlaylist():void {
        console.log('Playlist create button clicked');
    };

    return (
        <React.Fragment>
            <PageHeader title="Playlists" subtitle="Fully-fledged playlist functionality" />

            <h2 className="alignRight">
                Your playlists
            </h2>
            <p className="alignRight">
                Playlists you have created will be shown below. To create a new playlist, select the 'Create a playlist +' button at the bottom of the page.
            </p>

            <div className="dividerLine"></div>

            {playlistHTML}

            <button onClick={() => {createPlaylist()}} type="button">
                <h3>
                    Create a playlist +
                </h3>
            </button>
        </React.Fragment>
    );
};