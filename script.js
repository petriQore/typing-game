let activewords = [];
let score = 0;
let maxscore = localStorage.getItem("maxscore") || 0;
document.getElementById("maxscore").innerHTML = "Max Score: " + maxscore;

async function fetchWordsFromFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Failed to fetch words');
        }
        const text = await response.text();
        return text.split('\n').map(word => word.trim()).filter(word => word);
    } catch (error) {
        console.error('Error fetching words:', error);
        return [];
    }
}

async function start() {
    const words = await fetchWordsFromFile('words_alpha.txt');
    console.log('Words from file:', words);
    dynamicspawn(words);
}

function wordchoice(words) {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    return randomWord;
}

function wordspawn(words) {
    const randomY = Math.random() * (window.innerHeight - 50);
    const word = document.createElement("p");
    word.innerHTML = wordchoice(words);
    word.style.fontSize = "25px";
    word.style.color = "white";
    word.style.position = "absolute";
    word.style.left = -50 + "px";
    word.style.top = randomY + "px";
    document.body.appendChild(word);
    move(word);
    activewords.push(word);
}

function move(word) {
    const moveSpeed = 1;
    const move = () => {
        word.style.left = parseInt(word.style.left) + moveSpeed + "px";
        if (parseInt(word.style.left) < window.innerWidth - 50) {
            requestAnimationFrame(move);
        } else {
            if (word.innerHTML.length > 0) {
                word.style.color = "red";
                setTimeout(function () {
                    alert("Game Over :( Your Score is: " + score + " click OK to restart the game.");
                    // Refresh the page
                    location.reload();
                }, 100);
            }
        }
    };
    requestAnimationFrame(move);
}

function update() {
    const oldest = activewords[0];
    if (oldest) {
        oldest.style.color = "green";
    }
}

function isPageHidden() {
    return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
}

document.addEventListener("keydown", function (event) {
    const key = event.key;
    const oldest = activewords[0];
    update();

    if (oldest && oldest.innerHTML[0] === key) {
        oldest.innerHTML = oldest.innerHTML.slice(1);
        if (oldest.innerHTML.length === 0) {
            oldest.remove();
            activewords.shift();
            update();
            score++;
            if (score > maxscore) {
                maxscore = score;
                localStorage.setItem("maxscore", maxscore);
            }

            document.getElementById("score").innerHTML = "Score: " + score;
            document.getElementById("maxscore").innerHTML = "Maxscore: " + maxscore;
        }
    }
});

function dynamicspawn(words) {
    let delay = 2000; 
    const min = 500; 
    const pas = 20; 
    
    function delayed() {
        console.log(delay);
        setTimeout(function() {
            if (!isPageHidden()) {
                wordspawn(words);
            }
            if (delay > min) {
                delay -= pas; 
                delayed(); 
            }
        }, delay);
    }

    delayed(); 
}

start();
