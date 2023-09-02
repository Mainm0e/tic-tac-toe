import { sound } from './sound.js';
export default class MrIfElse {

    constructor(screen, board, name) {
        this.screen = screen;
        this.board = board;
        this.name = name;
    }


    move() {
        // find all location of object on board
        const moves = this.findLocation(this.name);
        // pick one move from moves base on possibleMoves
        const move = moves[Math.floor(Math.random() * moves.length)];
        this.imMoving(move);

        return true;
    }

    imMoving(move) {
        sound.drop.play();
        sound.drop.currentTime = 0;
        // get object in move.cell and append to move.possibleMoves 

        const object = move.cell.querySelector(`.${this.name}`);

        // pick one move from moves base on possibleMoves random
        const randomMove = move.possibleMoves[Math.floor(Math.random() * move.possibleMoves.length)];
        // get cell from randomMove
        const cell = this.findCell(randomMove[0], randomMove[1]);
        // append object to cell
        cell.appendChild(object);
    }


    // * find possible moves for object
    // find all location of object on board
    findLocation(name) {
            const nextMove = [];
            const location = document.querySelectorAll(`.${name}`);
            location.forEach((cell) => {
                let cell_parent = cell.parentElement;
                let move = this.findNextCell(cell_parent);
                if (move.possibleMoves.length > 0) {
                    nextMove.push(move);
                }
            });
            return nextMove;
        }
        // find Next cell of object
        // can move only 1 cell to top, bottom, left, right
    findNextCell(cell) {
        let possibleMoves = [];
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
                    possibleMoves.push([row, col])
                }
            }
        }
        let object = {
            possibleMoves: possibleMoves,
            cell: cell
        }
        return object;
    }

    findCell(rowIndex, cellIndex) {
        const cell = this.screen.querySelector(`.cell[data-row-index="${rowIndex}"][data-cell-index="${cellIndex}"]`);
        return cell;
    }
}