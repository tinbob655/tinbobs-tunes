import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import { Link } from 'react-router-dom';

export default function Home():React.ReactElement {

    return (
        <React.Fragment>
            <PageHeader title={"Tinbob's Tunes"} subtitle={"Tinbob's top tunes since 2022!"} />

            <h2 className="alignRight">
                The Story
            </h2>
            <p className="alignRight">
                In 2022, I started making music. For many years up until 2025 I uploaded this music to Spotify, YouTube, ITunes, you name it. My listeners even peaked at 2,804. However, after these 3 years, I was getting tired of my music distributor requiring me to pay a yearly fee as well as wanting me to keep making a track a month. For these reasons, I decided to cut loose and stop uploading my music to these platforms. I have now created this app so that those who still want to listen can continue to do so for free.
                <br/><br/>
                This app will be updated with new music as I make it, which I will continue to do for the foreseeable future. I truly hop that you enjoy listening to my music as much as I enjoy creating it!
            </p>

            <div className="dividerLine"></div>

            <h2 className="alignLeft">
                The Music
            </h2>
            <p className="alignLeft">
                The majority of my music is released as signles however I have created a few albums over the years as well. My albums usually feature a collection of tracks which use similar / the same instruments and so have a similar feel to them. My singles range from fast paced electronic to pirate themed sea shanties.
            </p>
            <table style={{width: '80%'}}>
                <thead>
                    <tr>
                        <td>
                            <Link to='/singles'>
                                <h3 className="noVerticalSpacing">
                                    View my singles →
                                </h3>
                            </Link>
                        </td>
                        <td>
                            <Link to='/albums'>
                                <h3 className="noVerticalSpacing">
                                    View my albums →
                                </h3>
                            </Link>
                        </td>
                    </tr>
                </thead>
            </table>

            <div className="dividerLine"></div>

            <h2 className="alignRight">
                Create a Playlist
            </h2>
            <p className="alignRight">
                This app allows you to create as many of your own playlist as you would like. You can add any of my tracks and give your playlist a cool name and image. In playback, your playlist can be shuffled, looped and played in order. To get started, click below.
            </p>
            <Link to='/playlists'>
                <h3 className="noVerticalSpacing alignRight" style={{marginRight: '10%'}}>
                    Get started with playlists →
                </h3>
            </Link>
        </React.Fragment>
    );
};