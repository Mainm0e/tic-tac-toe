/*
 * basic tic tac toe game
 * 1 player vs Mr. If Else
 */
import MrIfElse from "./mr_ifelse.js";
import { Element_Root } from "./config.js";

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
        this.possibleMoves = [];

    }

    // * main entry point
    render() {
        Element_Root.appendChild(this.gamescreen());
        this.add("X", player);
        this.add("O", mrIfElse);
        this.setupDragAndDrop("X");
        this.mrIfElse = new MrIfElse(this.screen, this.board, "O");
        this.gameLoop();
    }

    // * game mechanics
    gameLoop() {
        if (this.isOver) {
            console.log('Game over!', this.winner);
            return;
        }

        if (!this.playerTurn) {
            // 3 seconds delay

            this.playerTurn = this.mrIfElse.move();
            this.chageDragable("X", this.playerTurn);
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

    checkWinner() {
        // Check for horizontal wins
        // Check for vertical wins
        // Check for diagonal wins

        this.board.forEach((row, rowIndex) => {
            // check player win
            const horizontalWin = row.every(cell => cell === this.player);
            if (horizontalWin) {
                console.log('horizontal win');
                this.winner = this.player;
                this.isOver = true;
                return;
            }

            const verticalWin = this.board.every(row => row[rowIndex] === this.player);
            if (verticalWin) {
                console.log('vertical win');
                this.winner = this.player;
                this.isOver = true;
                return;
            }

            // check mrIfElse win
            const horizontalWinMrIfElse = row.every(cell => cell === this.mrIfElse.name);
            if (horizontalWinMrIfElse) {
                console.log('horizontal win');
                this.winner = this.mrIfElse.name;
                this.isOver = true;
                return;
            }

            const verticalWinMrIfElse = this.board.every(row => row[rowIndex] === this.mrIfElse.name);
            if (verticalWinMrIfElse) {
                console.log('vertical win');
                this.winner = this.mrIfElse.name;
                this.isOver = true;
                return;
            }


        })

    }

    //!! drag
    setupDragAndDrop(player) {
        const objects = document.querySelectorAll(`.${player}`);
        objects.forEach(object => {
            object.addEventListener('dragstart', this.dragStart.bind(this));
            object.addEventListener('dragend', this.dragEnd.bind(this));
        });

        // Add dragover and drop event listeners to cells
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('dragover', this.dragOver.bind(this));
            cell.addEventListener('drop', this.drop.bind(this));
        });

        console.log('Drag and drop setup complete.');
    }

    dragStart(event) {
        this.draggedPlayer = event.target; // Store the dragged player element
        this.sourceCell = event.target.parentElement; // Store the source cell
        this.findNextCell(this.sourceCell);
    }

    dragEnd(event) {
        this.possibleMoves = [];
        this.chageDragable("X", this.playerTurn);
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
                console.log("possible move: ", this.possibleMoves)
                this.possibleMoves.forEach(cell => {
                    // check if the target cell is in the possible moves by comparing the data attribute
                    console.log("traget cell", targetCell.dataset.rowIndex, targetCell.dataset.cellIndex)
                    if (cell[0] == targetCell.dataset.rowIndex && cell[1] == targetCell.dataset.cellIndex) {
                        possible = true;
                    }

                });
                if (targetCell.classList.contains('cell') && !targetCell.firstChild && possible) {
                    targetCell.appendChild(this.draggedPlayer); // Append the dragged player to the target cell
                    this.draggedPlayer = null; // Reset the dragged player
                    this.sourceCell = null; // Reset the source cell
                    this.playerTurn = false
                    possible = false;
                }
            }
        }
        //!! drop

    chageDragable(player, value) {
        const element = document.querySelectorAll(`.${player}`);
        element.forEach(element => {
            // change attribute draggable to false
            element.setAttribute('draggable', value);
        });
    }


    // find next cell that is empty
    findNextCell(cell) {
        // get cell position
        const rowIndex = parseInt(cell.dataset.rowIndex);
        const cellIndex = parseInt(cell.dataset.cellIndex);
        console.log(rowIndex, cellIndex);
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


    // * create

    gamescreen() {
        this.screen = document.createElement('div');
        this.screen.classList.add('gamescreen');
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