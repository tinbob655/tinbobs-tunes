export default function secondsToMinutesAndSeconds(totalTime:number):[number, number] {
    const minutes:number = Math.floor(totalTime / 60)
    let seconds:number = Math.round(totalTime % 60);

    return [minutes, seconds];
};