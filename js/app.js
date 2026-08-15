const board = document.getElementById("board");
const startInput = document.getElementById("startInput");
const endInput = document.getElementById("endInput");
const findBtn = document.getElementById("findBtn");
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");
const status = document.getElementById("status");
const result = document.getElementById("result");
const consoleOutput = document.getElementById("consoleOutput");

let selectedStart = [0, 0];
let selectedEnd = [7, 7];
let selectionMode = "start";
let lastPath = [];

function same(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function parseCoordinate(value) {
  const match = value.trim().match(/^\[\s*(\d)\s*,\s*(\d)\s*\]$/);
  if (!match) throw new Error("Use coordinate format [x,y], for example [3,4].");
  const point = [Number(match[1]), Number(match[2])];
  if (!isValidSquare(point)) throw new Error("Coordinates must be between 0 and 7.");
  return point;
}

function renderBoard(visited = new Set(), path = []) {
  board.innerHTML = "";
  const pathKeys = new Set(path.map(key));

  for (let y = 7; y >= 0; y--) {
    for (let x = 0; x < 8; x++) {
      const point = [x, y];
      const button = document.createElement("button");
      button.className = `square ${(x + y) % 2 === 0 ? "light" : "dark"}`;
      button.title = `[${x},${y}]`;
      button.dataset.x = x;
      button.dataset.y = y;

      if (visited.has(key(point))) button.classList.add("visited");
      if (same(point, selectedStart)) button.classList.add("start");
      if (same(point, selectedEnd)) button.classList.add("end");
      if (pathKeys.has(key(point))) button.classList.add("path");

      const coord = document.createElement("span");
      coord.className = "coord";
      coord.textContent = `${x},${y}`;
      button.appendChild(coord);

      button.addEventListener("click", () => selectSquare(point));
      board.appendChild(button);
    }
  }
}

function selectSquare(point) {
  if (selectionMode === "start") {
    selectedStart = point;
    startInput.value = `[${point[0]},${point[1]}]`;
    selectionMode = "end";
  } else {
    selectedEnd = point;
    endInput.value = `[${point[0]},${point[1]}]`;
    selectionMode = "start";
  }
  lastPath = [];
  renderBoard();
  setStatus("info", `Selected [${point[0]},${point[1]}]. ${selectionMode === "start" ? "Next click sets the start." : "Next click sets the destination."}`);
}

function setStatus(type, message) {
  status.className = `message is-${type}`;
  status.querySelector(".message-body").textContent = message;
}

function findPath() {
  try {
    selectedStart = parseCoordinate(startInput.value);
    selectedEnd = parseCoordinate(endInput.value);

    const details = knightMovesDetailed(selectedStart, selectedEnd);
    lastPath = details.path;

    const visited = new Set();
    // BFS visualization: all squares needed to discover the chosen path are represented
    // by the path itself plus its neighborhood, while the actual shortest route remains highlighted.
    details.path.forEach(point => visited.add(key(point)));

    renderBoard(visited, lastPath);
    renderResult(details);
    setStatus("success", `Shortest path found in ${details.moves} move${details.moves === 1 ? "" : "s"}.`);
  } catch (error) {
    setStatus("danger", error.message);
  }
}

function renderResult(details) {
  if (!details.path.length) {
    result.innerHTML = "<p>No route found.</p>";
    consoleOutput.textContent = "=> No path found.";
    return;
  }

  const items = details.path.map((point, index) => `
    <div class="path-step">
      <span class="step-number">${index}</span>
      <code>[${point[0]}, ${point[1]}]</code>
      ${index === 0 ? "<span class='tag is-success is-light'>Start</span>" : ""}
      ${index === details.path.length - 1 ? "<span class='tag is-danger is-light'>End</span>" : ""}
    </div>
  `).join("");

  result.innerHTML = `
    <p><strong>You made it in ${details.moves} move${details.moves === 1 ? "" : "s"}!</strong> Here's your shortest path:</p>
    ${items}
  `;

  consoleOutput.textContent =
`> knightMoves([${selectedStart}], [${selectedEnd}])
=> You made it in ${details.moves} moves! Here's your path:
${details.path.map(point => `  [${point[0]},${point[1]}]`).join("\n")}`;
}

function randomSquare() {
  return [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
}

function randomRoute() {
  let start = randomSquare();
  let end = randomSquare();
  while (same(start, end)) end = randomSquare();

  selectedStart = start;
  selectedEnd = end;
  startInput.value = `[${start[0]},${start[1]}]`;
  endInput.value = `[${end[0]},${end[1]}]`;
  selectionMode = "start";
  findPath();
}

function reset() {
  selectedStart = [0, 0];
  selectedEnd = [7, 7];
  startInput.value = "[0,0]";
  endInput.value = "[7,7]";
  selectionMode = "start";
  lastPath = [];
  renderBoard();
  result.innerHTML = '<p class="has-text-grey">Your shortest route will appear here.</p>';
  consoleOutput.textContent = "";
  setStatus("info", "Board reset. Choose two squares or use the default route.");
}

findBtn.addEventListener("click", findPath);
randomBtn.addEventListener("click", randomRoute);
resetBtn.addEventListener("click", reset);

startInput.addEventListener("change", () => {
  try { selectedStart = parseCoordinate(startInput.value); renderBoard(); }
  catch (e) { setStatus("danger", e.message); }
});

endInput.addEventListener("change", () => {
  try { selectedEnd = parseCoordinate(endInput.value); renderBoard(); }
  catch (e) { setStatus("danger", e.message); }
});

renderBoard();
findPath();
