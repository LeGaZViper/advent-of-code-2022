import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const lines = input.split("\n");

    console.log(`20 rounds of monkey bussiness: ${firstTask(lines)}`);
    console.log(`10000 rounds of monkey bussiness with monkey modulus: ${secondTask(lines)}`);
}

function firstTask(lines: string[]) {
    const monkeys: Monkey[] = [];

    for(let i = 0; i < lines.length / 7; i++) {
        const monkeyLines = lines.slice(i * 7, (i + 1) * 7 - 1);
        monkeys.push(new Monkey(i, monkeyLines, monkeys));
    }

    for(let i = 0; i < 20; i++) {
        for(const monkey of monkeys) {
            monkey.takeTurn();
        }
    }

    const monkeyInspections: number[] = monkeys.map(monkey => monkey.totalInspections);
    const twoMostActiveMonkeysLevel = monkeyInspections.sort((a, b) => b - a).slice(0, 2).reduce((acc, curr) => acc *= curr, 1);

    return twoMostActiveMonkeysLevel;
}

function secondTask(lines: string[]) {
    const monkeys: Monkey[] = [];

    for(let i = 0; i < lines.length / 7; i++) {
        const monkeyLines = lines.slice(i * 7, (i + 1) * 7 - 1);
        monkeys.push(new Monkey(i, monkeyLines, monkeys));
    }

    for(let i = 0; i < 10000; i++) {
        for(const monkey of monkeys) {
            monkey.takeTurn(false);
        }
    }

    const monkeyInspectionsAfter10000: number[] = monkeys.map(monkey => monkey.totalInspections);
    const twoMostActiveMonkeysLevelAfter10000 = monkeyInspectionsAfter10000.sort((a, b) => b - a).slice(0, 2).reduce((acc, curr) => acc *= curr, 1);

    return twoMostActiveMonkeysLevelAfter10000;
}

class Monkey {
    private id: number;
    public items: number[];
    private firstOperand: string;
    private secondOperand: string;
    private operator: string;
    private divisibleBy: number;
    private ifTrueMonkeyId: number;
    private ifFalseMonkeyId: number; 
    public totalInspections: number = 0
    private monkeys: Monkey[];

    constructor(id: number, input: string[], monkeys: Monkey[]) {
        this.id = id;
        this.items = input[1].split(": ")[1].split(", ").map(v => Number(v));

        const operation = input[2].split("= ")[1].split(" ");
        this.firstOperand = operation[0];
        this.secondOperand = operation[2];
        this.operator = operation[1];

        this.divisibleBy = Number(input[3].split("by ")[1]);
        this.ifTrueMonkeyId = Number(input[4].split("monkey ")[1]);
        this.ifFalseMonkeyId = Number(input[5].split("monkey ")[1]);
        this.monkeys = monkeys;
    }

    public takeTurn(divisionBy3: boolean = true) {
        for(let i = 0; i < this.items.length; i++) {
            const itemValue = divisionBy3 ? Math.floor(this.inspect(this.items[i]) / 3) : this.monkeysModulus(this.inspect(this.items[i]));
            this.monkeys[itemValue % this.divisibleBy === 0 ? this.ifTrueMonkeyId : this.ifFalseMonkeyId].items.push(itemValue);
        }

        this.items = [];
    }

    private inspect(item: number) {
        this.totalInspections++;
        return this.parseOperation(item);
    }

    private parseOperation(worryLevel: number) {
        if(this.operator === "+") {
            if(this.firstOperand === "old" && this.secondOperand === "old") return worryLevel + worryLevel;
            return worryLevel + Number(this.secondOperand);
        } else {
            if(this.firstOperand === "old" && this.secondOperand === "old") return worryLevel * worryLevel;
            return worryLevel * Number(this.secondOperand);
        }
    }

    private monkeysModulus(n: number) {
        const modulus = this.monkeys.map(m => m.divisibleBy).reduce((a, b) => a * b, 1);
        return n % modulus;
    }
}

start();