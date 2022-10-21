import { INVALID_MOVE } from 'boardgame.io/core';

// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
    const positions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const isRowComplete = (row) => {
        const symbols = row.map(i => cells[i]);
        return symbols.every(i => i !== null && i === symbols[0]);
    };

    return positions.map(isRowComplete).some(i => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
    return cells.filter(c => c === null).length === 0;
}

export const TicTacToe = {
    setup: () => ({cells: Array(9).fill(null)}),
    turn: {
        minMoves: 1,
        maxMoves: 1,
    },
    moves: {
        clickCell: ({G, playerID}, id) => {
            if (G.cells[id] !== null) {
                return INVALID_MOVE;
            }
            G.cells[id] = playerID;
        },
        bet: ({G, playerID}, diceValue, numDice) => {
            // General bet restrictions
            if(numDice > G.totalDiceRemaining){
                return INVALID_MOVE;
            }
            if(diceValue === 1){
                return {move: INVALID_MOVE, message: "Dice value can not be 1, seeing as there is no button for 1 are you cheating somehow? Pick another value"};
            }
            if(numDice < 1){
                return INVALID_MOVE
            }
            // Ensure this bet was a legal one, meaning it upped either the dice value or the number of dice from the last bet
            if(G.lastBet){
                if(G.lastBet.diceValue <= diceValue && G.lastBet.numDice <= numDice){
                    return INVALID_MOVE
                }
            }
            // If we made it this far the bet is valid, and we should update last bet with it

            return {...G, lastBet: {diceValue, numDice, playerID}};
        },

    },
    endIf: ({ G, ctx }) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
        if (IsDraw(G.cells)) {
            return { draw: true };
        }
    },
};