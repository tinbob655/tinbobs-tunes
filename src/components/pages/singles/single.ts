export default class single {

    #frontendName:string;
    #audioName:string;
    #releaseDate:Date;
    #artworkName:string;

    constructor(frontendName:string, audioName:string, releaseDate:string) {
        this.#frontendName = frontendName;
        this.#audioName = audioName;

        //the inputted release date will look like dd/mm/yy. Convert it to be a js date
        const dateArray:string[] = releaseDate.split('/');
        this.#releaseDate = new Date(
            Number(dateArray[2]) + 2000,   //year
            Number(dateArray[1]) - 1,  //month
            Number(dateArray[0]),  //day
        );

        //need to work out the artwork name from the audio name
        const backendName:string = audioName.split('.')[0];     //audio file name without the file extension
        this.#artworkName = `${backendName}.jpg`;
    };

    get frontendName() {
        return this.#frontendName;
    };

    get audioFileName() {
        return this.#audioName;
    };

    get releaseDate() {
        return this.#releaseDate;
    };

    get artworkFileName() {
        return this.#artworkName;
    };
};