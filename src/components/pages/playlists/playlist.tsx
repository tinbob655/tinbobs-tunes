import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import { useLocation } from 'react-router-dom';
import { playlistClass } from './playlistClass';
import PopupWrapper from '../../multiPageComponents/popupWrapper';
import type {playlistData} from './playlistDataInterface';
import getLocalStoragePlaylists from './getLocalStoragePlaylists';
import savePlaylists from './savePlaylists';
import AllTracksDropDownList from '../../multiPageComponents/allTracksDropDownList';
import Player from '../../multiPageComponents/player';
import removeButton from '../../../assets/images/buttons/remove.svg';
import shuffleArray from '../../../functions/shuffleArray';
import PlayQueue from './playQueue';

//button images
import rewindImage from '../../../assets/images/buttons/rewind.svg';
import skipImage from '../../../assets/images/buttons/skip.svg';
import stopImage from '../../../assets/images/buttons/stop.svg';
import pauseImage from '../../../assets/images/buttons/pause.svg';
import playImage from '../../../assets/images/buttons/play.svg';

export default function Playlist():React.ReactElement {

    const location = useLocation();
    const playQueue = new PlayQueue();

    const [userPlaylist, setUserPlaylist] = useState<playlistClass>();
    const [playlistEditPopupHTML, setPlaylistEditPopupHTML] = useState<React.ReactElement>(<></>);
    const [addTracksPopupHTML, setAddTracksPopupHTML] = useState<React.ReactElement>(<></>);
    const [tracksHTML, setTracksHTML] = useState<React.ReactElement[]>([]);
    const [tracksList, setTracksList] = useState<string[]>([]);
    const [playlistPlaying, setPlaylistPlaying] = useState<boolean>(false);

    //when the component loads, make a playlistClass object and save it to state
    useEffect(() => {
        const playlistData:playlistData = JSON.parse(location.state.playlist);
        const allPlaylists = getLocalStoragePlaylists();

        //work out what index of allPlaylists this playlist is
        const index:number = allPlaylists.findIndex((playlist) => {
            if (playlist.name === playlistData.name) {
                return true;
            };
        });
        let tempPlaylist = allPlaylists[index];
        setUserPlaylist(tempPlaylist);
        setTracksList([...tempPlaylist.tracks]);
    }, []);

    //keeps the tracks html synced with tracks list
    useEffect(() => {
        let tempTracksHTML:React.ReactElement[] = [];
        let index:number = 0;
        const tracksArray = userPlaylist?.getTrackAudioFiles() as string[][];
        tracksList?.forEach((track) => {
            tempTracksHTML.push(
                <React.Fragment>
                    <table>
                        <thead>
                            <tr>
                                <td>
                                    <p className="alignLeft">
                                        {track}
                                    </p>
                                </td>
                                <td>
                                    <button type="button" onClick={() => {removeTrack(track)}}>
                                        <img src={removeButton} className="playerButtonImage" />
                                    </button>
                                </td>
                            </tr>
                        </thead>
                    </table>
                    <Player trackName={track} audioFileName={tracksArray[index][0]} albumName={tracksArray[index][1] === 'single' ? '' : tracksArray[index][1]} />
                </React.Fragment>
            );
            index++;
        });

        setTracksHTML(tempTracksHTML);
    }, [tracksList])

    //will open a popup to allow the user to edit their playlist
    function openPlaylistEditPopup(editType:string) {
        setPlaylistEditPopupHTML(
            <PopupWrapper closeFunc={() => {setPlaylistEditPopupHTML(<></>)}}>
                <React.Fragment>
                    <h2>
                        Edit playlist {editType}
                    </h2>

                    <div className="dividerLine"></div>

                    <form onSubmit={(event) => {editPlaylistFormSubmitted(event)}}>
                        <p className="aboveInput">
                            New playlist {editType}:
                        </p>
                        <input name={editType} type="text" placeholder={`${editType[0].toUpperCase()}${editType.slice(1)}...`} required/>
                        <input type="submit" className="submit" name="submit" value="Submit" />
                    </form>
                </React.Fragment>
            </PopupWrapper>
        );
    };

    //will fire once the user has made a playlist name or description edit
    function editPlaylistFormSubmitted(event:React.FormEvent) {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            name?: {value:string}
            description?: {value:string}
        };

        //only run if the playlist exists
        if (userPlaylist) {
            let playlistToEdit = userPlaylist;
            
            //get all of the user's playlists from localStorage
            let oldPlaylists = getLocalStoragePlaylists();

            //find the index of the playlist which has been changed (this one)
            let editIndex:number = -1;
            for (let i = 0; i < oldPlaylists.length; i++) {
                if (oldPlaylists[i].name === userPlaylist.name) {
                    editIndex = i;
                };
            };
            
            if (target.name) {

                //the user changed the name of the playlist
                playlistToEdit.name = target.name.value
            }
            else if (target.description) {

                //the user changed the name of the playlist
                playlistToEdit.description = target.description.value;
            }
            else {
                
                //invalid property changed
                throw new Error('Invalid property changed on playlist');
            };

            //we have now applied the playlist edit to playlistToEdit, need to save this to the backend and refresh the frontend
            if (editIndex != -1) {
                oldPlaylists[editIndex] = playlistToEdit;
                savePlaylists(oldPlaylists);
                setUserPlaylist(playlistToEdit);

                //close the popup
                document.querySelector('.popupWrapper')?.classList.remove('shown')
                setTimeout(() => {
                    setPlaylistEditPopupHTML(<></>);
                }, 800);
            }
        }
        else {

            //the playlist did not exist
            throw new Error('userPlaylist did not exist when playlist property was changed');
        };
    };

    //will open a popup to allow the user to add tracks to their playlist
    function openAddTracksPopup():void {
        setAddTracksPopupHTML(
            <PopupWrapper closeFunc={() => {setAddTracksPopupHTML(<></>)}}>
                <React.Fragment>
                    <h2>
                        Add track(s)
                    </h2>

                    <div className="dividerLine"></div>

                    <form onSubmit={(event) => {addTracksFormSubmitted(event)}}>
                        <p className="aboveInput">
                            Select track name:
                        </p>
                        <select name="trackNameToAdd" required>
                            <AllTracksDropDownList />
                        </select>

                        <input type="submit" className="submit" />
                    </form>
                </React.Fragment>
            </PopupWrapper>
        );
    };

    //will fire after the user has added a track to their playlist
    function addTracksFormSubmitted(event:React.FormEvent) {
        event.preventDefault();

        //get the frontend name of the track to add
        const target = event.target as typeof event.target & {
            trackNameToAdd: {value:string}
        };
        const trackNameToAdd:string = target.trackNameToAdd.value;

        //add this track to the array of tracks
        let oldPlaylist = userPlaylist as playlistClass;
        oldPlaylist?.addTrack(trackNameToAdd);

        //to update the backend, search for this playlist in the playlist array, replace it with the new version and save the new array
        let oldPlaylists = getLocalStoragePlaylists();
        let editIndex:number = -1;
        for (let i = 0; i < oldPlaylists.length; i++) {
            if (oldPlaylists[i].name === userPlaylist?.name) {
                editIndex = i;
            };
        };
        if (editIndex != -1) {

            //update this playlist in the array
            oldPlaylists[editIndex] = oldPlaylist;
            savePlaylists(oldPlaylists);
        };

        //also update the frontend
        setUserPlaylist(oldPlaylist);
        setTracksList([...oldPlaylist.tracks]);
        document.querySelector('.popupWrapper')?.classList.remove('shown');
        setTimeout(() => {
            setAddTracksPopupHTML(<></>);
        }, 800);
    };

    //will fire after the user clicks the button to remove a track from their playlist
    function removeTrack(trackName:string):void {

        //remove the track
        let oldPlaylist = userPlaylist as playlistClass;
        oldPlaylist.removeTrack(trackName);

        //update the backend
        let oldPlaylists = getLocalStoragePlaylists();
        let editIndex:number = -1;
        for (let i  = 0; i < oldPlaylists.length; i++) {
            if (oldPlaylists[i].name === oldPlaylist.name) {
                editIndex = i;
            };
        };
        if (editIndex === -1) {
            throw new Error('Could not find playlist to save while removing track');
        };
        
        //apply the edit
        oldPlaylists[editIndex] = oldPlaylist;

        //save
        savePlaylists(oldPlaylists);
        setUserPlaylist(oldPlaylist);
        setTracksList([...oldPlaylist.tracks]);
    };

    function playEntirePlaylist(shuffleBool:boolean):void {
        if (userPlaylist) {
            let tracks = userPlaylist.getTrackAudioFiles();

            //if we need to shuffle then randomly arrange the tracks
            if (shuffleBool) {
                tracks = shuffleArray(tracks);

            //also update the frontend
                document.getElementById('shuffleButtonText')?.classList.add('highlighted');
            }
            else {
                document.getElementById('playButtonText')?.classList.add('highlighted');
            }
            document.querySelector('.playlistControlsWrapper')?.classList.add('shown');
    
            //add each track to the play queue
            tracks.forEach((track) => {
                playQueue.queueTrack(track[0], track[1] === 'single' ? undefined : track[1]);
            });
            playQueue.play();
            setPlaylistPlaying(true);
        }

        else throw new Error('Could not find playlist');
    };

    return (
        <React.Fragment>
            <PageHeader title={userPlaylist ? userPlaylist.name : 'Loading...'} subtitle={userPlaylist ? userPlaylist.description : 'loading...'} />

            {/*edit playlist buttons*/}
            <table>
                <thead>
                    <tr>
                        <td>
                            <button type="button" onClick={() => {openPlaylistEditPopup('name')}}>
                                <h3>
                                    Change playlist name
                                </h3>
                            </button>
                        </td>
                        <td>
                            <button type="button" onClick={() => {openPlaylistEditPopup('description')}}>
                                <h3>
                                    Change playlist description
                                </h3>
                            </button>
                        </td>
                    </tr>
                </thead>
            </table>

            <div className="dividerLine"></div>

            {/*play entire playlist section*/}
            <table>
                <thead>
                    <tr>
                        <td>
                            <button type="button" onClick={() => {playEntirePlaylist(false)}}>
                                <h3 id="playButtonText" className="buttonText">
                                    Listen to this playlist
                                </h3>
                            </button>
                        </td>
                        <td>
                            <button type="button" onClick={() => {playEntirePlaylist(true)}}>
                                <h3 id="shuffleButtonText" className="buttonText">
                                    Listen to this playlist on shuffle
                                </h3>
                            </button>
                        </td>
                    </tr>
                </thead>
            </table>
            <div className="playlistControlsWrapper">
                <table>
                    <thead>
                        <tr>
                            <td>

                                {/*playlist play/pause button */}
                                <button type="button" onClick={() => {setPlaylistPlaying(playQueue.playPause())}}>
                                    <img src={playlistPlaying ? pauseImage : playImage} className="playerButtonImage" />
                                </button>
                            </td>
                            <td>
                                
                                {/*playlist rewind button*/}
                                <button type="button" onClick={() => {playQueue.rewind()}} >
                                    <img src={rewindImage} className="playerButtonImage" />
                                </button>
                            </td>
                            <td>

                                {/*playlist skip button*/}
                                <button type="button" onClick={() => {playQueue.skip()}}>
                                    <img src={skipImage} className="playerButtonImage" />
                                </button>
                            </td>
                            <td>

                                {/*playlist stop button */}
                                <button type="button" onClick={() => {playQueue.stop()}}>
                                    <img src={stopImage} className="playerButtonImage" />
                                </button>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>

            <div className="dividerLine"></div>

            {/*playlist tracks*/}
            <h2 className="alignLeft">
                Tracks:
            </h2>
            {tracksHTML}

            <button type="button" onClick={openAddTracksPopup}>
                <h3>
                    Add Track(s)
                </h3>
            </button>

            {/*popups for later use*/}
            {playlistEditPopupHTML}
            {addTracksPopupHTML}
        </React.Fragment>
    );
};