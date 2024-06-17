const gravity = 0.06; //重力常量,控制下降时候的速度----------------------------------------------------------------------------------
//每个关卡障碍物的数量,信息等
const stageOneBlocksInfo =
    [
  //centerX, centerY, width
  [200, 550, 120, 100, true],
  [480, 400, 120,  48, true],
  [180, 290, 120,  48, true],
  [ 30, 300,  50,  48, true],
  [120, 160, 120,  48, true],
  [410,  60, 120,  48, true],
  //-----------------------------
  // [540, 530, 100, 48, true],
  // [220, 450, 100, 48, true],
  // [220, 200, 100, 48, true],
  // [ 20, 325,  80, 48, true],
  // [ 60, 100,  20, 48, true],
  // [340, 100,  20, 18, true],
  // [580,  70,  20, 18, true],
  // [ 60,   0,  20,  1, false],
  //-----------------------------
  // [320, 590,  20, 20, true],
  // [330, 570,   1, 60, false],
  // [575, 580,  20, 20, true],
  // [320, 540,  20, 20, true],

  // [100, 440,  20, 20, true],
  // [ 20, 310,  20, 40, true],
  // [130, 310,  20, 20, true],

  // [540, 440,   1, 60, false],
  // [550, 460,  20, 30, true],
  // [460, 320,  20, 20, true],
  // [520, 320,  20, 20, true],
  // [580, 320,  20, 20, true],
  // [520, 200,  20, 20, true],

  // [310, 190,  20, 20, true],
  // [170, 180,  20, 20, true],
  // [ 60, 170,  20, 20, true],
  // [240,  36,  20, 40, true],
  // [105,  45,  30, 30, true],
  //---------------------------
  // [220, 300,  40, 200, true],
  // [220, 410,  40, 380, true],
  // [420, 400,  40, 400, true],
  // [320, 100, 240, 20, true],

  // [115, 520, 40,  20, true],
  // [ 80, 380, 40,  20, true],
  // [180, 370, 40,  20, true],
  // [ 50, 250, 40,  20, true], 
  // [180, 260, 40,  20, true],
  // [180, 150, 40,  20, true],

  // [540, 290, 40,  20, true],
];

const stageTwoBlocksInfo = [
  [540, 530, 100, 48, true],
  [220, 450, 100, 48, true],
  [220, 200, 100, 48, true],
  [ 20, 325,  80, 48, true],
  [ 60, 100,  20, 48, true],
  [340, 100,  20, 18, true],
  [580,  70,  20, 18, true],
  [ 60,   0,  20,  1, false],
  //-----------------------------
  // [200, 300,  40, 200, true],
  // [400, 300,  40, 200, true],

  // [115, 520, 40,  20, true],
];

const stageThreeBlocksInfo = [
  [320, 590,  20, 20, true],
  [330, 570,   1, 60, false],
  [575, 580,  20, 20, true],
  [320, 540,  20, 20, true],

  [100, 440,  20, 20, true],
  [ 20, 310,  20, 40, true],
  [130, 310,  20, 20, true],

  [540, 440,   1, 60, false],
  [550, 460,  20, 30, true],
  [460, 320,  20, 20, true],
  [520, 320,  20, 20, true],
  [580, 320,  20, 20, true],
  [520, 200,  20, 20, true],

  [310, 190,  20, 20, true],
  [170, 180,  20, 20, true],
  [ 60, 170,  20, 20, true],
  [240,  36,  20, 40, true],
  [105,  45,  30, 30, true],
];

const stageFourBlocksInfo = [
  [220, 410,  40, 380, true],
  [420, 400,  40, 400, true],
  [320, 100, 240, 20, true],

  [115, 520, 40,  20, true],
  [ 80, 380, 40,  20, true],
  [180, 370, 40,  20, true],
  [ 50, 250, 40,  20, true], 
  [180, 260, 40,  20, true],
  [180, 150, 40,  20, true],

  [540, 290, 40,  20, true],
];

let player = null;
let stageOneBlocks = [];
let stageTwoBlocks = [];
let stageThreeBlocks = [];
let stageFourBlocks = [];
let stageFiveBlocks = [];
let slopeImg = null;
let shindaiImg = null;
let tsukakenImg = null;
let gameState = 0;
let isDebug = false;
let jumpSound = null;
let gameStartSound = null;
let clearSound = null;
let walkingImg1, walkingImg2, jumpingImg, standingImg;　//-----修改的地方--------追加したところ---------------------

