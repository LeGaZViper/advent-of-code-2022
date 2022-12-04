import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const assignments = input.split("\n");

    let fullyOverlapScore = 0;
    let partiallyOverlapScore = 0;
    for(const assignment of assignments) {
        const pair = assignment.split(",");
        const sectionsForFirst = getSectionIdsFromRange(pair[0]);
        const sectionsForSecond = getSectionIdsFromRange(pair[1]);

        fullyOverlapScore += fullyOverlap(sectionsForFirst, sectionsForSecond) ? 1 : 0;
        partiallyOverlapScore += partiallyOverlap(sectionsForFirst, sectionsForSecond) ? 1 : 0;
    }

    console.log(`Number of assignments that fully overlap: ${fullyOverlapScore}`);
    console.log(`Number of assignments that partially overlap: ${partiallyOverlapScore}`);
}

function getSectionIdsFromRange(range: string) {
    const [min, max] = range.split("-");

    const ids = [];
    for(let i = Number(min); i <= Number(max); i++) {
        ids.push(i);
    }

    return ids;
}

function fullyOverlap(a: number[], b: number[]) {
    const aContainsB = a.every(item => b.includes(item));
    if(aContainsB) return true;

    const bContainsA = b.every(item => a.includes(item));
    if(bContainsA) return true;

    return false;
}

function partiallyOverlap(a: number[], b: number[]) {
    const aContainsB = a.some(item => b.includes(item));
    if(aContainsB) return true;

    const bContainsA = b.some(item => a.includes(item));
    if(bContainsA) return true;

    return false;
}

start();