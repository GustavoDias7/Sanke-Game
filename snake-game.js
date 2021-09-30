function initSnakeGame() {
  let counter = 0;
  const board = document.querySelector(".board");
  let boardArea = [10, 10];
  let cells = generateCells(board, boardArea);
  let quantCells = cells.length;
  let snake = [11];
  let foodPosition = 0;
  let nextStep;
  let score = 0;
  const record = document.querySelector(".record");
  let recordValue = localStorage.getItem("record") || 0;
  record.innerHTML = recordValue;

  setSnakeBoard(snake);
  setFoodBoard();
  setKeybordDirection();
  startGame();

  function generateCells(boardElement, axius) {
    let html = "";
    for (let i = 0; i < axius[0]; i++) {
      html += "<tr>";
      for (let j = 0; j < axius[1]; j++) {
        html += `<td></td>`;
      }
      html += "</tr>";
    }
    boardElement.innerHTML = html;
    return document.querySelectorAll(".board td");
  }

  function setSnakeBoard(snakeArr) {
    for (let i = 0; i < snakeArr.length; i++) {
      cells[snakeArr[i]].classList.add("snake");
    }
  }

  function setFoodBoard() {
    cells[foodPosition].classList.remove("food");
    foodPosition = Math.floor(Math.random() * (boardArea[0] * boardArea[1]));
    cells[foodPosition].classList.add("food");
  }

  const snakeDirection = {
    right: 1,
    down: boardArea[0],
    left: -1,
    up: -boardArea[0],
    turnRight() {
      return this.right;
    },
    turnDown() {
      return this.down;
    },
    turnLeft() {
      return this.left;
    },
    turnUp() {
      return this.up;
    },
  };
  let currDirection = snakeDirection.turnRight();

  function setKeybordDirection() {
    document.addEventListener("keydown", (event) => {
      const keyName = event.code;
      if (keyName === "KeyS" && currDirection !== snakeDirection.turnUp()) {
        currDirection = snakeDirection.turnDown();
      } else if (
        keyName === "KeyD" &&
        currDirection !== snakeDirection.turnLeft()
      ) {
        currDirection = snakeDirection.turnRight();
      } else if (
        keyName === "KeyW" &&
        currDirection !== snakeDirection.turnDown()
      ) {
        currDirection = snakeDirection.turnUp();
      } else if (
        keyName === "KeyA" &&
        currDirection !== snakeDirection.turnRight()
      ) {
        currDirection = snakeDirection.turnLeft();
      } else {
        return;
      }
    });
  }

  function moveSnake() {
    // desrenderizar a snake da tela
    snake.forEach((position) => {
      cells[position].classList.remove("snake");
    });

    // calcula e guarda o próximo passo
    nextStep = snake[0] + currDirection;

    // collision system
    if (handleBoardCollapse(nextStep)) {
      alert("Você faleceu! :(");
      return;
    }

    if (nextStep % boardArea[0] === 0 && snake[0] === nextStep - 1) {
      setPauseGame();
      alert("Você faleceu! :(");
      return;
    }

    if (snake[0] % boardArea[0] === 0 && nextStep === snake[0] - 1) {
      setPauseGame();
      alert("Você faleceu! :(");
      return;
    }

    if (snake.includes(nextStep)) {
      setPauseGame();
      alert("Você faleceu! :(");
      return;
    }
    // collision system

    // movimenta a calda
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i] = snake[i - 1];
    }

    // setar a cabeça para o próximo passo
    snake[0] = nextStep;

    // renderizar array da snake na tela no na nova posicao
    snake.forEach((position) => {
      cells[position].classList.add("snake");
    });

    // aumenta a pontuação
    setScore(snake[0], foodPosition);
  }

  function handleBoardCollapse(headPosition) {
    // out of array length
    let isCollapsed =
      headPosition >= quantCells || headPosition < 0 ? true : false;

    //finish game
    if (isCollapsed) {
      setPauseGame();
    }

    return isCollapsed;
  }

  function setScore(snakeHead, foodPosition) {
    if (snakeHead === foodPosition) {
      document.querySelector(".score").innerHTML = ++score;
      // adicionar nova calda
      snake.push(foodPosition);
      setFoodBoard();
    }
  }

  let offsetInterval;
  let isGameOn = false;
  function startGame() {
    const startGame = document.querySelector(".start-game");
    const pauseGame = document.querySelector(".pause-game");
    const speedGame = 300;
    startGame.addEventListener("click", (e) => {
      e.target.classList.add("disabled");
      if (isGameOn) return;
      isGameOn = true;
      offsetInterval = setInterval(() => {
        moveSnake();
      }, speedGame);
    });
    pauseGame.addEventListener("click", () => {
      setPauseGame();
    });
  }
  function setPauseGame() {
    clearInterval(offsetInterval);
    isGameOn = false;

    // update and set record
    if (score > recordValue) {
      localStorage.setItem("record", `${score}`);
      record.innerHTML = localStorage.getItem("record");
    }
  }
}
initSnakeGame();
