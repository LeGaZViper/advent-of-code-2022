import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");
    const lines = input.split("\n");

    const cargoLastIndex = lines.findIndex(item => item === "");
    const cargos = lines.slice(0, cargoLastIndex);
    const moves = lines.slice(cargoLastIndex + 1);

    const cargoStacks = mapCargoToCargoStacks(cargos);
    const cargoStacksAllAtOnce = [...cargoStacks.map(stack => stack.slice())];

    for(let move of moves) {
        const [amount, from, to] = parseMove(move);
        moveCargoOneByOne(cargoStacks, amount, from, to);
        moveCargoAllAtOnce(cargoStacksAllAtOnce, amount, from, to);
    }

    const onTopOfEachStack = cargoStacks.map(stack => stack[0]).filter(item => item).join("");
    const onTopOfEachStackAllAtOnce = cargoStacksAllAtOnce.map(stack => stack[0]).filter(item => item).join("");

    console.log(`Crates on top: ${onTopOfEachStack}`);
    console.log(`Crates on top with a better crane: ${onTopOfEachStackAllAtOnce}`);
}

function mapCargoToCargoStacks(cargos: string[]) {
    const cargoArray: string[][] = [];
    for(let cargo of cargos) {
        const cargoSections = cargo.split("");
        if(cargoSections.includes("1")) continue;

        for(let [index, section] of cargoSections.entries()) {
            if(![" ", "[", "]"].includes(section)) {
                const cargoIndex = (index - 1) / 4;
                if(!cargoArray[cargoIndex]) cargoArray[cargoIndex] = [];
                cargoArray[cargoIndex].push(section);
            }
        }
    }

    return cargoArray;
}

function parseMove(move: string): [number, number, number] {
    const moves = move?.match(/\d+/g) ?? [];
    const response: [number, number, number] = [Number(moves[0]), Number(moves[1]) - 1, Number(moves[2]) - 1];

    return response;
}

function moveCargoOneByOne(cargoArray: string[][], amount: number, from: number, to: number) {
    for(let i = 0; i < amount; i++) {
        const removedCargo = cargoArray[from].shift();
        if(removedCargo) cargoArray[to].unshift(removedCargo);
    }
}

function moveCargoAllAtOnce(cargoArray: string[][], amount: number, from: number, to: number) {
    const removedCargoArray = [];
    for(let i = 0; i < amount; i++) {
        const removedCargo = cargoArray[from].shift();
        if(removedCargo) removedCargoArray.push(removedCargo);
    }

    cargoArray[to] = [...removedCargoArray, ...cargoArray[to]];
}

start();