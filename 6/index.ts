import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    console.log(`Characters processed before 4 letter unique pattern found: ${getCharIndexAfterUniquePattern(input, 4)}`);
    console.log(`Characters processed before 14 letter unique pattern found: ${getCharIndexAfterUniquePattern(input, 14)}`);
}

function getCharIndexAfterUniquePattern(input: string, size: number) {
    let index = 0;
    const pointer = [];
    for(let i = 0; i < input.length; i++) {
        if(pointer.length < size) {
            pointer.push(input[i]);
            continue;
        }

        if((new Set(pointer)).size === size) {
            index = i;
            break;
        }

        pointer.shift();
        pointer.push(input[i]);
    }

    return index;
}

start();