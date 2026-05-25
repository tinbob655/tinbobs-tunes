import React, {useRef} from 'react';
import PageHeader from "../../multiPage/PageHeader.tsx";
import GenericMarkupSection from "../../multiPage/GenericMarkupSection.tsx";
import SinglePlaylist from "./SinglePlaylist.tsx";
import './playlist.scss';
import {usePlaylistManager} from "./usePlaylistManager.ts";
import type {Playlist} from "./playlist";

export default function Playlists():React.ReactElement {

    const {
        playlists,
        createPlaylist,
        deletePlaylist,
    } = usePlaylistManager();

    const newPlaylistRef= useRef<HTMLInputElement>(null);

    return (
        <React.Fragment>
            <PageHeader title={"Playlists"} subtitle={"View, create & modify your playlists"} />

            {/*user's playlists section*/}
            <GenericMarkupSection left={false} heading={"Your playlists"}>
                <p>
                    Here are all the playlists you have created:
                </p>

                {playlists.length > 0 ? (
                    <React.Fragment>
                        {playlists.map((playlist:Playlist) => {
                            const last:boolean = playlists.indexOf(playlist) === playlists.length -1;
                            return (
                                <SinglePlaylist inputPlaylist={playlist} deletePlaylist={deletePlaylist} key={playlist.name} last={last} />
                            )
                        })}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <p style={{fontSize: '13px', fontWeight: 'lighter'}}>
                            You haven't created any playlists yet!
                        </p>
                    </React.Fragment>
                )}
            </GenericMarkupSection>

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

        createPlaylist(newPlaylist);
    }
}