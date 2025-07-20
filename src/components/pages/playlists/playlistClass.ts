import albumsData from '../albums/albumsData.json' assert {type: 'json'};
import singlesData from '../singles/singlesData.json' assert {type: 'json'};

export class playlistClass {

    #name:string;
    #tracks:string[];
    #description:string;

    constructor(name:string, description?:string) {
        this.#name = name;
        this.#description = description ? description : 'This playlist does not have a description yet!';
        this.#tracks = [];
    };

    get tracks():string[] {
        return this.#tracks;
    };

    get name():string {
        return this.#name;
    };

    get description():string {
        return this.#description;
    };

    set tracks(newTracks:string[]) {
        this.#tracks = newTracks;
    };

    set name(newName:string) {
        this.#name = newName;
    };

    set description(newDescription:string) {
        this.#description = newDescription;
    }

    addTrack(trackName:string):void {
        this.#tracks.push(trackName);
    };

    removeTrack(trackName:string):void {

        const deletionIndex:number = this.#tracks.indexOf(trackName);

        //if the track was not in this playlist then throw an error
        if (deletionIndex === -1) {
            throw new Error(`Track '${trackName}' was not found in playlist '${this.#name}'`);
        };

        //delete the track
        this.#tracks.splice(deletionIndex, 1);
    };

    playlistToString():string {
        const res:string = JSON.stringify({
            name: this.#name,
            tracks: this.#tracks,
            description: this.#description
        });

        return res;
    };

    getTrackAudioFiles():string[][] {
        let tempAudioFiles:string[][] = [];
        this.#tracks.forEach((track) => {
            let trackFound:boolean = false;

            //see if the track is a single
            singlesData.forEach((single) => {
                if (single.frontendName === track) {

                    //the track was a single
                    trackFound = true;
                    tempAudioFiles.push(
                        [single.fileName, 'single']
                    );
                };
            });

            //if it was not a single, search all albums for the track
            if (!trackFound) {
                Object.entries(albumsData).forEach((album) => {
                    let albumName:string = album[0];
                    album[1].tracks.forEach((albumTrack) => {
                        if (albumTrack[1] === track) {

                            //the track was found in an album
                            trackFound = true;
                            tempAudioFiles.push(
                                [albumTrack[0], albumName]
                            );
                        };
                    });
                });
            };

            //if the track still wasn't found, throw an error
            if (!trackFound) throw new Error(`Could not find track called ${track}`);
        });

        return tempAudioFiles;
    };
};