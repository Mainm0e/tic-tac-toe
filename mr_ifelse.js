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
    findNextCell(cell) {
        // get cell position
        let possibleMoves = [];
        const rowIndex = parseInt(cell.dataset.rowIndex);
        const cellIndex = parseInt(cell.dataset.cellIndex);
        console.log(rowIndex, cellIndex);
        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
            for (let j = cellIndex - 1; j <= cellIndex + 1; j++) {
                if (i >= 0 && i < 3 && j >= 0 && j < 3) {
                    const cell = this.findCell(i, j);
                    if (!cell.firstChild) {
                        // add this cell to this.possibleMoves
                        possibleMoves.push([i, j]);
                    }
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