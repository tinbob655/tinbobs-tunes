import React, {useRef, useState} from 'react';
import PageHeader from "../../multiPage/PageHeader.tsx";
import GenericMarkupSection from "../../multiPage/GenericMarkupSection.tsx";
import SinglePlaylist from "./SinglePlaylist.tsx";
import './playlist.scss';
import type {Playlist} from "./playlist";
import {usePlaylist} from "../../../hooks/usePlaylist.ts";

export default function Playlists():React.ReactElement {

    const {
        playlists,
        createPlaylist,
        deletePlaylist,
    } = usePlaylist();

    const newPlaylistRef= useRef<HTMLInputElement>(null);

    const [newPlaylistErrorMessage, setNewPlaylistErrorMessage] = useState<string>('');

    return (
        <React.Fragment>
            <PageHeader title={"Playlists"} subtitle={"View, create & modify your playlists"} />

            {/*user's playlists section*/}
            {playlists.length > 0 && (
                <GenericMarkupSection left={false} heading={"Your playlists"}>
                    <p>
                        Here are all the playlists you have created:
                    </p>

                    {playlists.map((playlist:Playlist) => {
                        const last:boolean = playlists.indexOf(playlist) === playlists.length -1;
                        return (
                            <SinglePlaylist inputPlaylist={playlist} deletePlaylist={deletePlaylist} key={playlist.name} last={last} />
                        )
                    })}
                </GenericMarkupSection>
            )}

            {/*create new playlist section*/}
            <GenericMarkupSection left={true} heading={"Create a Playlist"} >
                <p>
                    Creating a new playlist is easy, just use the form below:
                </p>
                <form onSubmit={(event) => {createPlaylistFormSubmitted(event)}}>
                    <p>
                        Give your new playlist a name:
                    </p>
                    <input
                        name={"name"}
                        type={"text"}
                        placeholder={"Playlist name..."}
                        required
                        maxLength={20}
                        ref={newPlaylistRef}
                        autoComplete={"off"}
                    />
                    <input type={"submit"} value={"Submit"} />
                    <p className={"error"} style={{float: 'right'}}>
                        {newPlaylistErrorMessage}
                    </p>
                </form>
            </GenericMarkupSection>
        </React.Fragment>
    )

    //fires when the user creates a new playlist
    function createPlaylistFormSubmitted(event: React.SubmitEvent<HTMLFormElement>):void {

        //make sure input was valid
        event.preventDefault();
        if (!newPlaylistRef.current) {
            throw new Error("Invalid form submission")
        }
        const name:string = newPlaylistRef.current.value;
        if (!name) {
            throw new Error("Cannot create a playlist with no name");
        }
        else if (name.length > 20) {
            throw new Error("Playlist name is too long");
        }

        //create the playlist
        const newPlaylist:Playlist = {
            name: name,
            tracks: [],
        };

        //fail cleanly
        try {
            createPlaylist(newPlaylist);
            setNewPlaylistErrorMessage('');
        }
        catch(e) {
            setNewPlaylistErrorMessage("Failed to create playlist");
            console.error(e);
        }
    }
}