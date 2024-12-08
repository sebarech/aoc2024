import run from "aocrunner";

interface Antennas {
  [key: string]: number[][];
}

const parseInput = (rawInput: string): string => rawInput;

const part1 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  const map: string[][] = buildMap(input);
  const rows: number = map.length;
  const cols: number = map[0].length;
  const antennas: Antennas = findAntennas(map);
  const antiNodes: Set<number[]> = findAntiNodes(antennas);

  const result: Set<String> = new Set();
  antiNodes.forEach(([x,y]: number[]): void => {
    if(x >= 0 && x < cols && y >= 0 && y < rows) {
      result.add(`${x}-${y}`);
    }
  });

  return result.size;
};

const part2 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  const map: string[][] = buildMap(input);
  const antennas: Antennas = findAntennas(map);
  const antiNodes: Set<string> = findAntiNodesFlat(map, antennas);

  return antiNodes.size;
};

const buildMap = (input: string): string[][] => {
  return input.split("\n").map((row) => row.split(""));
}

const findAntennas = (map: string[][]): Antennas => {
  let antennas: Antennas = {};

  for (let y: number = 0; y < map.length; y++) {
    for (let x: number = 0; x < map[y].length; x++) {
      if (map[y][x] !== '.') {
        if(antennas[map[y][x]] === undefined) {
          antennas[map[y][x]] = [];
        }
        antennas[map[y][x]].push([ x, y ]);
      }
    }
  }

  return antennas;
}

const findAntiNodes = (antennas: Antennas): Set<number[]> => {
  const antiNodes: Set<number[]> = new Set();
  Object.values(antennas).forEach((antenna: number[][]): void => {
    for(let i: number = 0; i < antenna.length; i++) {
      for(let j: number = i + 1; j < antenna.length; j++) {
        const [x1, y1] = antenna[i];
        const [x2, y2] = antenna[j];
        antiNodes.add([2*x1 - x2, 2*y1 - y2]);
        antiNodes.add([2*x2 - x1, 2*y2 - y1]);
      }
    }
  });

  return antiNodes;
}

const findAntiNodesFlat = (map: string[][], antennas: Antennas): Set<string> => {
  const antiNodes = new Set<string>();
  Object.entries(antennas).forEach(([antenna, locations]: [string, number[][]]): void => {
    locations.forEach(([locX, locY]): void => {
      antiNodes.add(`${locX},${locY}`);
      const otherAntennas: number[][] = locations.filter(([x, y]: number[]): boolean => x !== locX || y !== locY);

      otherAntennas.forEach(([otherLocX, otherLocY]: number[]): void => {
        const xDist: number = locX - otherLocX;
        const yDist: number = locY - otherLocY;

        let antiX: number = locX + xDist;
        let antiY: number = locY + yDist;

        while (antiX >= 0 && antiX < map[0].length && antiY >= 0 && antiY < map.length) {
          antiNodes.add(`${antiX},${antiY}`);
          antiX += xDist;
          antiY += yDist;
        }
      });
    });
  });

  return antiNodes;
}

run({
  part1: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
