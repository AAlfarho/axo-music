/**
 * Created by alfaro on 9/28/17.
 */

export const formatSeconds = (secs) => {
    let minutes = Math.floor(secs / 60);
    secs = Math.floor(secs % 60);
    let seconds = secs;

    return (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
};