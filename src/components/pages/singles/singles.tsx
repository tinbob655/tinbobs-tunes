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

        singles.forEach((track:single) => {
            tempSinglesHTML.push(
                <React.Fragment>
                    <div className="dividerLine"></div>
                    
                    <h2 className="alignLeft">
                        {track.frontendName}
                    </h2>
                    <p className="alignLeft">
                        Released on {track.releaseDate.getDate()} / {track.releaseDate.getMonth()} / {track.releaseDate.getFullYear()}
                    </p>

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
            </p>

            {getSinglesHTML()}
        </React.Fragment>
    );
};