const gravity = 0.06;
const stageOneBlockCol = "green";//各个关卡中障碍物的颜色
const stageTwoBlockCol = "gray";
const stageThreeBlockCol = "blue";
const stageFourBlockCol = "red";
const blocksInfo = [//障碍物的大小,位置,颜色等信息
  [
    [200, 550, 120, 100, stageOneBlockCol],
    [480, 400, 120,  48, stageOneBlockCol],
    [180, 320, 120,  48, stageOneBlockCol],
    [ 30, 300,  40,  48, stageOneBlockCol],
    [140, 160, 120,  48, stageOneBlockCol],
    [410,  60, 120,  48, stageOneBlockCol],
  ],
  [
    [540, 530, 100, 48, stageTwoBlockCol],
    [220, 450, 100, 48, stageTwoBlockCol],
    [220, 200, 100, 48, stageTwoBlockCol],
    [ 20, 325,  80, 48, stageTwoBlockCol],
    [ 60, 100,  24, 48, stageTwoBlockCol],
    [ 340, 100,  24, 18, stageTwoBlockCol],
    [ 580,  70,  24, 18, stageTwoBlockCol],
  ],
  [
    [580, 574,  40, 20, 'white'],
    [320, 540,  24, 20, stageThreeBlockCol],
    [ 90, 440,  26, 20, stageThreeBlockCol],
    [ 20, 330,  24, 20, stageThreeBlockCol],
    [140, 350,  30, 40, stageThreeBlockCol],
    [550, 450,  24, 20, stageThreeBlockCol],
    [460, 320,  24, 20, stageThreeBlockCol],
    [520, 310,  60, 20, stageThreeBlockCol],
    [580, 322,  24, 20, stageThreeBlockCol],
    [520, 200,  24, 20, stageThreeBlockCol],
    [300, 240,  44, 40, stageThreeBlockCol],
    [ 55, 200,  32, 40, stageThreeBlockCol],
    [235,  75,  24, 20, stageThreeBlockCol],
    [115,  65,  24, 20, 'yellow'],
  ],
];

let player = null;
let blocks = new Array(blocksInfo.length).fill(null);
let stageImages = new Array(3).fill(null);
let imagePaths = ['./public/img/slope.png', './public/img/eng_front.png', './public/img/labo.jpg'];
let tsukakenLogo = null;
let isGameStart = false;//游戏是否开始的标志
let stageNum = 0;
let jumpSound = null;
let gameStartSound = null;
let clearSound = null;
let walkingImg1, walkingImg2, jumpingImg, standingImg;　//-----修改的地方--------追加したところ---------------------

//load assets before rendering  预加载函数
function preload() {
  stageImages = stageImages.map((_v, i) => loadImage(imagePaths[i]));
  tsukakenLogo = loadImage('./public/img/tsukaken.png');

  jumpSound = new Audio();
  jumpSound.src = './public/sound/jump_sound.mp3';
  gameStartSound = new Audio();
  gameStartSound.src = './public/sound/game_start.mp3';
  clearSound = new Audio();
  clearSound.src = './public/sound/clear.mp3';
  // Load the images for the player--------修改的地方---------変わったところ----------------------------------
  walkingImg1 = loadImage('./public/img/leftLeg-removebg-preview.png');
  walkingImg2 = loadImage('./public/img/rightLeg-removebg-preview.png');
  jumpingImg = loadImage('./public/img/tsukaken_with_body.png');
  standingImg = loadImage('./public/img/standPig-removebg-preview.png');
  // ---------------------------------修改的地方---------ここまで----------

}

//initialize HTML canvas and game objects    初始化函数
function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  player = new Player(width/2, height, 40);
  blocks.forEach((_v, i) => {
    blocks[i] = new Array(blocksInfo[i].length).fill(null).map((_v, j) => ( new Block(...blocksInfo[i][j]) ));
  });
}

//draw and update game  游戏的主循环♻️  游戏状态的切换,绘制场景,更新玩家状态
function draw() {
  if (!isGameStart) {
    drawStartScene();
    return;
  }

  switchGameState();
  drawGameScene();
  player.update();
  player.draw();
  drawTime();
}

//global functions in draw
function drawStartScene() {
    background(0);
    textFont('arial black');
    fill(255);
    textSize(64);
    text("TOZAN KING", width/2, height/2);
    textSize(24);
    textFont('Impact');
    text("- press space to start -", width/2, height/2 + 40);
    fill(0);
}

function drawStage() {
  image(stageImages[stageNum], 0, 0, width, height);
  fill('gray');
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
  if (stageNum === 0) rect(width/2, height, width, 20);
}

function drawGameScene() {
  drawStage();
  blocks[stageNum].forEach((block, i) => {
    block.draw();
    player.detectCollision(block, i);
  });
  if (stageNum === 2) image(tsukakenLogo, 100, 12, 40, 40);
}

function switchGameState() {
  if (player.y - player.s/2 < 0 && stageNum !== 2) {
    stageNum++;
    player.y = height - player.y - player.s/2;
  } else if(player.y + player.s/2  < 0) {
    stageNum--;
    player.y = height - player.s;
  }
}

function drawTime() {
  let ellapsedSec = floor(frameCount / 60); 
  textSize(24);
  fill(255);
  stroke(0);
  rect(width-100, 30, 120, 40);
  fill(0);
  text(`${secToDisplayTime(ellapsedSec)}`, width-100, 30);
}


function secToDisplayTime(sec) {
  const minutes = floor(sec / 60);
  const seconds = sec % 60;
  const displayMinutes = minutes < 10 ? (0 + minutes.toString()) : minutes.toString();
  const displaySeconds = seconds < 10 ? 0 + seconds.toString() : seconds.toString();
  const displayTime = displayMinutes + ":" + displaySeconds;
  return displayTime;
}



