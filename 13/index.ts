import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const lines = input.split("\n").filter(l => l !== "");

    let correctnessScore = 0;
    for(let i = 0; i < lines.length; i += 2) {
        const pair: [number | any[], number | any[]] = [parseLine(lines[i]), parseLine(lines[i + 1])];
        const correct = checkIfCorrectOrder(pair);
        correctnessScore += correct ? (i / 2) + 1 : 0;
    }
    
    lines.push("[[2]]");
    lines.push("[[6]]");
    const sortedLines = lines.sort((a, b) => checkIfCorrectOrder([parseLine(a), parseLine(b)]) ? -1 : 1);
    const firstDivider = sortedLines.findIndex(l => l === "[[2]]") + 1;
    const secondDivider = sortedLines.findIndex(l => l === "[[6]]") + 1;
    
    console.log(`Sum of indices of correct pairs: ${correctnessScore}`);
    console.log(`Decoder key for distress signal: ${firstDivider * secondDivider}`);
}

function parseLine(line: string, start = 1) {
    const matrix: any[] = [];
    let nestLevel = 0;
    for(let i = start; i < line.length; i++) {
        if(line[i] === "[") {
            if(nestLevel === 0) matrix.push(parseLine(line, i + 1));
            nestLevel++;
        } else if(line[i] === "]") {
            if(nestLevel === 0) break;
            else nestLevel--;
        } else if (line[i] === ",") continue;
        else if(nestLevel === 0) {
            if(!Number.isNaN(Number(line[i - 1]))) {
                const n = matrix.pop();
                const concatedNumber = "" + n + line[i];
                matrix.push(Number(concatedNumber));
                continue;
            }
            matrix.push(Number(line[i]));
        }
    }
    
    return matrix;
}

function checkIfCorrectOrder(pairs: [any, any]): boolean | null {
    const [left, right] = pairs;

    const lengthA = Array.isArray(pairs[0]) ? pairs[0].length : 1;
    const lengthB = Array.isArray(pairs[1]) ? pairs[1].length : 1;

    const length = Math.min(lengthA, lengthB);

    for(let i = 0; i < length; i++) {
        if(Number.isInteger(left[i]) && Number.isInteger(right[i])) {
            if(left[i] === right[i]) continue;
            return left[i] < right[i];
        } else if(Array.isArray(left[i]) && Array.isArray(right[i])) {
            const order = checkIfCorrectOrder([left[i], right[i]]);
            if(order === null) continue;
            return order;
        } else if(Number.isInteger(left[i]) && Array.isArray(right[i])) {
            return checkIfCorrectOrder([[left[i]], right[i]]);
        } else if(Array.isArray(left[i]) && Number.isInteger(right[i])) {
            return checkIfCorrectOrder([left[i], [right[i]]]);
        }
    }

    if(lengthA === lengthB) return null;
    return lengthA < lengthB;
}

start();