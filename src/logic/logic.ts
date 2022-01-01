export const ROWS = 9;
export const COLS = 8;
export const CELL_SIZE = 50;

export function toKey(row: number, col: number): string {
  return row + '-' + col;
}

export function fromKey(key: string): number[] {
  return key.split('-').map(Number);
}

export type IMap = Map<string, number | string>;

// function createButtons() {
//   for (let i = 0; i < ROWS; i++) {
//     for (let j = 0; j < COLS; j++) {
//       const cell = document.createElement('button');
//       cell.style.width = CELL_SIZE + 'px';
//       cell.style.height = CELL_SIZE + 'px';
//       container.appendChild(cell);
//       const key = toKey(i, j);
//       cells.set(key, cell);

//       cell.onclick = () => {
//         if (failedBombKey !== null) {
//           return;
//         }
//         if (flaggedKeys.has(key)) {
//           return;
//         }
//         revealCells(key);
//         updateButtons();
//       };

//       cell.oncontextmenu = (e) => {
//         e.preventDefault();
//         if (failedBombKey !== null) {
//           return;
//         }
//         toggleFlag(key);
//         updateButtons();
//       };
//     }
//   }

// }

// function startGame() {
//   map = generateMap(generateBombs());
//   revealedKeys = new Set();
//   flaggedKeys = new Set();
//   failedBombKey = null;

//   if (cells) {
//     updateButtons();
//   } else {
//     cells = new Map();
//     createButtons();
//   }
// }

export function revealCells(
  map: IMap, revealedKeys: Set<string>, flaggedKeys: Set<string>,
  failedBombKey: string | null, key: string
) {
  if (map.get(key) === 'bomb') {
    failedBombKey = key;
  }
  propagateReveal(map, revealedKeys, flaggedKeys, key, new Set());
  console.log('revealedKeys :', revealedKeys);
}

// function toggleFlag(key) {
//   if (flaggedKeys.has(key)) {
//     flaggedKeys.delete(key);
//   } else {
//     flaggedKeys.add(key);
//   }
// }

export function propagateReveal(
  map: IMap, revealedKeys: Set<string>,
  flaggedKeys: Set<string>, key: string, visited: Set<string>
) {
  revealedKeys.add(key);
  visited.add(key);

  const isEmpty = !map.has(key);
  if (isEmpty) {
    flaggedKeys.delete(key);
    for (const neighborKey of getNeighbors(key)) {
      if (!visited.has(neighborKey)) {
        propagateReveal(map, revealedKeys, flaggedKeys, neighborKey, visited);
      }
    }
  }
}

function isInBounds([row, col]: number[]) {
  if (row < 0 || col < 0) {
    return false;
  }
  if (row >= ROWS || col >= COLS) {
    return false;
  }

  return true;
}

function getNeighbors(key: string) {
  const [row, col] = fromKey(key);

  return [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col + 1],
    [row + 1, col + 1],
    [row + 1, col],
    [row + 1, col - 1],
    [row, col - 1],
  ]
    .filter(isInBounds)
    .map(([r, c]) => toKey(r, c));
}

export function generateMap(seedBombs: string[]): Map<string, number> {
  const map = new Map();

  function incrementDanger(neighborKey: string) {
    if (!map.has(neighborKey)) {
      map.set(neighborKey, 1);
    } else {
      const oldVal = map.get(neighborKey);
      if (oldVal !== 'bomb') {
        map.set(neighborKey, oldVal + 1);
      }
    }
  }

  for (const key of seedBombs) {
    map.set(key, 'bomb');
    for (const neighborKey of getNeighbors(key)) {
      incrementDanger(neighborKey);
    }
  }

  return map;
}

export function generateBombs() {
  const count = Math.round(Math.sqrt(ROWS * COLS));

  const allKeys: string[] = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      allKeys.push(toKey(i, j));
    }
  }

  allKeys.sort(() => (Math.random() > 0.5 ? 1 : -1));

  return allKeys.slice(0, count);
}

// startGame();
