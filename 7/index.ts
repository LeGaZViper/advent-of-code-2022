import console from "console";
import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const lines = input.split("\n");

    const fileTree: any = {};
    let dirTraverse: string[] = [];

    for(let i = 0; i < lines.length; i++) {
        if(lines[i].includes("$ cd")) {
            cd(dirTraverse, lines[i].split("$ cd ")[1]);
        } else if (lines[i].includes("$ ls")) {
            const output = ls(i, lines);
            addOutputToFileTree(fileTree, dirTraverse, output);
        }
    }

    const sizes = getDirectorySizes(fileTree, 100000);

    console.log(`Sum of directory sizes up to 100000: ${sizes.reduce((curr, acc) => acc += curr, 0)}`);
    console.log(`Smallest directory size to delete: ${findDirectorySizeToDelete(fileTree)}`);
}

function cd(dirTraverse: string[], targetDir: string) {
    if(targetDir === "..") {
        dirTraverse.pop();
        return;
    } else if (targetDir === "/") {
        dirTraverse = [];
        return;
    }

    dirTraverse.push(targetDir);
}

function ls(currentLine: number, lines: string[]) {
    const linesToScan = lines.slice(currentLine + 1);

    const output = [];
    let lineProgress = 0;

    while(true) {
        if(linesToScan[lineProgress] === undefined) break;
        if(linesToScan[lineProgress].includes("$")) {
            break;
        }

        output.push(linesToScan[lineProgress]);

        lineProgress++;
    }

    return output;
}

function addOutputToFileTree(fileTree: any, dirTraverse: string[], output: string[]): any {
    if(fileTree === undefined) fileTree = {};

    if(dirTraverse.length > 0) {
        fileTree[dirTraverse[0]] = addOutputToFileTree(fileTree[dirTraverse[0]], dirTraverse.slice(1), output);
        return fileTree;
    }

    for(const line of output) {
        const [sizeOrType, name] = line.split(" ");
        if(sizeOrType === "dir") {
            fileTree[name] = {};
            continue;
        }

        fileTree[name] = sizeOrType;
    }

    return fileTree;
}

function getDirectorySizes(fileTree: any, limit: number = Infinity) {
    function getDirectorySizesRecursive(fileTree: any, limit: number, sumArray: number[] = [], root = true) {
        let sum = 0;
    
        for(const file in fileTree) {
            if(Number.isNaN(Number(fileTree[file]))) {
                const size = getDirectorySizesRecursive(fileTree[file], limit, sumArray, false);
                if(!Array.isArray(size)) {
                    sum += size;
                }
                continue;
            }
    
            const value = Number(fileTree[file]);
            sum += value;
        }
    
        if(sum <= limit) sumArray.push(sum);
        if(root) return sumArray;
        return sum;
    }

    const sizes = getDirectorySizesRecursive(fileTree, limit);
    return Array.isArray(sizes) ? sizes : [sizes];
}

function getUsedSpace(fileTree: any, sum = 0) {
    for(const file in fileTree) {
        if(Number.isNaN(Number(fileTree[file]))) {
            sum = getUsedSpace(fileTree[file], sum);
            continue;
        }

        const value = Number(fileTree[file]);
        sum += value;
    }
    
    return sum;
}

function getFreeSpace(fileTree: any) {
    return 70000000 - getUsedSpace(fileTree);
}

function findDirectorySizeToDelete(fileTree: any, requiredSpace = 30000000) {
    const spaceNeeded = requiredSpace - getFreeSpace(fileTree);

    const sizes = getDirectorySizes(fileTree);
    let directorySize = Infinity;
    for(const size of sizes) {
        if(spaceNeeded <= size && directorySize > size) {
            directorySize = size;
        }
    }

    return directorySize;
}

start();