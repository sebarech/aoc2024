import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  const matrix: number[][] = buildArray(input);

  let safe: number = 0;

  for (const report of matrix) {
    if (isSafe(report)) {
      safe++;
    }
  }

  return safe;
};

const part2 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  const matrix: number[][] = buildArray(input);

  let madeSafe: number = 0;

  for (const report of matrix) {
    let tolerable: boolean = false;

    for (let i = 0; i < report.length; i++) {
      const removed: number[] = [...report.slice(0, i), ...report.slice(i + 1)];

      if (isSafe(removed)) {
        tolerable = true;
        break;
      }
    }

    if (isSafe(report) || tolerable) madeSafe++;
  }

  return madeSafe;
};

const buildArray = (input: string): number[][] => {
  const lines = input.split("\n");
  return lines.map((line) => line.split(" ").map((n) => parseInt(n)));
}

const isSafe = (levels: number[]): boolean => {
  const differences: number[] = [];

  for (let i = 1; i < levels.length; i++) {
    differences.push(levels[i] - levels[i - 1]);
  }

  const increasing = differences.every((d) => d >= 1 && d <= 3);
  const decreasing = differences.every((d) => d <= -1 && d >= -3);

  return increasing || decreasing;
}


run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
