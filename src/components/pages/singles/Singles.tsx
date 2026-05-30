import React from 'react';
import PageHeader from "../../multiPage/PageHeader.tsx";
import rawSinglesData from '../../../assets/singlesData.json' with {type: "JSON"}
import Player from "../../multiPage/player/Player.tsx";
import type {Track} from "../../multiPage/player/playerTypes";
import parseDate from "../../../functions/parseDate.ts";

interface Single {
    frontendName: string;
    fileName: string;
    releaseDate: string;
}

export default function Singles():React.ReactElement {

    return (
        <React.Fragment>
            <PageHeader title={"Singles"} subtitle={"All my singles to date"} />

            {[...rawSinglesData]
                .sort((a, b) => {
                    return parseDate(b.releaseDate) - parseDate(a.releaseDate)
                })
                .map((single:Single):React.ReactElement => {

                //single -> track
                const track:Track = {
                    fileName: `singles/${single.fileName}`,
                    trackName: single.frontendName,
                    artwork: `${window.location.origin}/images/singlesCovers/${single.fileName.replace(/\.[^.]+$/, '.jpg')}`,
                }

                return (
                    <Player tracks={[track]} />
                )
            })}
        </React.Fragment>
    )
}