//load assets before rendering       //加载游戏中需要的图片和声音资源----------------------------------------------------------------------------------
function preload() {
  slopeImg = loadImage('./public/img/slope.png');
  shindaiImg = loadImage('./public/img/eng_front.png');
  laboImg = loadImage('./public/img/labo.jpg');
  tsukakenImg = loadImage('./public/img/tsukaken.png');
  proroomImg = loadImage('./public/img/senseibeya.jpg');

  jumpSound = new Audio();
  jumpSound.src = './public/sound/jump_sound.mp3';
  gameStartSound = new Audio();
  gameStartSound.src = './public/sound/game_start.mp3';
  clearSound = new Audio();
  clearSound.src = './public/sound/clear.mp3';

  // Load the images for the player--------修改的地方---------変わったところ----------------------------------
  walkingImg1 = loadImage('./public/img/leftLeg-removebg-preview.png');
  walkingImg2 = loadImage('./public/img/rightLeg-removebg-preview.png');
  jumpingImg = loadImage('./public/img/standPig-removebg-preview.png');
  standingImg = loadImage('./public/img/standPig-removebg-preview.png');
  // ---------------------------------修改的地方---------ここまで------------------------------------
}


//initialize HTML canvas and game objects
function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  textAlign(CENTER);
  player = new Player(width/2, height-20, 20);
  stageOneBlocks = new Array(stageOneBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(
        stageOneBlocksInfo[i][0],
        stageOneBlocksInfo[i][1],
        stageOneBlocksInfo[i][2],
        stageOneBlocksInfo[i][3],
        stageOneBlocksInfo[i][4])
  ));
  stageTwoBlocks = new Array(stageTwoBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(
        stageTwoBlocksInfo[i][0],
        stageTwoBlocksInfo[i][1],
        stageTwoBlocksInfo[i][2],
        stageTwoBlocksInfo[i][3],
        stageTwoBlocksInfo[i][4])
  ));
  stageThreeBlocks = new Array(stageThreeBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(
        stageThreeBlocksInfo[i][0],
        stageThreeBlocksInfo[i][1],
        stageThreeBlocksInfo[i][2],
        stageThreeBlocksInfo[i][3],
        stageThreeBlocksInfo[i][4])
  ));
  stageFourBlocks = new Array(stageFourBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(
        stageFourBlocksInfo[i][0],
        stageFourBlocksInfo[i][1],
        stageFourBlocksInfo[i][2],
        stageFourBlocksInfo[i][3],
        stageFourBlocksInfo[i][4])
  ));
}

//draw and update game
function draw() {
  if (gameState === 0) {
    drawStartScene();//绘制游戏开始画面
    return;
  }

  switchGameState();//根据玩家的位置切换游戏状态,不同关卡----------------------------------------------------------------------------------
  drawGameScene(gameState);//绘制当前关卡的障碍物和背景，并检测玩家与障碍物的碰撞。
  player.update();//更新玩家的位置和速度
  player.draw();//绘制玩家角色
  drawTime();//绘制游戏计时器
  if (gameState === 4) {
    const distance = dist(player.x, player.y, 250+20, 450+20);
    if (distance < 20) player.judgeClear();
  }
}

//global functions in draw  绘制游戏开始画面----------------------------------------------------------------------------------
function drawStartScene() {
    background(0);
    textFont('arial black');
    fill(255);
    textSize(64);
    text("TOZAN KING", width/2, height/2 -20);
    textSize(24);
    textFont('Impact');
    text("- press space to start -", width/2, height/2 + 20);
    fill(0);
}
//绘制当前关卡的障碍物和背景，并检测玩家与障碍物的碰撞。----------------------------------------------------------------------------------
function drawGameScene(stage) {
  if (stage === 1) {
    drawStageOne();
    stageOneBlocks.forEach((block, i) => {
      fill('#FFFFFF');//3A2012
      block.draw();
      player.detectCollision(block, i);
    });
  } else if (stage === 2) {
    drawStageTwo();
    stageTwoBlocks.forEach((block, i) => {
      fill('#99FF00');
      block.draw();
      player.detectCollision(block, i);
    });
  } else if (stage === 3) {
    drawStageThree();
    stageThreeBlocks.forEach((block, i) => {
      fill('#99CCFF');
      block.draw();
      player.detectCollision(block, i);
    });
  } else if (stage === 4) {
    drawStageFour();
    stageFourBlocks.forEach((block, i) => {
      fill('#FFCC00');
      block.draw();
      player.detectCollision(block, i);
    });
  }
}
//根据玩家的位置切换游戏状态,进入下一个关卡----------------------------------------------------------------------------------
function switchGameState() {
  if ((gameState === 1) && player.y < 0) {
    gameState = 2;
    player.y = height - player.y - player.s;
  } else if ((gameState === 2) && (player.y > height-20)) {
    gameState = 1;
    player.y = 20;
  } else if ((gameState === 2) && player.y < 0) {
    gameState = 3;
    player.y = height - player.y - player.s;
  } else if ((gameState === 3) && (player.y > height-20)) {
    gameState = 2;
    player.y = 20;
  } else if ((gameState === 3) && player.y < 0) {
    gameState = 4;
    player.y = height - player.y - player.s;
  } else if ((gameState === 4) && (player.y > height-20)) {
    gameState = 3;
    player.y = 20;
  } 
  // else if ((gameState === 4) && player.y < 0) {
  //   gameState = 5;
  //   player.y = height - player.y - player.s;
  // } else if ((gameState === 5) && (player.y > height-20)) {
  //   gameState = 4;
  //   player.y = 20;
  // }
}
//绘制游戏计时器----------------------------------------------------------------------------------
function drawTime() {
  let ellapsedSec = floor(frameCount / 60); 
  textSize(24);
  fill(255);
  stroke(0);
  rect(width-100, 30, 120, 40);
  fill(0);
  text(`${secToMin(ellapsedSec)}`, width-100, 40);
}
//秒钟转换为分钟计时----------------------------------------------------------------------------------
function secToMin(sec) {
  const minutes = floor(sec / 60);
  const seconds = sec % 60;
  const displayMinutes = minutes < 10 ? (0 + minutes.toString()) : minutes.toString();
  const displaySeconds = seconds < 10 ? 0 + seconds.toString() : seconds.toString();
  const displayTime = displayMinutes + ":" + displaySeconds;
  return displayTime;
}

