function initSnakeGame() {
    let counter = 0
    const board = document.querySelector('.board');
    let boardArea = [10, 10];
    let cells = generateCells(board, boardArea);
    let snake = [11];
    let foodPosition = 0;
    let nextStep;
    let score = 0;
    setSnakeBoard(snake);
    setFoodBoard();
    setKeybordDirection();
    startGame();

    function generateCells(boardElement, axius) {
        let html = '';
        for (let i = 0; i < axius[0]; i++) {
            html += '<tr>';
            for (let j = 0; j < axius[1]; j++) {
                html += `<td>${counter++}</td>`
            }
            html += '</tr>';
        }
        boardElement.innerHTML = html;
        return document.querySelectorAll('.board td')
    }

    function setSnakeBoard(snakeArr) {
        for (let i = 0; i < snakeArr.length; i++) {
            cells[snakeArr[i]].classList.add('snake')
        }
    }

    function setFoodBoard() {
        cells[foodPosition].classList.remove('food');
        foodPosition = Math.floor(Math.random() * 100);
        cells[foodPosition].classList.add('food');
    }

    const snakeDirection = {
        right: 1,
        down: 10,
        left: -1,
        up: -10,
        turnRight() { return this.right },
        turnDown() { return this.down },
        turnLeft() { return this.left },
        turnUp() { return this.up },
    };
    let currDirection = snakeDirection.turnRight();
    console.log(currDirection)

    function setKeybordDirection() {
        document.addEventListener('keydown', event => {
            const keyName = event.code;
            if (keyName === 'KeyS' && currDirection !== snakeDirection.turnUp()) {
                currDirection = snakeDirection.turnDown();
            }
            else if (keyName === 'KeyD' && currDirection !== snakeDirection.turnLeft()) {
                currDirection = snakeDirection.turnRight();
            }
            else if (keyName === 'KeyW' && currDirection !== snakeDirection.turnDown()) {
                currDirection = snakeDirection.turnUp();
            }
            else if (keyName === 'KeyA' && currDirection !== snakeDirection.turnRight()) {
                currDirection = snakeDirection.turnLeft();
            }
            else {
                return;
            }
        })
    }

    function moveSnake() {
        // desrenderizar a snake da tela
        snake.forEach(position => {
            cells[position].classList.remove('snake');
        })

        // calcula e guarda o próximo passo
        nextStep = snake[0] + currDirection;

        // movimenta a calda
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i] = snake[i - 1];
        }

        // setar a cabeça para o próximo passo
        snake[0] = nextStep;

        // renderizar array da snake na tela no na nova posicao
        snake.forEach(position => {
            cells[position].classList.add('snake');
        })

        // aumenta a pontuação
        setScore(snake[0], foodPosition);
    }

    function setScore(snakeHead, foodPosition) {
        if (snakeHead === foodPosition) {
            document.querySelector('.score').innerHTML = ++score;
            // adicionar nova calda
            snake.push(foodPosition);
            setFoodBoard();
        }
    }

    let offsetInterval;
    function startGame() {
        const startGame = document.querySelector('.start-game');
        const pauseGame = document.querySelector('.pause-game');
        const offsetIntervalInMs = 500;
        let gameOn = false;
        startGame.addEventListener('click', () => {
            if (gameOn) return;
            gameOn = true;
            offsetInterval = setInterval(() => {
                moveSnake()
            }, offsetIntervalInMs);
        })
        pauseGame.addEventListener('click', () => {
            clearInterval(offsetInterval);
            gameOn = false;
        })
    }
}
initSnakeGame();