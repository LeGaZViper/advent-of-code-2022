import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const map = input.split("\n").map(line => line.split(""));
    const mapWithMultipleStarts = [...map.map(m => m.slice())].map(m => m.map(p => p === "a" ? "S" : p));

    const shortestPathStepsOneStart = shortestPath(map);
    const shortestPathStepsMultipleStarts = shortestPath(mapWithMultipleStarts);

    console.log(`Shortest path steps with one start: ${shortestPathStepsOneStart}`);
    console.log(`Shortest path steps with multiple starts: ${shortestPathStepsMultipleStarts}`);
}

//very scuffed Dijkstra
function shortestPath(map: string[][]) {
    const distances: number[][] = new Array(map.length).fill(0).map(() => []);
    const unvisitedCoords: (string | null)[][] = [...map.map(m => m.slice())];
    const routesMap: (([number, number]) | null)[][] = new Array(map.length).fill(0).map(() => []);
    let end: [number, number] = [-1, -1];

    for(let x = 0; x < map.length; x++) {
        for(let y = 0; y < map[x].length; y++) {
            distances[x][y] = Infinity;
            if(routesMap[x]) routesMap[x][y] = null;
            if(map[x][y] === "S") distances[x][y] = 0;
        }
    }

    while(!allNull(unvisitedCoords)) {
        const bestPoint = getBestCoords(distances, unvisitedCoords);
        //if we can't find any more routes
        if(bestPoint[0] === -1) break;
        
        unvisitedCoords[bestPoint[0]][bestPoint[1]] = null;
        
        const neighbors = getAccessibleNeighborsCoords(bestPoint, unvisitedCoords, map);
        
        if(map[bestPoint[0]][bestPoint[1]] === "E") {
            end = [bestPoint[0], bestPoint[1]];
        }

        for(const neighbor of neighbors) {
            const alt = distances[bestPoint[0]][bestPoint[1]] + 1;
            if(alt < distances[neighbor[0]][neighbor[1]]) {
                distances[neighbor[0]][neighbor[1]] = alt;
                routesMap[neighbor[0]][neighbor[1]] = bestPoint;
            }
        }
    }

    return countSteps(routesMap, end);
}

function allNull(arr: any[][]) {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i].some(e => e !== null)) return false;
    }

    return true;
}

function getBestCoords(distances: number[][], unvisitedCoords: (string | null)[][]) {
    let bestCoordsPointer = Infinity;
    let bestCoords: [number, number] = [-1, -1];
    for(let x = 0; x < distances.length; x++) {
        for(let y = 0; y < distances[x].length; y++) {
            if(unvisitedCoords[x][y] && bestCoordsPointer > distances[x][y]) {
                bestCoordsPointer = distances[x][y];
                bestCoords = [x, y];
            }
        }
    }

    return bestCoords;
}

function getAccessibleNeighborsCoords(position: [number, number], unvisitedCoords: (string | null)[][], map: string[][]) {
    const [x, y] = position;
    const neighbors = [[x - 1, y], [x, y -1], [x + 1, y], [x, y + 1]].filter(n => {
        if(unvisitedCoords[n[0]] === undefined) return false;
        
        const pos = map[position[0]][position[1]];
        const neighPos = unvisitedCoords[n[0]][n[1]];
        
        let positionCharCode = pos === "S" ? "a".charCodeAt(0) : pos === "E" ? "z".charCodeAt(0) : pos.charCodeAt(0);
        let charCode = neighPos === "S" ? "a".charCodeAt(0) : neighPos === "E" ? "z".charCodeAt(0) : neighPos?.charCodeAt(0);
        
        if(charCode && (positionCharCode >= charCode || positionCharCode + 1 === charCode)) return true;
        return false;
    });

    return neighbors;
}

function countSteps(routesMap: ([number, number] | null)[][], target: [number, number]) {
    const steps = [];
    let route: [number, number] | null = target;

    while(route) {
        steps.unshift(routesMap[route[0]][route[1]]);
        route = routesMap[route[0]][route[1]];
    }

    //we don't count the last step
    return steps.length - 1;
}

start();