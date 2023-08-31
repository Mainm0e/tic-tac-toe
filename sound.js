export const sound = {
    // sound

    pick: (() => {
        const audio = new Audio("./sound/pick.wav");
        audio.volume = 0.1;
        return audio;
    })(),

    drop: (() => {
        const audio = new Audio("./sound/drop.wav");
        audio.volume = 0.1;
        return audio;
    })(),

    click: (() => {
        const audio = new Audio("./sound/click.wav");
        audio.volume = 0.1;
        return audio;
    })(),

}