import run from "aocrunner";

interface Ids {
  leftIds: number[];
  rightIds: number[];
}

const parseInput = (rawInput: string): string => rawInput;

const part1 = (rawInput: string): number => {
  const input: Ids = buildArray(parseInput(rawInput));
  const leftIdsSorted: number[] = input.leftIds.sort((a, b) => a - b);
  const rightIdsSorted: number[] = input.rightIds.sort((a, b) => a - b);
  let distance: number = 0;

  for(let i: number = 0; i < leftIdsSorted.length; i++) {
    distance += Math.abs(leftIdsSorted[i] - rightIdsSorted[i]);
  }

  return distance;
};

const part2 = (rawInput: string): number => {
  const input: Ids = buildArray(parseInput(rawInput));
  let similarityTogether: number = 0;

  for(let i: number = 0; i < input.leftIds.length; i++) {
    const currentNumber: number = input.leftIds[i];
    const foundedHowManyTimes: number = input.rightIds.filter((rightNumber: number) => rightNumber === currentNumber).length;
    const calcSimilarity: number = currentNumber * foundedHowManyTimes;
    similarityTogether += calcSimilarity;
  }

  return similarityTogether;
};

const buildArray = (rawInput: string) : Ids => {
  const leftIds: number[] = [];
  const rightIds: number[] = [];

  const lines: string[] = rawInput.split("\n");
  lines.forEach((line: string) => {
    const [left, right] = line.split("   ");
    leftIds.push(parseInt(left));
    rightIds.push(parseInt(right));
  });

  return { leftIds, rightIds };
}

run({
  part1: {
    tests: [
      {
         input: `3   4\n4   3\n2   5\n1   3\n3   9\n3   3`,
         expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3   4\n4   3\n2   5\n1   3\n3   9\n3   3`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
