import React from 'react';
import PageHeader from "../../multiPage/PageHeader.tsx";
import GenericMarkupSection from "../../multiPage/GenericMarkupSection.tsx";
import {Link} from "react-router";

export default function Home():React.ReactElement {

    return (
        <React.Fragment>
            <PageHeader title={"Tinbob's Tunes"} subtitle={"Bangers made by Tinbob himself"} />

            {/*albums section*/}
            <GenericMarkupSection left={false} heading={"Albums"}>
                <p>
                    Over many years of writing music, I have created ten studio albums, with more coming in the future.
                    These range from the calming music of my Jungle album, to the yo-ho swashbuckling of "Buccaneers".
                    Be sure to <Link to={"/albums"}> have a look ay my albums!</Link>
                </p>
            </GenericMarkupSection>

            {/*singles section*/}
            <GenericMarkupSection left={true} heading={"Singles"}>
                <p>
                    I have created a plethora of singles in my time as a music producer. Over time, my technique has improved and the quality
                    of my music has steadily increased. Dive back into the retro sound of "8-Bit Havin' A Fit" or the new and polished
                    guitar solos of "Silicon Dreams"! <Link to={"/singles"}>If you want it, I got it here!</Link>
                </p>
            </GenericMarkupSection>

            {/*playlists section*/}
            <GenericMarkupSection left={false} heading={"Your Playlists"}>
                <p>
                    This app lets you create playlists to combine my songs into your own custom collections. Take a look
                    at the playlists you have created by <Link to={"/playlists"}>tapping here!</Link>
                </p>
            </GenericMarkupSection>

            {/*the story section*/}
            <GenericMarkupSection left={true} heading={"The Story"}>
                <p>
                    I started making music in October of 2022 with the launch of my first album: "Weasel Poppers" onto Spotify.
                    This was shortly followed by my next album, "Scare-E Tunes" in November of 2022. I then kept working on
                    albums and singles here and there. I then decided to release a single every single week on monday. This lasted
                    for just over a year before I rolled things back to only release every Month (so that I could work on the quality
                    of my produce). I peaked at 2437 monthly listeners on Spotify! One day I created a new bank account
                    and removed all money from my old account. This meant that when the bill for my spotify came round,
                    it was declined. My entire catalogue got deleted along with all my listeners. I wanted to get my music out
                    there again but didn't want to go through streaming services again and so I created this app for the few who can
                    find it!
                    <br/>
                    Enjoy your listening!
                </p>
            </GenericMarkupSection>
        </React.Fragment>
    )
}