class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.s = size;
    this.speedX = 0;
    this.speedY = 0;
    this.frameCount = 0; // 用于动画的帧计数
    this.isJumping = false;
  }
//绘制玩家的角色,静止状态和走路状态-------------------------------------修改的地方---------変わったことろ------------------------------------
//   draw() {
//     textSize(this.s * 2);
//     this.isJumping ? text("❤️", this.x, this.y) : text("🏃", this.x, this.y);//这里是那个player的样子
//   }
  draw() {
    this.frameCount++;
    if (this.isJumping) {
      image(jumpingImg, this.x - this.s, this.y - this.s, this.s * 2, this.s * 2);
    } else if (this.speedX !== 0) {
      if (this.frameCount % 30 < 15) {
        image(walkingImg1, this.x - this.s, this.y - this.s, this.s * 2, this.s * 2);
      } else {
        image(walkingImg2, this.x - this.s, this.y - this.s, this.s * 2, this.s * 2);
      }
    } else {
      image(standingImg, this.x - this.s, this.y - this.s, this.s * 2, this.s * 2);
    }
  }

    if (stageNum === 2 && this.y - this.s < 0) {
      this.speedY *-1;
    }

    if (this.isJumping) this.speedY += gravity; 

    if (this.x + this.s > width) {
      this.x = width - this.s;
      if (this.speedY !== 0) this.speedX *= -1;
    }

    if (this.x - this.s < 0) {
      this.x = this.s;
      if (this.speedY !== 0) this.speedX *= -1;
    }
  }

  jump() {
    this.speedY -= 4;
    this.isJumping = true;
  }

  detectCollision(block, index) {
    this.detectCollisionY(block, index);
    this.detectCollisionX(block);
  }

  detectCollisionY(block, index) {
    if ((this.speedY > 0 ) && this.isOnTheBlock(block)) {
      this.y = block.y - block.h/2 - this.s/2;
      this.speedY = 0;
      this.speedX = 0;
      this.isJumping = false;
      this.judgeClear(index);
    }
    
    if ((this.speedY === 0) && this.isDroppedFromBlock(block)) this.isJumping = true;

    if (this.isCollideWithCeiling(block) && (this.speedY < 0)) {
      this.speedY *= -1;
      this.y = block.y + block.h/2 + this.s/2;
    }
  }

  detectCollisionX(block) {
    if (this.isCollideWithSide(block)) this.speedX *= -1;
  }

  judgeClear(blockIndex) {
    if (stageNum == 2 && blockIndex === 13) {
      fill('yellow');
      textSize(64);
      stroke(0);
      text('CLEAR!', width/2, height/2);
      clearSound.play();
      noLoop();
    }
  }

  calcYDistanceFromFloor(block) {
    const playerBottom = this.y + this.s/2;
    const floorTop = block.y - block.h/2
    const distance = abs(playerBottom - floorTop);
    return distance;
  }

  calcYDistanceFromCeiling(block) {
    const playerTop = this.y - this.s/2;
    const ceilingTop = block.y + block.h/2;
    const distance = abs(ceilingTop - playerTop);
    return distance;
  }

  calcXDistanceFromLeftSide(block) {
    const playerLeft = this.x - this.s/2;
    const blockLeft = block.x - block.w/2;
    const distance = abs(playerLeft - blockLeft);
    return distance;
  }

  calcXDistanceFromRightSide(block) {
    const playerRight = this.x + this.s/2;
    const blockRight = block.x + block.w/2;
    const distance = abs(playerRight - blockRight);
    return distance;
  }

  isCollideWithSide(block) {
    if ((this.y > block.y - block.h/2) && (this.y < block.y + block.h/2)) {
      if ((this.calcXDistanceFromLeftSide(block) < 10) || (this.calcXDistanceFromRightSide(block) < 10)) {
        return true;
      }
    }
    return false;
  }


  isCollideWithCeiling(block) {
    if ((this.x > block.x - block.w/2) && (this.x < block.x + block.w/2)) {
      if (this.calcYDistanceFromCeiling(block) < 8) {
        return true;
      }
    }
    return false;
  }


  isOnTheBlock(block) {
    if ((this.x > block.x - block.w/2) && (this.x < block.x + block.w/2)) {
      if (this.calcYDistanceFromFloor(block) < 10) {
        return true;
      }
    }
    return false;
  }

  isDroppedFromBlock(block) {
    if ((this.x < block.x - block.w/2) || (this.x > block.x + block.w/2)) {
      if (this.calcYDistanceFromFloor(block) < 10) {
        return true;
      }
    }
    return false;
  }
}

class Block {
  constructor(x, y, w, h, col, isVisible=true) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.isVisible = isVisible;
  }

  draw() {
    if (this.isVisible) {
      fill(this.col);
      rect(this.x, this.y, this.w, this.h, 5);
    }
  }
}

// keyEvent functions  功能细节:玩家在最后关头碰到最后一个障碍物的时候认为是通关
function keyPressed() {
  if (!isGameStart && keyCode === 32) {
    isGameStart = true;
    gameStartSound.play();
  } else {
    if (player.isJumping) return;
    if (keyCode === 32) {
      player.jump();
      jumpSound.play();
    }

    if (keyCode === RIGHT_ARROW) player.speedX += 2;
    if (keyCode === LEFT_ARROW) player.speedX -= 2;
  }
}

function keyReleased() {
  if (!isGameStart || player.isJumping) return;
  player.speedX = 0;
}
