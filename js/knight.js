/**
 * Knight's Travails
 * Core algorithm: Breadth-First Search on an implicit 8x8 graph.
 */

const BOARD_SIZE = 8;

const KNIGHT_MOVES = [
  [2, 1], [2, -1], [-2, 1], [-2, -1],
  [1, 2], [1, -2], [-1, 2], [-1, -2]
];

function isValidSquare([x, y]) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function key([x, y]) {
  return `${x},${y}`;
}

function getNeighbors(position) {
  return KNIGHT_MOVES
    .map(([dx, dy]) => [position[0] + dx, position[1] + dy])
    .filter(isValidSquare);
}

/**
 * Returns the shortest path from start to end.
 * Example:
 * knightMoves([0,0], [1,2])
 * => [[0,0], [1,2]]
 */
function knightMoves(start, end) {
  if (!isValidSquare(start) || !isValidSquare(end)) {
    throw new Error("Coordinates must be between 0 and 7.");
  }

  if (key(start) === key(end)) {
    return [start];
  }

  const queue = [start];
  const visited = new Set([key(start)]);
  const previous = new Map();
  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];

    for (const next of getNeighbors(current)) {
      const nextKey = key(next);
      if (visited.has(nextKey)) continue;

      visited.add(nextKey);
      previous.set(nextKey, current);

      if (nextKey === key(end)) {
        return reconstructPath(start, end, previous);
      }

      queue.push(next);
    }
  }

  return [];
}

function reconstructPath(start, end, previous) {
  const path = [end];
  let current = end;

  while (key(current) !== key(start)) {
    current = previous.get(key(current));
    if (!current) return [];
    path.push(current);
  }

  return path.reverse();
}

function knightMovesDetailed(start, end) {
  const path = knightMoves(start, end);
  return {
    path,
    moves: Math.max(0, path.length - 1),
    stops: path.length
  };
}

if (typeof module !== "undefined") {
  module.exports = {
    knightMoves,
    knightMovesDetailed,
    getNeighbors,
    isValidSquare,
    reconstructPath
  };
}
