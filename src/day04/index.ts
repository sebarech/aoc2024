import run from "aocrunner";

interface Coordinate {
  x: number;
  y: number;
}

const parseInput = (rawInput: string) => rawInput;

const directions: Coordinate[] = [
  { x: 0, y: 1 },  // horizontal right
  { x: 1, y: 0 },  // vertical down
  { x: 1, y: 1 },  // diagonal down-right
  { x: 1, y: -1 }, // diagonal down-left
  { x: 0, y: -1 }, // horizontal left
  { x: -1, y: 0 }, // vertical up
  { x: -1, y: -1 },// diagonal up-left
  { x: -1, y: 1 }  // diagonal up-right
];

const diagonalDirections: Coordinate[] = [
  { x: -1, y: -1 }, // top-left
  { x: -1, y: 1 },  // top-right
  { x: 1, y: -1 },  // bottom-left
  { x: 1, y: 1 }    // bottom-right
];

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput);
  const matrix: string[][] = generateMatrix(input);
  const word = "XMAS";

  return countWord(matrix, word);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const matrix: string[][] = generateMatrix(input);

  return countDiagonalMS(matrix);
};

const generateMatrix = (input: string): string[][] => {
  return input.split("\n").map((line) => line.split(""));
}

const countWord = (matrix: string[][], word: string): number => {
  let count = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      for (const direction of directions) {
        if (checkWord(matrix, word, i, j, direction)) {
          count++;
        }
      }
    }
  }
  return count;
}

const checkWord = (matrix: string[][], word: string, startX: number, startY: number, direction: Coordinate): boolean => {
  for (let i = 0; i < word.length; i++) {
    const x: number = startX + i * direction.x;
    const y: number = startY + i * direction.y;
    if (x < 0 || y < 0 || x >= matrix.length || y >= matrix[0].length || matrix[x][y] !== word[i]) {
      return false;
    }
  }
  return true;
}

const countDiagonalMS = (matrix: string[][]): number => {
  let count = 0;

  for (let i = 1; i < matrix.length - 1; i++) {
    for (let j = 1; j < matrix[0].length - 1; j++) {
      if (matrix[i][j] === 'A') {
        const [topLeft, topRight, bottomLeft, bottomRight] = diagonalDirections.map(
          (dir: Coordinate) => matrix[i + dir.x][j + dir.y]
        );

        if (
          ((topLeft === 'M' && bottomRight === 'S') || (topLeft === 'S' && bottomRight === 'M')) &&
          ((topRight === 'M' && bottomLeft === 'S') || (topRight === 'S' && bottomLeft === 'M'))
        ) {
          count++;
        }
      }
    }
  }

  return count;
};

run({
  part1: {
    tests: [
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
