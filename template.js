export const template_start_screen = () => {
    let template = `
    <div class="start-screen__title">
    <span class="start-screen__title--1">Welcome to Tic Tac Toe!</span>
    </div>
    <div class="start-screen__instructions">
    <laber class="start-screen__title--2">Instructions:</laber>
    <ul class="instructions_list">
        <li>Player 'doughnut' goes first.</li>
        <li>Click or drag 'doughnut ' to an empty cell to make your move.</li>
        <li>Your goal is to get three of your symbols in a row (horizontally, vertically, or diagonally).</li>
        <li>Try to beat My Donut!</li>
    </ul>
    </div>
    <div class="start-screen__button">
        <button class="start-btn">Let's see</button>
    </div>
    `;
    return template;
}

/*  <h1>Welcome to Tic Tac Toe!</h1>
            <p>Instructions:</p>
            <ul>
                <li>Player 'X' goes first.</li>
                <li>Click or drag 'X' to an empty cell to make your move.</li>
                <li>Your goal is to get three of your symbols in a row (horizontally, vertically, or diagonally).</li>
                <li>Try to beat Mr. If Else!</li>
            </ul>
            <button class="start-btn">Start Game</button>
 */
export const template_game_over_screen = (winner, text) => {
    let template = `
       <div class="game-over-screen__title">Game Over</div>
        <div class="game-over-screen__bully">${text}</div>
        <div class="game-over-screen__winner">Winner: ${winner}</div>
        <div class="game-over-screen__button">
            <button class="start-btn">Play Again</button>
        </div>
        `
    return template;
}