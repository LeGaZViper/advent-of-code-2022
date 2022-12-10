import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const moves = input.split("\n");

    const headAndTail: [number, number][] = new Array(2).fill(0).map(() => [1, 1]);
    const tenKnots: [number, number][] = new Array(10).fill(0).map(() => [1, 1]);

    const headAndTailUniquePositions = executeMoves(moves, headAndTail);
    const tenKnotsUniquePositions = executeMoves(moves, tenKnots);

    console.log(`Head and tail unique positions: ${headAndTailUniquePositions.size}`);
    console.log(`Ten knots unique positions: ${tenKnotsUniquePositions.size}`);
}

function executeMoves(moves: string[], knots: [number, number][]) {
    const tailPositions = [knots[0].join(",")];

    for(const move of moves) {
        const [dir, tiles] = move.split(" ");

        for(let i = 0; i < Number(tiles); i++) {
            for(let j = 0; j < knots.length; j++) {
                if(j === 0) knots[j] = moveHead(dir, knots[j]);
                else knots[j] = moveKnot(knots[j], knots[j - 1]);
            }

            tailPositions.push(knots[knots.length - 1].join(","));
        }
    }

    return new Set(tailPositions);
}

function moveHead(dir: string, headPos: [number, number]): [number, number] {
    switch(dir) {
        case "L":
            return [headPos[0] - 1, headPos[1]];
        case "U":
            return [headPos[0], headPos[1] - 1];
        case "R":
            return [headPos[0] + 1, headPos[1]];
        default: //D
            return [headPos[0], headPos[1] + 1];
    }
}

function moveKnot(knotPos: [number, number], previousKnotPos: [number, number]): [number, number] {
    if(adjacent(previousKnotPos, knotPos)) return knotPos;

    let xMove = previousKnotPos[0] - knotPos[0];
    let yMove = previousKnotPos[1] - knotPos[1];

    // keep in mind the diagonal movement rule.
    if(Math.abs(xMove) > 1) xMove = xMove > 0 ? xMove - 1 : xMove + 1;
    if(Math.abs(yMove) > 1) yMove = yMove > 0 ? yMove - 1 : yMove + 1;

    return [knotPos[0] + xMove, knotPos[1] + yMove];
}

function adjacent(headPos: [number, number], tailPos: [number, number]): boolean {
    const distanceX = Math.abs(headPos[0] - tailPos[0]);
    const distanceY = Math.abs(headPos[1] - tailPos[1]);

    return distanceX < 2 && distanceY < 2;
}

start();