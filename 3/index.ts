import fs from "fs/promises";
import path from "path";

async function start() {
    const input = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");

    const rucksacks = input.split("\n");

    let score = 0;
    let badgeScore = 0;
    let commonItemsForAGroup: string[] = [];
    for(const rucksack of rucksacks) {
        const rucksackArray: string[] = rucksack.split("");

        const firstHalf = rucksackArray.slice(0, rucksack.length / 2);
        const secondHalf = rucksackArray.slice(rucksack.length / 2);
        
        //Get common items per rucksack part
        const uniqueCommonItemsPerRucksack: Set<string> = new Set();
        firstHalf.forEach(first => {
            secondHalf.forEach(second =>{
                if(first === second) {
                    uniqueCommonItemsPerRucksack.add(first);
                }
            });
        });

        score += calculateScore([...uniqueCommonItemsPerRucksack]);

        //Get badge and it's score
        if(commonItemsForAGroup.length === 0) {
            commonItemsForAGroup = [...rucksackArray];
        } else {
            commonItemsForAGroup = [...new Set([...commonItemsForAGroup.filter(item => rucksackArray.some(i => i === item))])];
        }

        if(commonItemsForAGroup.length === 1) {
            badgeScore += calculateScore(commonItemsForAGroup);
            commonItemsForAGroup = [];
        }
    }

    console.log(`Total score by common parts of rucksack: ${score}`);
    console.log(`Total score of badges: ${badgeScore}`);
}

function calculateScore(items: string[]) {
    let score = 0;

    for(const item of items) {
        score += item.charCodeAt(0) > 96 ? item.charCodeAt(0) - 96 : item.charCodeAt(0) - 64 + 26;
    }

    return score;
}

start();