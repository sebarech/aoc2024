import run from "aocrunner";

interface Direction {
  up: [number, number];
  down: [number, number];
  left: [number, number];
  right: [number, number];
}

interface DirectionPath {
  up: string;
  down: string;
  left: string;
  right: string;
}

interface GuardMoves {
  moves: number;
  visitedPositions?: Set<string>;
}

const parseInput = (rawInput: string): string => rawInput;

const part1 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  const map: string[][] = createMap(input);
  const guardStart: [number, number] = findGuardStart(map);

  return guardMoves(map, guardStart).moves;
};

const part2 = (rawInput: string) => {
  const input: string = parseInput(rawInput);
  const map: string[][] = createMap(input);
  const guardStart: [number, number] = findGuardStart(map);
  const visitedPositions: Set<string> = guardMoves(map, guardStart).visitedPositions;
  const visitedPositionsCoordinates: number[][] = Array.from(visitedPositions).map((pos) => pos.split(",").map(Number));

  let stuckCount = 0;

  for (const visitedPos of visitedPositionsCoordinates) {
    // Check if the obstacle is not placed on the guard's starting point
    if (visitedPos[0] === guardStart[0] && visitedPos[1] === guardStart[1]) {
      continue;
    }

    const newMap: string[][] = map.map(row => row.slice());
    addObstacle(newMap, visitedPos);
    const result: GuardMoves = guardMoves(newMap, guardStart);
    if(result.moves === -1) {
      stuckCount++;
    }
  }

  return stuckCount;
};

const createMap = (input: string): string[][] => {
  return input.split("\n").map((row) => row.split(""));
}

const findGuardStart = (map: string[][]): [number, number] => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "^") {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

const guardMoves = (map: string[][], guardStart: [number, number]): GuardMoves => {
  let moves: number = 0;
  let currentPos: [number, number] = guardStart;
  let currentDirection: string = "up";
  let nextPos: [number, number] = getNextPos(currentPos, currentDirection);
  const visitedPositions = new Set<string>();
  const visitedPositionsObstacles = new Set<string>();
  visitedPositionsObstacles.add(`${currentPos[0]},${currentPos[1]},${currentDirection}`);

  while (isValidPosition(map, nextPos)) {
    if (map[nextPos[0]][nextPos[1]] === "#") {
      currentDirection = turnRight(currentDirection);
      nextPos = getNextPos(currentPos, currentDirection);
    } else {
      currentPos = nextPos;
      nextPos = getNextPos(currentPos, currentDirection);
      const posKey = `${currentPos[0]},${currentPos[1]}`;
      if (!visitedPositions.has(posKey)) {
        visitedPositions.add(posKey);
        moves++;
      }
    }

    const state: string = `${currentPos[0]},${currentPos[1]},${currentDirection}`;
    if(visitedPositionsObstacles.has(state)) {
      return {moves: -1};
    }
    visitedPositionsObstacles.add(state);
  }

  return {moves, visitedPositions};
}

const addObstacle = (map: string[][], obstacle: number[]): string[][] => {
  map[obstacle[0]][obstacle[1]] = "#";
  return map;
}

const isValidPosition = (map: string[][], pos: [number, number]): boolean => {
  const [x, y] = pos;
  return x >= 0 && x < map.length && y >= 0 && y < map[0].length && map[x][y] !== " ";
}

const getNextPos = (currentPos: [number, number], direction: string): [number, number] => {
  const directions: Direction = {
    up: [currentPos[0] - 1, currentPos[1]],
    down: [currentPos[0] + 1, currentPos[1]],
    left: [currentPos[0], currentPos[1] - 1],
    right: [currentPos[0], currentPos[1] + 1],
  }

  return directions[direction];
}

const turnRight = (direction: string): string => {
  const directionPath: DirectionPath = {
    up: 'right',
    right: 'down',
    down: 'left',
    left: 'up',
  }

  return directionPath[direction];
}

run({
  part1: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
