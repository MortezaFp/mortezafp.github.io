// ! Initial Variables

var size = 8;
let turn = "R";
let selectedLines = [];
let filledBox = [];
var isSquare = { bool: false };
const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };
let score = { R: 0, B: 0 };

const playersTurnText = (turn) =>
  `It's ${
    turn === "R" ? '<span class="txt-red">Red</span>' : '<span class="txt-blue">Blue</span>'
  }'s turn`;
const gameScoreText = (score) =>
  `<span class="txt-red">Red: ${score.R}</span> | <span class="txt-blue">Blue: ${score.B}</span>`;
const isLineSelected = (line) =>
  line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

// ! Dark Mode

const body = document.querySelector("body");
const darkModeFunction = () => {
  body.classList.toggle("dark-mode");
};
document.querySelector("#toggle-switch").addEventListener("change", darkModeFunction);

// ! Slider
const myFunction = (e) => {
  size = parseInt(e.target.value);
  document.querySelector(".field-title").setAttribute("data-length", e.target.value);
  const elements = document.querySelector(".game-grid-container");
  while (elements.children.length > 0) {
    elements.removeChild(elements.firstChild);
  }
  selectedLines = [];
  filledBox = [];
  score = { R: 0, B: 0 };
  turn = "R";
  createGameGrid();
};

const input = document.querySelector("#slider");
input.addEventListener("input", myFunction);

// ! Function to make game grid

