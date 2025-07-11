import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import singlesData from './singlesData.json';
import single from './single';
import SingleTrackPlayer from './singleTrackPlayer';

export default function Singles():React.ReactElement {

    function getSinglesHTML():React.ReactElement[] {
        let tempSinglesHTML:React.ReactElement[] = [];

        //create an array of instantiated 'single' objects from singlesData
        let singles:single[] = [];
        singlesData.forEach((jsonSingle) => {
            singles.push(new single(jsonSingle.frontendName, jsonSingle.fileName, jsonSingle.releaseDate));
        });

        //now we need to sort the singles array in order of newest release date to oldest release date
        singles.sort((a:single, b:single):number => {
            const firstDate:Date = a.releaseDate;
            const secondDate:Date = b.releaseDate;

            if (firstDate > secondDate) {

                //the first value is older than the second value
                return -1;
            }
            else {

                //the second value is older than the first value
                return 1;
            };
        });

        singles.forEach((track:single) => {

            //for every single, create a HTML section including a player
            tempSinglesHTML.push(
                <React.Fragment>
                    <div className="dividerLine"></div>

                    <table>
                        <thead>
                            <tr>
                                <td style={{width: '75%'}}>
                                    <h2 className="alignLeft" style={{marginTop: 0, paddingTop: 0}}>
                                        {track.frontendName}
                                    </h2>
                                    <p className="alignLeft">
                                        Released on {track.releaseDate.getDate()} / {track.releaseDate.getMonth()} / {track.releaseDate.getFullYear()}
                                    </p>
                                </td>
                                <td>
                                    <img src={`/images/singlesCovers/${track.artworkFileName}`} className="artworkImage" />
                                </td>
                            </tr>
                        </thead>
                    </table>
                    

                    <SingleTrackPlayer track={track} />
                </React.Fragment>
            );
        });

        return tempSinglesHTML;
    };

    return (
        <React.Fragment>
            <PageHeader title="Singles" subtitle="All my singles to date" />

            <h2 className="alignRight">
                My Singles
            </h2>
            <p className="alignRight">
                My release schedule for singles has changed over the years. Originally I made singles whenever I felt like it. After this, I switched to making one single per week, like clockwork. This got very tiring after a while and so I decided to release content once per month instead. This balance has lasted up until the creation of this app.
                <br/>
                <br/>
                <b>
                    Singles are displayed from newest to oldest
                </b>
            </p>

            {getSinglesHTML()}
        </React.Fragment>
    );
};