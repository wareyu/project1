const body = document.body;
body.style.color = 'white';
body.style.fontFamily = 'Arial, sans-serif';
body.style.display = 'flex';
body.style.flexDirection = 'column';
body.style.alignItems = 'center';
body.style.justifyContent = 'center';
body.style.height = '100vh';
body.style.backgroundImage = 'url("/img/project.jpg")';
body.style.backgroundSize = 'cover';
body.style.backgroundPosition = 'center';

const heading = document.createElement('h1');
heading.textContent = 'Welcome to the Star Game!';
body.appendChild(heading);

const ticketsDiv = document.createElement('div');
ticketsDiv.style.marginTop = '20px';

const ticketCountText = document.createElement('p');
ticketCountText.textContent = 'Your tickets: 0';
ticketsDiv.appendChild(ticketCountText);
body.appendChild(ticketsDiv);

const scoresDiv = document.createElement('div');
scoresDiv.style.marginTop = '20px';

const score = document.createElement('p');
score.textContent = 'Score: 0';
scoresDiv.appendChild(score);
body.appendChild(scoresDiv);

const button = document.createElement('button');
button.textContent = 'Play';
button.style.color = 'white';
button.style.backgroundColor = 'black';
button.style.border = '2px solid white';
button.style.fontSize = '20px';
button.style.padding = '10px 20px';
button.style.cursor = 'pointer';
button.style.marginTop = '20px';
body.appendChild(button);

if (!localStorage.getItem('hasVisited')) {
    localStorage.setItem('ticketCount', 3);
    localStorage.setItem('score', 0);
    localStorage.setItem('hasVisited', 'true');
}

let ticketCount = parseInt(localStorage.getItem('ticketCount')) || 0;
let savedScore = parseInt(localStorage.getItem('score')) || 0;
score.textContent = `Score: ${savedScore}`;

ticketCountText.textContent = `Your tickets: ${ticketCount}`;

function updateTickets() {
    ticketCountText.textContent = `Your tickets: ${ticketCount}`;
    localStorage.setItem('ticketCount', ticketCount);
}

function updateScore() {
    score.textContent = `Score: ${scoreValue}`;
    localStorage.setItem('score', scoreValue);
}

function addTicketsEveryMinute() {
    setInterval(() => {
        if (ticketCount < 24) {
            ticketCount++;
            updateTickets();
        }
    }, 1800000); 
}

