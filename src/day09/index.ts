import run from "aocrunner";

interface Disk {
  files: number[];
  emptySpaces: number[];
}

const parseInput = (rawInput: string): string => rawInput;

const part1 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  const disk = buildDisk(input);
  const sequence: string[] = buildSequence(disk);
  const orderedSequence: string[] = orderSequence(sequence);

  let result: number = 0;
  for (let i: number = 0; i < orderedSequence.length; i++) {
    result += i * parseInt(orderedSequence[i]);
  }

  return result;
};

const part2 = (rawInput: string): number => {
  const input: string = parseInput(rawInput);
  let disk = buildDisk(input);

  disk = rearrangeDisk(disk);
  disk = mergeFreeBlocks(disk);

  return calculateChecksum(disk);
};

const buildDisk = (input: string) => {
  const disk: Disk = {
    files: [],
    emptySpaces: [],
  }

  for (let i: number = 0; i < input.length; i++) {
    if(i % 2 === 0) {
      disk.files.push(parseInt(input[i]));
    } else {
      disk.emptySpaces.push(parseInt(input[i]));
    }
  }

  return disk;
}

const rearrangeDisk = (disk: Disk): Disk => {
  const maxId = Math.max(...disk.files.map((_, index) => index));

  for (let i = maxId; i >= 0; i--) {
    const fileIndex = disk.files.findIndex((_, index) => index === i);
    const freeIndex = disk.emptySpaces.findIndex(
      length => length >= disk.files[fileIndex]
    );

    if (freeIndex === -1 || fileIndex < freeIndex) continue;

    if (disk.emptySpaces[freeIndex] > disk.files[fileIndex]) {
      disk.emptySpaces[freeIndex] -= disk.files[fileIndex];
      disk.files[fileIndex] = 0;
    } else if (disk.emptySpaces[freeIndex] === disk.files[fileIndex]) {
      disk.emptySpaces[freeIndex] = 0;
      disk.files[fileIndex] = 0;
    }
  }

  return disk;
};

const buildSequence = (disk: Disk): string[] => {
  const sequence: string[] = [];
  for (let i: number = 0; i < disk.files.length; i++) {
    for (let j: number = 0; j < disk.files[i]; j++) {
      sequence.push(String(i));
    }
    if (i < disk.emptySpaces.length) {
      for (let k: number = 0; k < disk.emptySpaces[i]; k++) {
        sequence.push('.');
      }
    }
  }

  return sequence;
}

const orderSequence = (sequence: string[]): string[] => {
  const orderedSequence: string[] = [];
  let numberIndexFromBack: number = sequence.length - 1;

  for (let i: number = 0; i < sequence.length; i++) {
    if (sequence[i] === '.') {
      while (numberIndexFromBack >= 0 && sequence[numberIndexFromBack] === '.') {
        numberIndexFromBack--;
      }
      if (numberIndexFromBack >= 0 && i < numberIndexFromBack) {
        orderedSequence.push(sequence[numberIndexFromBack]);
        sequence[numberIndexFromBack] = '.';
        numberIndexFromBack--;
      }
    } else {
      orderedSequence.push(sequence[i]);
    }
  }

  return orderedSequence;
}

const mergeFreeBlocks = (disk: Disk): Disk => {
  for (let j = 0; j < disk.emptySpaces.length - 1; j++) {
    if (disk.emptySpaces[j] > 0 && disk.emptySpaces[j + 1] > 0) {
      disk.emptySpaces[j] += disk.emptySpaces[j + 1];
      disk.emptySpaces[j + 1] = 0;
    }
  }

  return disk;
};

const calculateChecksum = (disk: Disk): number => {
  let block = 0;
  let checksum = 0;

  for (let i = 0; i < disk.files.length; i++) {
    if (disk.files[i] > 0) {
      for (let j = 0; j < disk.files[i]; j++) {
        checksum += block * i;
        block++;
      }
    } else {
      block += disk.emptySpaces[i];
    }
  }

  return checksum;
};

run({
  part1: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
