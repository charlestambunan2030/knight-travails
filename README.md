# Knight's Travails Web App

A browser-based implementation of The Odin Project's Knight's Travails assignment.

## Features

- 8×8 interactive chessboard.
- Click-to-select start and destination squares.
- Input coordinates such as `[0,0]` and `[7,7]`.
- Shortest path calculation using Breadth-First Search (BFS).
- Path reconstruction using predecessor relationships.
- Random route generator.
- Responsive Bulma CSS interface.
- No build step or framework required.

## Files

- `index.html` — application UI.
- `css/styles.css` — custom styling.
- `js/knight.js` — reusable BFS algorithm.
- `js/app.js` — DOM interaction and visualization.

## Core API

```js
knightMoves([0,0], [1,2]);
// [[0,0], [1,2]]

knightMoves([0,0], [3,3]);
// One valid shortest path:
// [[0,0], [2,1], [3,3]]
```

## Run

Open `index.html` in a modern browser.

Bulma CSS is loaded from jsDelivr, so an internet connection is needed for the Bulma stylesheet. The JavaScript algorithm itself has no external dependencies.

## Algorithm

The chessboard is treated as an implicit graph:

- 64 vertices = board squares.
- Edges = legal knight moves.
- BFS explores the graph level by level.
- Because every move has equal cost, the first time BFS reaches the destination it has found a shortest path.
- A `previous` map reconstructs the complete route from destination back to start.

## Complexity

For the fixed 8×8 board, the graph contains at most 64 vertices and each vertex has at most 8 edges.

General BFS complexity is `O(V + E)`, with `O(V)` auxiliary space.

## License

Educational project.
# knight-travails
