import console from "console";
import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const lines = input.split("\n");

    let cycle = 0;
    let X = 1;

    const signalStrengths: number[] = [0];
    const screen: string[][] = new Array(6).fill(0).map(() => []);

    for(const line of lines) {
        const [cyclesItTakes, output] = executeInstruction(line);

        for(let c = 0; c < cyclesItTakes; c++) {
            drawPixel(cycle, X, screen);

            cycle++;

            if(!(cycle % 20)) signalStrengths.push(X * cycle);
            if(c === cyclesItTakes - 1) X += output;
        }
    }

    const sumOfFirstSixSignals = signalStrengths.filter((num, index) => (index + 1) % 2 === 0).reduce((acc, curr) => acc += curr);
    const renderedImage = screen.map(ar => ar.join("")).join("\n");

    console.log(`Sum of signals from 20th, 60th, 100th, 140th, 180th, and 220th cycles: ${sumOfFirstSixSignals}`);
    console.log(`Image from input:\n${renderedImage}`);
}

function drawPixel(cycle: number, X: number, screen: string[][]) {
    const litPixelChar = "█"; //Replace this character if unreadable
    const currentCycleX = cycle - Math.floor(cycle / 40) *40;
    const currenctCycleY = Math.floor(cycle / 40);
    if(currentCycleX >= X - 1 && currentCycleX <= X + 1) screen[currenctCycleY][currentCycleX] = litPixelChar;
    else screen[currenctCycleY][currentCycleX] = " ";
}

function executeInstruction(line: string): [number, number] {
    const [insruction, parameter] = line.split(" ");

    if(insruction === "noop") return [1, 0];
    return [2, Number(parameter)];
}

start();