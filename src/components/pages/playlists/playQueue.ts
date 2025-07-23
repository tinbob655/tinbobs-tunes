export default class PlayQueue {

    #queue:string[];
    #queuePosition:number
    #audioPlayer:HTMLAudioElement;

    constructor() {
        this.#queue = [];
        this.#audioPlayer = new Audio();
        this.#audioPlayer.volume = 0.2;
        this.#queuePosition = 0;

        //declare listeners for the play queue
        this.#audioPlayer.addEventListener('ended', this.skip);
    };

    get audio():HTMLAudioElement {
        return this.#audioPlayer;
    };

    queueTrack(audioFileName:string, albumName?:string):void {
        let importedTrack:string;
        if (albumName) {
            importedTrack = `./audio/albums/${albumName}/${audioFileName}`;
        }
        else {
            importedTrack = `./audio/singles/${audioFileName}`;
        };

        this.#queue.push(importedTrack);
    };

    play():void {
        this.#audioPlayer.src = this.#queue[this.#queuePosition];
        this.#audioPlayer.play();
    };

    pause():void {
        this.#audioPlayer.pause();
    };

    playPause():boolean {

        //NOTE: this returns if we are playing or not after playing / pausing

        
        if (this.#audioPlayer.paused) {

            //audio is paused, play it
            this.#audioPlayer.play();
            return true;
        }
        else {

            //audio is playing, pause it
            this.#audioPlayer.pause();
            return false;
        };
    }

    skip():void {
        this.#queuePosition++;

        //check if we have reached the end of the queue
        if (this.#queuePosition > this.#queue.length -1) {

            //the end of the queue has been reached
            this.#audioPlayer.pause();
            this.#audioPlayer.currentTime = 0;
        }
        else {

            //the end of the queue has not been reached
            this.#audioPlayer.pause();
            this.#audioPlayer.src = this.#queue[this.#queuePosition];
            this.#audioPlayer.currentTime = 0;
            this.#audioPlayer.play();
        };
    };

    rewind():void {
        
        //need to check if we are going back a track or just restarting the current track
        if (this.#audioPlayer.currentTime < 2 && this.#queuePosition > 0) {

            //go to the previous track
            this.#audioPlayer.pause();
            this.#audioPlayer.currentTime = 0;
            this.#queuePosition--;
            this.#audioPlayer.src = this.#queue[this.#queuePosition];
            this.#audioPlayer.play();
        }
        else {

            //rewind the current track
            this.#audioPlayer.currentTime = 0;
        }
    };

    stop():void {
        this.#queue = [];
        this.#audioPlayer.pause();
        this.#audioPlayer.currentTime = 0;
    };
};