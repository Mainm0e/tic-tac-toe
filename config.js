// config.js

// To avoid circular dependencies between imports & exports, a seprate
// config.js file is used to store app-wide constants and variables.

export const Element_Root = document.getElementById('root');

// game variables
// * player spawn
export const player = [
    [0, 1],
    [2, 0],
    [2, 2]
]

// * bot spawn
export const mrIfElse = [
    [0, 0],
    [0, 2],
    [2, 1]
]