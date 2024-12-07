import run from "aocrunner";

interface Equation {
  result: number;
  numbers: number[];
}

const parseInput = (rawInput: string): string => rawInput;

const part1 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  const equations: Equation[] = buildEquations(input);

  let result: number = 0;
  for (const equation of equations) {
    if (tryOperation(equation, false)) {
      result += equation.result;
    }
  }

  return result;
};

const part2 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  const equations: Equation[] = buildEquations(input);

  let result: number = 0;
  for (const equation of equations) {
    if (tryOperation(equation, true)) {
      result += equation.result;
    }
  }

  return result;
};

const buildEquations = (input: string): Equation[] => {
  return input.split("\n").map((equation: string) => {
    const [result, numbers] = equation.split(": ");
    return {
      result: parseInt(result),
      numbers: numbers.split(" ").map((n: string) => parseInt(n))
    };
  });
}

const tryOperation = (equation: Equation, includeConcatenation: boolean, index: number = 0, currentResult: number = 0): boolean => {
  if (index === 0) {
    currentResult = equation.numbers[index];
    index++;
  }

  if (index === equation.numbers.length) {
    return currentResult === equation.result;
  }

  const nextNumber = equation.numbers[index];
  const concatenatedNumber = parseInt(currentResult.toString() + nextNumber.toString());

  return tryOperation(equation, includeConcatenation, index + 1, currentResult + nextNumber) ||
    tryOperation(equation, includeConcatenation, index + 1, currentResult * nextNumber) ||
    (includeConcatenation && tryOperation(equation, includeConcatenation, index + 1, concatenatedNumber));
}

run({
  part1: {
    tests: [
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 11387,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
