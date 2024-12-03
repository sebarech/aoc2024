import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput);
  const parsedFormulas: RegExpMatchArray[] = extractFormulas(input);

  return calculate(parsedFormulas);
};

const part2 = (rawInput: string): number => {
  const input = parseInput(rawInput);
  const parsedCommands: string = extractCommands(input);
  const parsedFormulas: RegExpMatchArray[] = extractFormulas(parsedCommands);

  return calculate(parsedFormulas);
};

const extractFormulas = (rawInput: string): RegExpMatchArray[] => {
  const formulas: RegExpMatchArray = rawInput.match(/mul\(\d+,\d+\)/g);
  return formulas.map((formula: string) => formula.match(/\d+/g));
}

const extractCommands = (rawInput: string): string => {
  const commands: RegExpMatchArray = rawInput.match(/don't\(\)[\s\S]*?do\(\)/g);
  let newInput: string = rawInput;

  if (commands) {
    commands.forEach((command: string) => {
      newInput = newInput.replace(command, '');
    });
  }

  return newInput;
}

const calculate = (parsedFormulas: RegExpMatchArray[]): number => {
  let result: number = 0;
  for( const formula of parsedFormulas) {
    result += parseInt(formula[0]) * parseInt(formula[1]);
  }

  return result;
}

run({
  part1: {
    tests: [
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
