let board;
let boardWidht = 360;
let boardHeight = 640;
let context;


let birdWidht = 34;
let birdHeight = 24;
let birdX = boardWidht/8;
let birdY = boardHeight/2;
let birdImg;

let pipeArray=[];
let pipeWidht = 64;
let pipeHeight = 512;
let pipeX = boardWidht;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX=-2;
let velocityY=0;
let gravity = 0.4;

let gameOver = false;

let score =0;

let wingSound = new Audio("./media/sfx_wing.wav");
let hitSound = new Audio("./media/sfx_hit.wav");
let bgm = new Audio("./media/bgm_mario.mp3");
bgm.loop = true;
let bird={
    x: birdX,
    y: birdY,
    width: birdWidht,
    height: birdHeight
}


window.onload = function() {
    board = document.getElementById('board');
    board.width = boardWidht;
    board.height = boardHeight;
    context = board.getContext('2d');

    birdImg= new Image();
    birdImg.src = "./media/flappybird1.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./media/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./media/bottompipe.png";
    requestAnimationFrame(update); //on every frame change, call update function
    setInterval(pipeGenerator, 1500);
    document.addEventListener('keydown', moveBird);
}
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,boardWidht,boardHeight);
    velocityY += gravity;
    bird.y =Math.max(0, bird.y + velocityY);

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y >= boardHeight - birdHeight){
        gameOver =true;
    }

    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }


        if(checkCollision(bird,pipe)){
            hitSound.play();
            gameOver = true;
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidht){
        pipeArray.shift(); // to maintain the pipe array memory
    }
    context.fillStyle='white';
    
    context.font = "45px sans-serif";
    context.fillText(score,5,45);

    if(gameOver){
        context.fillStyle='black';
        context.font = "45px sans-serif";
        context.fillText('Game Over', 10,110);
        context.fillStyle='black';
        context.font = "15px sans-serif";
        context.fillText('press Space to restart', 15,125);
        bgm.pause();
        bgm.currentTime=0;
    }    
        
}
function pipeGenerator(){
    if(gameOver){
        return;
    }
    let RandompipeY = pipeY- pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4; 
    let topPipe={
        img: topPipeImg,
        x: pipeX,
        y:RandompipeY ,
        width: pipeWidht,
        height: pipeHeight,
        passed: false
    }
    
    pipeArray.push(
        topPipe
    );
    let bottomPipe={
        img: bottomPipeImg,
        x: pipeX,
        y:RandompipeY +pipeHeight + openingSpace,
        width: pipeWidht,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(
        bottomPipe
    );
}
function moveBird(e){
    
    if(e.code =='Space' ||e.code=='ArrowUp' || e.code=='KeyW'){
        if(bgm.paused){
            bgm.play();
        }
        wingSound.play();
        velocityY = -6;

        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}
function checkCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x && 
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}