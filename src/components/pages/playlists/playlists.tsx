import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import { Link } from 'react-router-dom';
import { playlistClass } from './playlistClass';
import removeButton from '../../../assets/images/buttons/remove.svg';
import savePlaylists from './savePlaylists';
import getLocalStoragePlaylists from './getLocalStoragePlaylists';

export default function Playlists():React.ReactElement {

    const [userPlaylists, setUserPlaylists] = useState<playlistClass[]>([]);
    const [playlistHTML, setPlaylistHTML] = useState<React.ReactElement[]>([]);

    useEffect(() => {

        //when the page loads, fetch the user's playlists from localStorage
        const playlists = getLocalStoragePlaylists();
        if (playlists && playlists.length > 0) {
            setUserPlaylists(playlists);
        };
    }, [])

    //keeps the playlists section up to date with 
    useEffect(() => {
        let tempPlaylistsHTML:React.ReactElement[] = [];

        if (userPlaylists && userPlaylists.length >= 1) {

            //the user has at least one playlist, generate markup for each playlist
            userPlaylists.forEach((playlist) => {
                tempPlaylistsHTML.push(
                    <React.Fragment>
                        <table>
                            <thead>
                                <tr>
                                    <td style={{width: '66%'}}>
                                        <Link to='/playlist' state={{playlist: playlist.playlistToString()}} >
                                            <h2 className="alignLeft">
                                                {playlist.name}
                                            </h2>
                                            <p className="alignLeft" style={{marginBottom: '50px'}}>
                                                {playlist.description}
                                            </p>
                                        </Link>
                                    </td>
                                    <td>
                                        <button type="button" style={{padding: '20px'}} onClick={(() => {deletePlaylist(playlist)})}>
                                            <img src={removeButton} className="playerButtonImage" />
                                        </button>
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </React.Fragment>
                );
            });
        }
        else {

            //the user has not made a playlist, display this
            tempPlaylistsHTML.push(
                <React.Fragment>
                    <h2 className="alignLeft">
                        You haven't made any playlists yet!
                    </h2>
                </React.Fragment>
            );
        };

        setPlaylistHTML(tempPlaylistsHTML);
    }, [userPlaylists]);

    function createNewPlaylist():void {

        //create the new playlist and add it to the array of existing playlists
        let oldPlaylists = userPlaylists;
        const newPlaylist = new playlistClass(`New Playlist #${Math.floor(Math.random() * 100)}`, '');
        oldPlaylists.push(newPlaylist);

        //update local storage with the new playlist
        savePlaylists(oldPlaylists);

        //finally, update the frontend
        setUserPlaylists([...oldPlaylists]);
    };

    function deletePlaylist(playlistToDelete:playlistClass) {
        let oldPlaylists = userPlaylists;

        //first delete the element to delete
        const deletionIndex:number = oldPlaylists.indexOf(playlistToDelete);
        if (deletionIndex === -1) {
            throw new Error('Playlist to delete was not a member of userPlaylists');
        };
        oldPlaylists.splice(deletionIndex, 1);

        //update local storage
        savePlaylists(oldPlaylists);

        //finally, update the frontend
        setUserPlaylists([...oldPlaylists]);
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

            <div className="dividerLine"></div>

            <button onClick={() => {createNewPlaylist()}} type="button">
                <h3>
                    Create new playlist +
                </h3>
            </button>
        </React.Fragment>
    );
};