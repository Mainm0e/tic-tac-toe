/*
 * basic tic tac toe game
 * 1 player vs Mr. If Else
 */
import MrIfElse from "./mr_ifelse.js";
import { Element_Root, player, mrIfElse } from "./config.js";
import { sound } from "./sound.js";
import { template_start_screen, template_game_over_screen } from "./template.js";



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
        start_screen.innerHTML = template_start_screen();
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
        game_over_screen.innerHTML = template_game_over_screen(winner_name, bully_text);
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
    // Create a function to check for a win for a specific player
    checkPlayerWin(playerName) {
        // Check for horizontal wins
        const horizontalWin = this.board.some(row => row.every(cell => cell === playerName));
        if (horizontalWin) {
            this.winner = playerName;
            this.isOver = true;
            this.gameOver();
            return true;
        }

        // Check for vertical wins
        for (let columnIndex = 0; columnIndex < this.board[0].length; columnIndex++) {
            const verticalWin = this.board.every(row => row[columnIndex] === playerName);
            if (verticalWin) {
                this.winner = playerName;
                this.isOver = true;
                this.gameOver();
                return true;
            }
        }

        // Check for main diagonal win (top-left to bottom-right)
        const mainDiagonalWin = this.board.every((row, index) => row[index] === playerName);
        if (mainDiagonalWin) {
            this.winner = playerName;
            this.isOver = true;
            this.gameOver();
            return true;
        }

        // Check for anti-diagonal win (top-right to bottom-left)
        const antiDiagonalWin = this.board.every((row, index) => row[row.length - 1 - index] === playerName);
        if (antiDiagonalWin) {
            this.winner = playerName;
            this.isOver = true;
            this.gameOver();
            return true;
        }

        return false; // No win found
    }

    // In your checkWinner function, call checkPlayerWin for both players
    checkWinner() {
        // Check for a win for this.player
        if (this.checkPlayerWin(this.player)) {
            return;
        }

        // Check for a win for this.mrIfElse
        if (this.checkPlayerWin(this.mrIfElse.name)) {
            return;
        }

        // If no winner, continue with other checks or actions
        // ...
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
    // can move only 1 cell to top, bottom, left, right
    findNextCell(cell) {
        // get cell position
        const rowIndex = parseInt(cell.dataset.rowIndex);
        const cellIndex = parseInt(cell.dataset.cellIndex);

        // Define the possible directions: top, bottom, left, right, and diagonals
        const directions = [
            { row: rowIndex - 1, col: cellIndex }, // Top
            { row: rowIndex + 1, col: cellIndex }, // Bottom
            { row: rowIndex, col: cellIndex - 1 }, // Left
            { row: rowIndex, col: cellIndex + 1 }, // Right
        ];

        // Check if diagonal movements are allowed based on current position
        if (!((rowIndex === 0 && cellIndex === 1) ||
                (rowIndex === 1 && (cellIndex === 0 || cellIndex === 2)) ||
                (rowIndex === 2 && cellIndex === 1))) {
            directions.push({ row: rowIndex - 1, col: cellIndex - 1 }, // Top-left (diagonal)
                { row: rowIndex - 1, col: cellIndex + 1 }, // Top-right (diagonal)
                { row: rowIndex + 1, col: cellIndex - 1 }, // Bottom-left (diagonal)
                { row: rowIndex + 1, col: cellIndex + 1 } // Bottom-right (diagonal)
            );
        }

        // Check each direction for valid moves
        for (const direction of directions) {
            const { row, col } = direction;

            // Check if the direction is within the grid bounds (0 to 2)
            if (row >= 0 && row < 3 && col >= 0 && col < 3) {
                const cell = this.findCell(row, col);

                if (!cell.firstChild) {
                    // add this cell to this.possibleMoves
                    this.possibleMoves.push([row, col]);
                    cell.classList.add('active');
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