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
};