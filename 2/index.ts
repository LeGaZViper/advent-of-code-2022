import fs from "fs/promises";
import path from "path";

async function start() {
    const movesByMove = new Map<string, number>([
        ["A X", 4],
        ["A Y", 8],
        ["A Z", 3],
        ["B X", 1],
        ["B Y", 5],
        ["B Z", 9],
        ["C X", 7],
        ["C Y", 2],
        ["C Z", 6],
    ]);

    const movesByOutcome = new Map<string, number>([
        ["A X", 3],
        ["A Y", 4],
        ["A Z", 8],
        ["B X", 1],
        ["B Y", 5],
        ["B Z", 9],
        ["C X", 2],
        ["C Y", 6],
        ["C Z", 7],
    ]);
   
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");
    const moves = input.split("\n");
   

    let movesByMovesPoints = 0;
    for(const move of moves) {
        const points = movesByMove.get(move);
        if(points) {
            movesByMovesPoints += points;
            continue;
        }
    }

    let movesByOutcomePoints = 0;
    for(const move of moves) {
        const points = movesByOutcome.get(move);
        if(points) {
            movesByOutcomePoints += points;
            continue;
        }
    }

    console.log(`Total points per strategy by moves: ${movesByMovesPoints}`);
    console.log(`Total points per strategy by outcome: ${movesByOutcomePoints}`);
}

start();