function startGame() {
    body.innerHTML = '';
    const gameContainer = document.createElement('div');
    gameContainer.style.position = 'relative';
    gameContainer.style.width = '100vw';
    gameContainer.style.height = '100vh';
    gameContainer.style.overflow = 'hidden';
    body.appendChild(gameContainer);

    const scoreText = document.createElement('p');
    scoreText.textContent = 'Score: 0';
    scoreText.style.color = 'white';
    scoreText.style.fontSize = '20px';
    scoreText.style.position = 'absolute';
    scoreText.style.top = '10px';
    scoreText.style.left = '10px';
    gameContainer.appendChild(scoreText);

    let scoreValue = 0;  
    function updateScore() {
        scoreText.textContent = `Score: ${scoreValue}`;
        score.textContent = `Score: ${scoreValue}`;  
    }

    let gameTime = 30;
    const timerText = document.createElement('p');
    timerText.style.color = 'white';
    timerText.style.position = 'absolute';
    timerText.style.top = '10px';
    timerText.style.right = '10px';
    timerText.style.fontSize = '20px';
    timerText.textContent = `Time: ${gameTime}s`;
    gameContainer.appendChild(timerText);

    const timer = setInterval(() => {
        gameTime--;
        timerText.textContent = `Time: ${gameTime}s`;
        if (gameTime <= 0 || scoreValue < 0) {
            clearInterval(timer);
            clearInterval(starSpawner);
            clearInterval(badStarSpawner);
            clearInterval(superStarSpawner);

            let totalScore = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
            totalScore += scoreValue;
            localStorage.setItem('score', totalScore);

            const buttonsContainer = document.createElement('div');
            body.style.display = 'flex';
            buttonsContainer.style.flexDirection = 'row'; 
            body.appendChild(buttonsContainer);

            const restartButton = document.createElement('button');
            restartButton.textContent = 'Restart Game';
            restartButton.style.color = 'white';
            restartButton.style.backgroundColor = 'black';
            restartButton.style.border = '2px solid white';
            restartButton.style.fontSize = '20px';
            restartButton.style.padding = '10px 20px';
            restartButton.style.cursor = 'pointer';
            restartButton.style.marginTop = '20px';
            restartButton.style.marginRight = '20px';
            buttonsContainer.appendChild(restartButton);

            restartButton.addEventListener('click', () => {
                if (ticketCount > 0) {  
                    ticketCount--; 
                    updateTickets();
                    startGame();
                }
            });

            const exitButton = document.createElement('button');
            exitButton.textContent = 'Exit';
            exitButton.style.color = 'white';
            exitButton.style.backgroundColor = 'black';
            exitButton.style.border = '2px solid white';
            exitButton.style.fontSize = '20px';
            exitButton.style.padding = '10px 20px';
            exitButton.style.cursor = 'pointer';
            exitButton.style.marginTop = '20px';
            buttonsContainer.appendChild(exitButton);

            exitButton.addEventListener('click', () => {
                location.reload(); 
            });
        }
    }, 1000);

    function spawnStar() {
        const star = document.createElement('div');
        star.textContent = '★'; 
        const size = Math.random() * 50 + 20;
        star.style.fontSize = `${size}px`;
        const neonColor = '#FFFFFF';
        star.style.color = neonColor;
        star.style.textShadow = `
        0 0 5px ${neonColor},
        0 0 10px ${neonColor},
        0 0 20px ${neonColor},
        0 0 40px ${neonColor},
        0 0 50px ${neonColor},
        0 0 75px ${neonColor}
        `;
        star.style.position = 'absolute';
        star.style.left = `${Math.random() * (window.innerWidth - size)}px`;
        star.style.top = '-50px';
        star.style.transition = `top 3s linear`;
        gameContainer.appendChild(star);

        setTimeout(() => {
            star.style.top = `${window.innerHeight}px`;
        }, 0);

        star.addEventListener('click', () => {
            scoreValue++;
            updateScore();
            let scale = 1;
            let growing = true;

            const animationInterval = setInterval(() => {
                if (growing) {
                    scale += 0.1; 
                    if (scale >= 1.5) growing = false; 
                } else {
                    scale -= 0.1; 
                    if (scale <= 1) {
                        clearInterval(animationInterval); 
                    }
                }

                star.style.transform = `scale(${scale})`; 
            }, 30);
            setTimeout(() => {
                star.remove();
            }, 200); 
        });

        setTimeout(() => {
            if (gameContainer.contains(star)) {
                star.remove();
            }
        }, 3000);
    }

    const starSpawner = setInterval(spawnStar, 300); 

    function spawnBadStar() {
        const badStar = document.createElement('div');
        badStar.textContent = '★';
        const size = Math.random() * 50 + 20;
        badStar.style.fontSize = `${size}px`;
        badStar.style.color = 'red';
        badStar.style.textShadow = `
        0 0 5px red,
        0 0 10px red,
        0 0 20px red,
        0 0 40px red`;
        badStar.style.position = 'absolute';
        badStar.style.left = `${Math.random() * (window.innerWidth - size)}px`;
        badStar.style.top = '-50px';
        badStar.style.transition = 'top 3s linear';
        gameContainer.appendChild(badStar);

        setTimeout(() => {
            badStar.style.top = `${window.innerHeight}px`;
        }, 0);

        badStar.addEventListener('click', () => {
            scoreValue -= 5;
            updateScore();
            let scale = 1;
            let growing = true;
            
            const animationInterval = setInterval(() => {
                if (growing) {
                    scale += 0.1; 
                    if (scale >= 1.5) growing = false; 
                } else {
                    scale -= 0.1; 
                    if (scale <= 1) {
                        clearInterval(animationInterval); 
                    }
                }

                badStar.style.transform = `scale(${scale})`; 
            }, 30);
            setTimeout(() => {
                badStar.remove();
            }, 200); 
        });
        setTimeout(() => {
            if(gameContainer.contains(badStar)) {
                badStar.remove();
            }
        }, 3000);
    }

    const badStarSpawner = setInterval(spawnBadStar, 1000); 

    function spawnSuperStar() {
        const superStar = document.createElement('div');
        superStar.textContent = '★';
        const size = Math.random() * 50 + 20;
        superStar.style.fontSize = `${size}px`;
        superStar.style.color = 'yellow';
        superStar.style.textShadow = `
        0 0 5px yellow,
        0 0 10px yellow,
        0 0 20px yellow,
        0 0 40px yellow`;
        superStar.style.position = 'absolute';
        superStar.style.left = `${Math.random() * (window.innerWidth - size)}px`;
        superStar.style.top = '-50px';
        superStar.style.transition = 'top 3s linear';
        gameContainer.appendChild(superStar);
        
        setTimeout(() => {
            superStar.style.top = `${window.innerHeight}px`;
        }, 0);
        
        superStar.addEventListener('click', () => {
        scoreValue += 10;
        updateScore();
        let scale = 1;
        let growing = true;

        const animationInterval = setInterval(() => {
            if (growing) {
                scale += 0.1; 
                if (scale >= 1.5) growing = false; 
            } else {
                scale -= 0.1; 
                if (scale <= 1) {
                    clearInterval(animationInterval); 
                }
            }

            superStar.style.transform = `scale(${scale})`; 
        }, 30);
        setTimeout(() => {
            superStar.remove();
        }, 200); 
        });
        setTimeout(() => {
            if(gameContainer.contains(superStar)) {
        superStar.remove();
            }
        }, 3000);
    }

    const superStarSpawner = setInterval(spawnSuperStar, 2000); 
}

button.addEventListener('click', () => {
    if (ticketCount > 0) {
        ticketCount--;
        updateTickets();
        startGame();
    }
});

addTicketsEveryMinute();
updateTickets();
