import run from "aocrunner";

interface Objects {
  rules: number[][];
  updates: number[][];
}

interface Updates {
  correctUpdates: number[];
  unCorrectUpdates: number[][];
}

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const objects: Objects = buildObjects(input);
  const { rules, updates } = objects;

  const correctUpdates: number[] = findUpdates(rules, updates).correctUpdates;

  return correctUpdates.reduce((acc, curr) => acc + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const objects: Objects = buildObjects(input);
  const { rules, updates } = objects;

  const unCorrectUpdates: number[][] = findUpdates(rules, updates).unCorrectUpdates;

  const reorderUpdates: number[][] = reorderBadUpdates(unCorrectUpdates, rules);

  const middleNumbers: number[] = [];
  for(const update of reorderUpdates) {
    middleNumbers.push(returnMiddleNumber(update));
  }

  return middleNumbers.reduce((acc, curr) => acc + curr, 0);
};

const buildObjects = (input: string): Objects => {
  const [rulesPart, updatesPart] = input.split('\n\n');

  const rules: number[][] = rulesPart.split('\n').map(line => line.split('|').map(Number));
  const updates: number[][] = updatesPart.split('\n').map(line => line.split(',').map(Number));

  return { rules, updates };
}

const findUpdates = (rules: number[][], updates: number[][]): Updates => {
  const correctUpdates: number[] = [];
  const unCorrectUpdates: number[][] = [];
  for(const update of updates) {
    const correctPages: boolean[] = [];
    for(let page: number = 0; page < update.length; page++) {
      for(const rule of rules) {
        if(rule[0] === update[page] && rule[1] === update[page + 1]) {
          correctPages.push(true);
          break;
        }
      }
    }
    if(correctPages.length === update.length - 1) {
      correctUpdates.push(update[Math.floor(update.length / 2)]);
    } else {
      unCorrectUpdates.push(update);
    }
  }

  return {correctUpdates, unCorrectUpdates};
}

const reorderBadUpdates = (unCorrectUpdates: number[][], rules: number[][]): number[][] => {
  const ruleMap = new Map<number, number>();

  rules.forEach(([first, second]) => {
    ruleMap.set(first, second);
  });

  unCorrectUpdates.forEach((update: number[]) => {
    const reorderedUpdate: number[] = [];
    const remainingNumbers: number[] = [];

    update.forEach((num: number) => {
      if (ruleMap.has(num)) {
        reorderedUpdate.push(num);
      } else {
        remainingNumbers.push(num);
      }
    });

    reorderedUpdate.sort((a, b) => {
      if (ruleMap.get(a) === b) return -1;
      if (ruleMap.get(b) === a) return 1;
      return 0;
    });

    update.length = 0;
    update.push(...reorderedUpdate, ...remainingNumbers);
  });

  return unCorrectUpdates;
}

const returnMiddleNumber = (update: number[]): number => {
  return update[Math.floor(update.length / 2)];
}

run({
  part1: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
