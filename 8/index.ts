import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const treeRows = input.split("\n");
    const treeGrid = treeRows.map(row => row.split(""));

    let totalVisibleTrees = 0;
    const scenicScores: number[][] = new Array(treeGrid.length).fill(0).map(() => []);
    for(let x = 0; x < treeGrid.length; x++) {
        for(let y = 0; y < treeGrid[x].length; y++) {
            const [visible, scenicScore] = checkVisibility(x, y, treeGrid);
            totalVisibleTrees += visible ? 1 : 0;
            scenicScores[x][y] = scenicScore;
        }
    }

    console.log(`Total visible trees: ${totalVisibleTrees}`);
    console.log(`Highest scenic score: ${getHighestScenicScore(scenicScores)}`);
}

function checkVisibility(x: number, y: number, treeGrid: string[][]): [boolean, number] {
    const visibleFrom = [];
    let scenicScore = 1;
    for(let d = 0; d < 4; d++) {
        let dirViewingDistance = 0;
        let visibleFromThisSide = true;
        let treeToCheck = treeGrid[x][y];
        let xCurr = x;
        let yCurr = y;
        let xMove = d < 2 ? d === 0 ? -1 : 1 : 0;
        let yMove = d >= 2 ? d === 2 ? -1 : 1 : 0;

        while(treeToCheck) {
            xCurr += xMove;
            yCurr += yMove;

            if(!treeGrid[xCurr]) break;
            if(!treeGrid[xCurr][yCurr]) break;
            treeToCheck = treeGrid[xCurr][yCurr];

            if(treeToCheck >= treeGrid[x][y]) {
                visibleFromThisSide = false;
                dirViewingDistance += 1;
                break;
            }

            dirViewingDistance += 1;
        }

        if(visibleFromThisSide) {
            visibleFrom.push(d);
        }

        scenicScore *= dirViewingDistance;
    }

    return [visibleFrom.length > 0, scenicScore];
}

function getHighestScenicScore(scenicScores: number[][]) {
    let highestScenicScore = 0;
    for(let x = 0; x < scenicScores.length; x++) {
        for(let y = 0; y < scenicScores[x].length; y++) {
            if(scenicScores[x][y] > highestScenicScore) {
                highestScenicScore = scenicScores[x][y];
            }
        }
    }

    return highestScenicScore;
}

start();