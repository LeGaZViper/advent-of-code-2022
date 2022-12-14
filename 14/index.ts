import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const lines = input.split("\n");

    const grid: string[][] = new Array(1000000).fill(0).map(() => new Array(200).fill("."));

    for(let i = 0; i < grid.length; i++) {
        //grid[i][grid.length-1] = "#";
    }
    
    for(const line of lines) {
        parseLine(line, grid);
    }
    
    //console.log(grid.map(arr => arr.join("")).slice(490, 510));
    let iterations = 0;
    while(!putSand(grid)) {
        iterations++;
    }
    console.log(iterations);

    // while(!putSandUntilOutOfPositions(grid)) {
    //     iterations++;
    // }

    console.log(iterations);
}

function parseLine(line: string, grid: string[][]) {
    const positions: number[][] = line.split(" -> ").map(pair => pair.split(",").map(n => Number(n)));



    let lastPosition: [number, number] | null = null
    for(const pair of positions) {
        if(!lastPosition) {
            grid[pair[0]][pair[1]] = "#";
        } else {
            const total = lastPosition[0] === pair[0] ? Math.abs(lastPosition[1] - pair[1]) : Math.abs(lastPosition[0] - pair[0]);

            for(let i = 0; i <= total; i++) {
                if(lastPosition[0] === pair[0]) {
                    const minus = lastPosition[1] > pair[1];
                    grid[pair[0]][lastPosition[1] + (minus ? -i : i)] = "#";
                } else {
                    const minus = lastPosition[0] > pair[0];
                    grid[lastPosition[0] + (minus ? -i : i)][pair[1]] = "#";
                }
            }
        }

        lastPosition = [pair[0], pair[1]];
    }
}

function putSand(grid: string[][]) {
    const sandStartingPosition: [number, number] = [500, 0];

    let currPos = sandStartingPosition;
    while(true) {
        if(currPos[1] + 1 === grid[0].length - 2) return true;
        if(grid[currPos[0]][currPos[1] + 1] === ".") {
            currPos = [currPos[0], currPos[1] + 1];
            continue;
        } else {
            if(grid[currPos[0] - 1][currPos[1] + 1] === ".") {
                currPos = [currPos[0] - 1, currPos[1] + 1];
            } else if(grid[currPos[0] + 1][currPos[1] + 1] === ".")  {
                currPos = [currPos[0] + 1, currPos[1] + 1];
            } else break;
        }
    }

    grid[currPos[0]][currPos[1]] = "o";

    return false;
}

function putSandUntilOutOfPositions(grid: string[][]) {
    const sandStartingPosition: [number, number] = [500, 0];

    let currPos = sandStartingPosition;
    while(true) {
        if(currPos[1] + 1 === sandStartingPosition[1]) return true;
        if(grid[currPos[0]][currPos[1] + 1] === ".") {
            currPos = [currPos[0], currPos[1] + 1];
            continue;
        } else {
            if(grid[currPos[0] - 1][currPos[1] + 1] === ".") {
                currPos = [currPos[0] - 1, currPos[1] + 1];
            } else if(grid[currPos[0] + 1][currPos[1] + 1] === ".")  {
                currPos = [currPos[0] + 1, currPos[1] + 1];
            } else break;
        }
    }

    grid[currPos[0]][currPos[1]] = "o";

    return false;
}

start();