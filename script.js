const gameContainer = document.getElementById("game");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");

let COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
let timesClicked = 0;
let c1 = null;
let c2 = null;
let noClicking = false;
let score = 0;

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;

    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function generateRandomColors(numColors) {
  const randomColors = [];
  for (let i = 0; i < numColors; i++) {
    const randomColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
      Math.random() * 256
    )},${Math.floor(Math.random() * 256)})`;
    randomColors.push(randomColor);
  }
  return randomColors.concat(randomColors);
}

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");

    // Sanitize color for use as a class
    const sanitizedColor = color.replace(/\s+/g, '');
    newDiv.classList.add(sanitizedColor);

    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}


function updateScore(points) {
  score += points;
  scoreDisplay.textContent = `Score: ${score}`;

  const lowestScore = localStorage.getItem("lowestScore") || Infinity;
  if (score < lowestScore) {
    localStorage.setItem("lowestScore", score);
  }
}

function handleCardClick(event) {
  if (noClicking) return;
  if (event.target.classList.contains("flipped")) return;

  let curCard = event.target;
  curCard.style.backgroundColor = event.target.classList[0];

  if (!c1 || !c2) {
    curCard.classList.add("flipped");
    c1 = c1 || curCard;
    c2 = curCard === c1 ? null : curCard;
  }

  if (c1 && c2) {
    noClicking = true;

    let color1 = c1.className;
    let color2 = c2.className;

    if (color1 === color2) {
      timesClicked += 2;
      c1.removeEventListener("click", handleCardClick);
      c2.removeEventListener("click", handleCardClick);
      c1 = null;
      c2 = null;
      noClicking = false;
      updateScore(1);
    } else {
      setTimeout(function () {
        c1.style.backgroundColor = "";
        c2.style.backgroundColor = "";
        c1.classList.remove("flipped");
        c2.classList.remove("flipped");
        c1 = null;
        c2 = null;
        noClicking = false;
      }, 1000);
    }

    if (timesClicked === COLORS.length) {
      alert("Game over");
      startButton.disabled = false;
      restartButton.disabled = true;
    }
  }
}

// Event listener for the Start Game button
startButton.addEventListener("click", startGame);

// Event listener for the Restart Game button
restartButton.addEventListener("click", restartGame);

function startGame() {
  gameContainer.innerHTML = "";
  COLORS = generateRandomColors(6);
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  timesClicked = 0;
  updateScore(0);
  noClicking = false;
  startButton.disabled = true;
  restartButton.disabled = false;
}

function restartGame() {
  gameContainer.innerHTML = "";
  startGame();
}

// On initial load
startGame();
