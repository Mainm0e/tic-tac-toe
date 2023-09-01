/*
 * basic tic tac toe game
 * 1 player vs Mr. If Else
 */
import MrIfElse from "./mr_ifelse.js";
import { Element_Root } from "./config.js";
import { sound } from "./sound.js";

// * game variables

// X spawn locations (row, cell)
const player = [
    [0, 1],
    [2, 0],
    [2, 2]
]

// Mr. If Else spawn locations (row, cell)
const mrIfElse = [
    [0, 0],
    [0, 2],
    [2, 1]
]

class TicTacToe {
    constructor() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        this.player = 'X';
        this.winner = null;
        this.isOver = false;

        this.draggedPlayer = null;
        this.sourceCell = null;

        this.playerTurn = true;
        this.mrIfElseTurn = 0;
        this.possibleMoves = [];

    }

    // * render screen
    render() {
        // how i can get event onlick on button
        Element_Root.appendChild(this.gamescreen());

        const start_screen = document.createElement('div');
        start_screen.classList.add('start-screen');
        start_screen.innerHTML = `
        <div class="start-screen__title">
        <span class="start-screen__title--1">You can't beat</span>
        <span class="bot_name">
        <span>Mr.</span>
        <span> If Else</span>
        </span>
        </div>
        <div class="start-screen__button">
            <button class="start-btn">Let's see</button>
        </div>
        `;
        document.getElementById("board").appendChild(start_screen);
        document.querySelector('.start-btn').addEventListener('click', () => {
            sound.click.play();
            sound.click.currentTime = 0;
            document.getElementById("board").removeChild(start_screen);
            this.start();
        });
    }

    // * start game
    start() {
        this.add("X", player);
        this.add("O", mrIfElse);
        this.addEvent("X");
        this.mrIfElse = new MrIfElse(this.screen, this.board, "O");
        this.gameLoop();
    }

    // * game over
    gameOver() {
        // remove all event listener
        // show game over screen
        // show winner
        // show play again button
        let game_over_screen = document.createElement('div');
        game_over_screen.classList.add('game-over-screen');
        // bully text
        let bully_text = "I knew that you can't beat him.";
        let winner_name = "Mr. If Else";
        if (this.winner == "X") {
            bully_text = "You beat him this time.";
            winner_name = "You";
        }
        game_over_screen.innerHTML = `
        <div class="game-over-screen__title">Game Over</div>
        <div class="game-over-screen__bully">${bully_text}</div>
        <div class="game-over-screen__winner">Winner: ${winner_name}</div>
        <div class="game-over-screen__button">
            <button class="start-btn">Play Again</button>
        </div>
        `;
        document.getElementById("board").appendChild(game_over_screen);
        document.querySelector('.start-btn').addEventListener('click', () => {
            sound.click.play();
            sound.click.currentTime = 0;
            document.getElementById("board").removeChild(game_over_screen);
            this.restart();
        });
    }

    // * restart game
    // reset all variables to default value and delete screen then render new screen
    restart() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        this.player = 'X';
        this.winner = null;
        this.isOver = false;

        this.draggedPlayer = null;
        this.sourceCell = null;

        this.playerTurn = true;
        this.possibleMoves = [];

        this.screen.innerHTML = "";
        // remove old screen
        document.getElementById("gamescreen").remove();
        this.render();
    }

    // * game mechanics
    gameLoop() {
        if (this.isOver) {
            return;
        }

        if (!this.playerTurn) {
            // 3 seconds delay
            this.mrIfElseTurn += 1;

            if (this.mrIfElseTurn >= 100) {

                this.playerTurn = this.mrIfElse.move();
                this.chageDragable("X", this.playerTurn);
                this.mrIfElseTurn = 0;

            }

        }

        // Update the game board based on player locations
        this.board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellElement = this.findCell(rowIndex, cellIndex);
                if (cellElement.firstChild) {
                    const playerName = cellElement.firstChild.classList.contains('X') ? 'X' : 'O';
                    this.board[rowIndex][cellIndex] = playerName;
                } else {
                    this.board[rowIndex][cellIndex] = null;
                }
            });
        });
        this.checkWinner();

        if (!this.isOver) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }

    }

    // * check winner
    checkWinner() {
        // Check for horizontal wins
        // Check for vertical wins
        // Check for diagonal wins

        this.board.forEach((row, rowIndex) => {
            // check player win
            const horizontalWin = row.every(cell => cell === this.player);
            if (horizontalWin) {
                this.winner = this.player;
                this.isOver = true;
                this.gameOver();
                return;
            }

            const verticalWin = this.board.every(row => row[rowIndex] === this.player);
            if (verticalWin) {
                this.winner = this.player;
                this.isOver = true;
                this.gameOver();
                return;
            }

            // check mrIfElse win
            const horizontalWinMrIfElse = row.every(cell => cell === this.mrIfElse.name);
            if (horizontalWinMrIfElse) {
                this.winner = this.mrIfElse.name;
                this.isOver = true;
                this.gameOver();
                return;
            }

            const verticalWinMrIfElse = this.board.every(row => row[rowIndex] === this.mrIfElse.name);
            if (verticalWinMrIfElse) {
                this.winner = this.mrIfElse.name;
                this.isOver = true;
                this.gameOver();
                return;
            }
        })

    }

    //* -----event system---- *// 
    addEvent(player) {
        const objects = document.querySelectorAll(`.${player}`);
        objects.forEach(object => {
            //setupDragAndDrop(object);
            object.addEventListener('dragstart', this.dragStart.bind(this));
            object.addEventListener('dragend', this.dragEnd.bind(this));
            object.addEventListener('click', this.select_object.bind(this));
        });

        // Add dragover and drop event listeners to cells
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('dragover', this.dragOver.bind(this));
            cell.addEventListener('drop', this.drop.bind(this));
        });
    }

    dragStart(event) {
        this.possibleMoves = [];
        if (!this.playerTurn) {
            return;
        }
        // add pick sound
        sound.pick.play();
        sound.pick.currentTime = 0;
        this.draggedPlayer = event.target; // Store the dragged player element
        this.sourceCell = event.target.parentElement; // Store the source cell
        this.findNextCell(this.sourceCell);
    }

    dragEnd(event) {
        this.chageDragable("X", this.playerTurn);
        this.possibleMoves = [];
        this.changeCellColor();
    }

    dragOver(event) {
        event.preventDefault();
    }

    drop(event) {
        event.preventDefault();
        if (this.draggedPlayer) {
            const targetCell = event.target;
            let possible = false;

            this.possibleMoves.forEach(cell => {
                // check if the target cell is in the possible moves by comparing the data attribute
                if (cell[0] == targetCell.dataset.rowIndex && cell[1] == targetCell.dataset.cellIndex) {
                    possible = true;
                }

            });
            if (targetCell.classList.contains('cell') && !targetCell.firstChild && possible) {
                // add drop sound
                sound.drop.play();
                sound.drop.currentTime = 0;

                targetCell.appendChild(this.draggedPlayer); // Append the dragged player to the target cell
                this.draggedPlayer = null; // Reset the dragged player
                this.sourceCell = null; // Reset the source cell
                this.playerTurn = false
                possible = false;
            }
        }
    }

    chageDragable(player, value) {
        const element = document.querySelectorAll(`.${player}`);
        element.forEach(element => {
            // change attribute draggable to false
            element.setAttribute('draggable', value);
        });
    }

    //* -----drag system---- *// 


    // * find possible ways to move
    findNextCell(cell) {
        // get cell position
        const rowIndex = parseInt(cell.dataset.rowIndex);
        const cellIndex = parseInt(cell.dataset.cellIndex);
        // find empty in this.board that is close to the cell position
        // check if the cell is empty change cell color
        // if cell (0,0) check  cell (0,1) , cell (1,0), cell (1,1)
        // if cell (0,1) check  cell (0,0) , cell (0,2), cell (1,0), cell (1,1), cell (1,2)
        // if cell (0,2) check  cell (0,1) , cell (1,1), cell (1,2)
        // if cell (1,0) check  cell (0,0) , cell (0,1), cell (1,1), cell (2,0), cell (2,1)
        // if cell (1,1) check  cell (0,0) , cell (0,1), cell (0,2), cell (1,0), cell (1,2), cell (2,0), cell (2,1), cell (2,2)
        // if cell (1,2) check  cell (0,1) , cell (0,2), cell (1,1), cell (2,1), cell (2,2)
        // if cell (2,0) check  cell (1,0) , cell (1,1), cell (2,1)
        // if cell (2,1) check  cell (1,0) , cell (1,1), cell (1,2), cell (2,0), cell (2,2)
        // if cell (2,2) check  cell (1,1) , cell (1,2), cell (2,1)

        // check if the cell is empty change cell color

        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
            for (let j = cellIndex - 1; j <= cellIndex + 1; j++) {
                if (i >= 0 && i < 3 && j >= 0 && j < 3) {
                    const cell = this.findCell(i, j);
                    if (!cell.firstChild) {
                        // add this cell to this.possibleMoves
                        this.possibleMoves.push([i, j]);
                        cell.classList.add('active');
                    }
                }
            }
        }
    }

    changeCellColor() {
        const cell = document.querySelectorAll('.cell');
        cell.forEach(cell => {
            cell.classList.remove('active');
        });
    }

    //* -----select object---- *//
    select_object(event) {
        if (!this.playerTurn) {
            return;
        }

        sound.pick.play();
        sound.pick.currentTime = 0;
        // clear all possible moves and change cell color
        this.possibleMoves = [];
        this.changeCellColor();
        this.findNextCell(event.target.parentElement);
        this.draggedPlayer = event.target;
        // Store the dragged player element
        // add event lister if the player click on possible moves element it will move that player to that cell
        // if the player click on the same cell it will clear all possible moves and change cell color

        // find all possible moves
        this.possibleMoves.forEach(cell => {
            const cellElement = this.findCell(cell[0], cell[1]);
            cellElement.addEventListener('click', this.moveObject.bind(this));
        });
    }

    moveObject(cell) {


        // move player to that cell

        const targetCell = cell.target;
        let possible = false;
        this.possibleMoves.forEach(cell => {
            // check if the target cell is in the possible moves by comparing the data attribute

            if (cell[0] == targetCell.dataset.rowIndex && cell[1] == targetCell.dataset.cellIndex) {
                possible = true;
            }

        });

        if (targetCell.classList.contains('cell') && !targetCell.firstChild && possible) {
            // add drop sound
            sound.drop.play();
            sound.drop.currentTime = 0;

            targetCell.appendChild(this.draggedPlayer); // Append the dragged player to the target cell
            this.draggedPlayer = null; // Reset the dragged player
            this.sourceCell = null; // Reset the source cell
            this.playerTurn = false
            this.possibleMoves = [];
            this.changeCellColor();
            possible = false;

        }
    }


    //* -----create system---- *// 

    gamescreen() {
        this.screen = document.createElement('div');
        this.screen.classList.add('gamescreen');
        this.screen.id = "gamescreen";
        this.screen.appendChild(this.createBoard());
        return this.screen;
    }

    // create elements
    // create player on that cell
    createPlayer(name) {
        const player = document.createElement('div');
        player.classList.add(name);
        player.setAttribute('draggable', true);
        return player;
    }

    createBoard() {
        const board = document.createElement('div');
        board.classList.add('board');
        board.id = "board";
        this.board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                board.appendChild(this.createBoardCell(rowIndex, cellIndex));
            });
        });
        return board;
    }

    createBoardCell(rowIndex, cellIndex) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.rowIndex = rowIndex;
            cell.dataset.cellIndex = cellIndex;
            return cell;
        }
        // player gonna be absolute position on that cell
    add(name, object) {
        // find the cell then append the player to that cell
        object.forEach((location) => {
            const cell = this.findCell(location[0], location[1]);
            const player = this.createPlayer(name);
            cell.appendChild(player);
        });
    }
    findCell(rowIndex, cellIndex) {
        const cell = this.screen.querySelector(`.cell[data-row-index="${rowIndex}"][data-cell-index="${cellIndex}"]`);
        return cell;
    }
}

new TicTacToe().render();