import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const calories = input.split("\n");

    const elves: number[] = [];
    
    let currentElf = 0;
    calories.forEach((calory: string) => {
        elves[currentElf] = elves[currentElf] ? elves[currentElf] + Number(calory) : Number(calory);

        if(calory === "") currentElf++;
    });

    const sortedElves = elves.sort((a, b) => b - a);

    console.log(`The most calories: ${sortedElves[0]}`); //1 - elf with the most calories
    console.log(`Three elves with the most calories in total: ${sortedElves[0] + sortedElves[1] + sortedElves[2]}`); //2 - 3 elves with the most calories in total
}

start();