function drawStageOne() {
  noStroke();
  fill('#3A2012');
  image(slopeImg, 0, 0, width, height);
  rect(width/2, height, width, 20);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
  //image(tsukakenImg, 250, 450, 40, 40);
}

function drawStageTwo() {
  stroke(0);
  fill('#99FF00');
  image(shindaiImg, 0, 0, width, height);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
}

function drawStageThree() {
  stroke(0);
  fill('#99CCFF');
  image(laboImg, 0, 0, width, height);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
}

function drawStageFour() {
  stroke(0);
  fill('#FFCC00');
  image(proroomImg, 0, 0, width, height);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
  image(tsukakenImg, 250, 450, 40, 40);
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
// ---------------------------------修改的地方---------ここまで------------------------------------
//更新当前的状态,玩家位置和速度----------------------------------------------------------------------------------
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (gameState === 1 && this.y + this.s > height) {
      this.y = height - this.s;
      this.speedY = 0;
      if (this.isJumping) {
        this.isJumping = false;
        this.speedX = 0;
      }
    }
//如果说正在跳跃的时候,重力因素应该怎么弄-----------------------------------------------------------------------------------
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
//玩家跳跃
  jump() {
    this.speedY -= 4;
    this.isJumping = true;
  }
//检测玩家与障碍物的碰撞
  detectCollision(block, index) {
    this.detectCollisionY(block, index);
    this.detectCollisionX(block);
  }

  detectCollisionY(block) {
    if ((this.speedY > 0) && this.isOnTheBlock(block)) {
      this.y = block.y - block.h/2 - this.s/2;
      this.speedY = 0;
      this.speedX = 0;
      this.isJumping = false;
    }
    
    if ((this.speedY === 0) && this.isDroppedFromBlock(block)) {
      this.isJumping = true;
    }

    //if ((this.speedY == 0) && this.isDroppedFromBlock(block)) this.isJumping = true;

    if (this.isCollideWithCeiling(block) && (this.speedY < 0)) {
      this.speedY *= -1;
      this.y = block.y + block.h/2 + this.s/2;
    }
  }

  detectCollisionX(block) {
    if (this.isCollideWithSide(block)) this.speedX *= -1;
  }
//判断玩家是否通过关卡并显示通关信息----------------------------------------------------------------------------------
  judgeClear(blockIndex) {
      fill('yellow');
      textSize(64);
      stroke(0);
      text('CLEAR!', width/2, height/2);
      clearSound.play();
      noLoop();
  }
//下面这几个都是在计算玩家与障碍物之间的距离,比如说地板,棚,左右的墙----------------------------------------------------------------------------------
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
      if (this.calcYDistanceFromCeiling(block) < 10) {
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
//障碍物类别, 属性和绘制方法----------------------------------------------------------------------------------
class Block {
  constructor(x, y, w, h, isVisible) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isVisible = isVisible;
  }
  draw() {
    if (this.isVisible === false) noFill();
    rect(this.x, this.y, this.w, this.h, 5);
  }
}

// keyEvent functions 键盘事件, 包括开始游戏,跳跃,移动----------------------------------------------------------------------------------
function keyPressed() {
  if (gameState === 0 && keyCode === 32) {
      gameState = 1;
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
  if (gameState !== 0 && player.isJumping) return;
  player.speedX = 0;
}