const createGameGrid = () => {
  const gameGridContainer = document.querySelector(".game-grid-container");
  var gridString = "";
  var dotWidth = 10 / size;
  var lineWidth = (100 - dotWidth * size) / (size - 1);

  for (let i = 0; i < size; i++) {
    if (i < size - 1) {
      gridString = gridString + dotWidth.toString() + "%" + " " + lineWidth.toString() + "%" + " ";
    } else {
      gridString = gridString + dotWidth.toString() + "%";
    }
  }
  gameGridContainer.style.gridTemplateColumns = gridString;
  gameGridContainer.style.gridTemplateRows = gridString;

  var rows = Array(size)
    .fill(0)
    .map((_, i) => i);
  var cols = Array(size)
    .fill(0)
    .map((_, i) => i);

  rows.forEach((row) => {
    cols.forEach((col) => {
      const dot = document.createElement("div");
      dot.setAttribute("class", "dot");

      const hLine = document.createElement("div");
      hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
      hLine.setAttribute("id", `h-${row}-${col}`);
      hLine.addEventListener("click", handleLineClick);

      gameGridContainer.appendChild(dot);
      if (col < size - 1) gameGridContainer.appendChild(hLine);
    });

    if (row < size - 1) {
      cols.forEach((col) => {
        const vLine = document.createElement("div");
        vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
        vLine.setAttribute("id", `v-${row}-${col}`);
        vLine.addEventListener("click", handleLineClick);

        const box = document.createElement("div");
        box.setAttribute("class", "box");
        box.setAttribute("id", `box-${row}-${col}`);

        gameGridContainer.appendChild(vLine);
        if (col < size - 1) gameGridContainer.appendChild(box);
      });
    }
  });

  const hLines = document.querySelectorAll(".line-horizontal")
  hLines.forEach ((line)=> {
    line.style.height = (dotWidth * 3.5).toString() + "px";
  })
  const vLines = document.querySelectorAll(".line-vertical")
  vLines.forEach ((line)=> {
    line.style.width = (dotWidth * 3.5).toString() + "px";
  })

  document.getElementById("game-score-status").innerHTML = gameScoreText(score);
  document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

// ! Function to Change Turns

const changeTurn = () => {
  const nextTurn = turn === "R" ? "B" : "R";
  document.getElementById("game-status").innerHTML = playersTurnText(nextTurn);
  const lines = document.querySelectorAll(".line-vertical, .line-horizontal");
  lines.forEach((l) => {
    l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
  });
  turn = nextTurn;
};

//  ! Function to fill a square box

const boxFill = (boxId, turn) => {
  document.getElementById(boxId).setAttribute("class", bgClasses[turn] + " box");
  if (!filledBox.includes(boxId)) {
    score[turn]++;
    isSquare.bool = true;
    filledBox = [...filledBox, boxId];
  }
};

// ! Function to check a completed square

const squareCheck = (selectedLines, lineId, turn) => {
  const myArray = lineId.split("-");
  var row = parseInt(myArray[1]);
  var col = parseInt(myArray[2]);

  isSquare.bool = false;
  const isVertical = lineId[0] == "v";
  if (isVertical) {
    if (col == size - 1) {
      if (
        selectedLines.includes(`v-${row}-${col - 1}`) &&
        selectedLines.includes(`h-${row + 1}-${col - 1}`) &&
        selectedLines.includes(`h-${row}-${col - 1}`)
      ) {
        var boxId = `box-${row}-${col - 1}`;
        boxFill(boxId, turn);
      }
    }
    if (col == "0") {
      if (
        selectedLines.includes(`v-${row}-${col + 1}`) &&
        selectedLines.includes(`h-${row + 1}-${col}`) &&
        selectedLines.includes(`h-${row}-${col}`)
      ) {
        boxId = `box-${row}-${col}`;
        boxFill(boxId, turn);
      }
    }
    if (
      selectedLines.includes(`v-${row}-${col - 1}`) &&
      selectedLines.includes(`h-${row + 1}-${col - 1}`) &&
      selectedLines.includes(`h-${row}-${col - 1}`)
    ) {
      boxId = `box-${row}-${col - 1}`;
      boxFill(boxId, turn);
    }
    if (
      selectedLines.includes(`v-${row}-${col + 1}`) &&
      selectedLines.includes(`h-${row + 1}-${col}`) &&
      selectedLines.includes(`h-${row}-${col}`)
    ) {
      boxId = `box-${row}-${col}`;
      boxFill(boxId, turn);
    }
  } else {
    if (row == size - 1) {
      if (
        selectedLines.includes(`h-${row - 1}-${col}`) &&
        selectedLines.includes(`v-${row - 1}-${col}`) &&
        selectedLines.includes(`v-${row - 1}-${col + 1}`)
      ) {
        boxId = `box-${row - 1}-${col}`;
        boxFill(boxId, turn);
      }
    }
    if (row == "0") {
      if (
        selectedLines.includes(`h-${row + 1}-${col}`) &&
        selectedLines.includes(`v-${row}-${col}`) &&
        selectedLines.includes(`v-${row}-${col + 1}`)
      ) {
        boxId = `box-${row}-${col}`;
        boxFill(boxId, turn);
      }
    }
    if (
      selectedLines.includes(`h-${row + 1}-${col}`) &&
      selectedLines.includes(`v-${row}-${col}`) &&
      selectedLines.includes(`v-${row}-${col + 1}`)
    ) {
      boxId = `box-${row}-${col}`;
      boxFill(boxId, turn);
    }
    if (
      selectedLines.includes(`h-${row - 1}-${col}`) &&
      selectedLines.includes(`v-${row - 1}-${col}`) &&
      selectedLines.includes(`v-${row - 1}-${col + 1}`)
    ) {
      boxId = `box-${row - 1}-${col}`;
      boxFill(boxId, turn);
    }
  }
};

// ! Function to handle line clicks and change turns

const handleLineClick = (e) => {
  const lineId = e.target.id;
  const selectedLine = document.getElementById(lineId);
  if (isLineSelected(selectedLine)) {
    return;
  }

  selectedLines = [...selectedLines, lineId];
  colorLine(selectedLine);
  squareCheck(selectedLines, lineId, turn);
  if (!isSquare.bool) changeTurn();

  document.getElementById("game-score-status").innerHTML = gameScoreText(score);
  if (selectedLines.length == 2 * size * (size - 1)) {
    const gameStatus = document.getElementById("game-status");
    if (score["B"] > score["R"]) {
      gameStatus.innerHTML = '<span class="txt-blue">Blue</span> Won';
    } else if (score["B"] < score["R"]) {
      gameStatus.innerHTML = '<span class="txt-red">Red</span> Won';
    } else {
      gameStatus.innerHTML = "Draw";
    }
  }
};

// ! Function to color the lines

const colorLine = (selectedLine) => {
  selectedLine.classList.remove(hoverClasses[turn]);
  selectedLine.classList.add(bgClasses[turn]);
};

createGameGrid();
