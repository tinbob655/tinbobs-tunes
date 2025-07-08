import * as albumsData from './albumsData.json' assert {type: 'json'};

interface album {
    frontendName: string;
    releaseDate: string;
    tracks: [string, string][];
};

export default class Album {

    #frontendName:string;
    #releaseDate:Date
    #tracks: [string, string][];
    #parentAlbum: string;

    constructor(backendName:string) {
        
        //first, make sure the supplied backendName is valid
        if (Object.keys(albumsData).includes(backendName)) {

            //use the backendName to get data about the album
            const albumsAny:any = albumsData    //workaround for typescript weirdness
            const thisAlbum:album = albumsAny[backendName];
            
            //save retrieved data
            this.#frontendName = thisAlbum.frontendName;
            this.#tracks = thisAlbum.tracks;
            this.#parentAlbum = Object.keys(albumsAny)[Object.values(albumsAny).indexOf(thisAlbum)];
            
            //get the date from dd/mm/yy to js date format
            const stringDate:string[] = thisAlbum.releaseDate.split('/');
            this.#releaseDate = new Date(
                Number(stringDate[2]) + 2000,   //year
                Number(stringDate[1]) - 1,  //month
                Number(stringDate[0]),  //day
            );
        }

        //if the backendName was not valid, throw an error
        else throw new Error('Invalid backendName supplied to album class');
    };

    get frontendName():string {
        return this.#frontendName;
    };

    get releaseDate():Date {
        return this.#releaseDate;
    };

    get tracks():string[][] {
        return this.#tracks;
    };

    get parentAlbum():string {
        return this.#parentAlbum;
    }
};