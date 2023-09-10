let score = 0;
let scroll = 10;
let scrollBg = 0;
let trains = [];
let unicorn;
let failSounds = [];
let restart = false;

function preload() {
  music = loadSound('this.mp3');
  ding = loadSound('ding.mp3');
  whistle = loadSound('whistle.mp3');
  bg = loadImage('bg.jpg');
  train = loadImage('train.png');
  jumper = loadImage('unicorn.png');
  
  for (let i = 0; i < 4; i++) {
    failSounds[i] = loadSound(`fail${i+1}.mp3`);
  }
}

function setup() {
  createCanvas(700, 400);
  unicorn = new Unicorn();
  music.playMode('restart');
  music.setLoop(true);
  music.play();
  
  createP('Controls: ')
  createP('Space to jump. It\'s really that simple!')
  createP('<hr>');
  createP('Plot:');
  createP('Everytime Dan forgets the this dot a train leaves the train station. The supply of trains is running out and you equals sign have be assigned the task of letting him know and saving the train station before he runs out of this dots. Quick! Get on your unicorn and avoid the oncoming trains!')
  createP('<hr>');
  createP('Credit:')
    createP('Based on a <a href="https://thecodingtrain.com/CodingChallenges/147-chrome-dinosaur" target="_blank">coding challenge</a> by <a href="https://shiffman.net/" target="_blank">Dan Shiffman')
  createP('The Coding Train designs and characters by <a href="https://jasonheglund.com/" target="_blank">Jason Heglund</a>')
  createP('<a href="https://soundcloud.com/kristianpedersen/this-dot-feat-daniel-shiffman" target="_blank">This Dot Song</a> by <a href="https://soundcloud.com/kristianpedersen" target="_blank">Kristian Pedersen')

}

function keyPressed() {
  if (restart){
    restart = false;
    score = 0;
    scollBg = 0;
    scroll = 10;
    trains = [];
    music.play();
    loop();
  }
  if (key == ' ') {
      unicorn.jump();
      return false;
  }
}


function draw() {
  image(bg, -scrollBg, 0, width,height);
  image(bg, -scrollBg + width, 0,width,height);
  
  if (scrollBg > width) {
    scrollBg = 0;
  }
  
  if (random(1) < 0.75 && frameCount % 50 == 0) {
    trains.push(new Train())
  }

  if (score % 100 == 0 && score != 0) {
    whistle.play()
  }

  if (frameCount % 5 == 0) {
    score++;
  }
  
  fill(255)
  textSize(32);
  textFont('monospace');
  text(`Score: ${score}`, 10, 30);
      
  for (let t of trains) {
    t.move();
    t.show();

    if(unicorn.collide(t)) {
      noLoop()
      music.stop();
      let sound = random(failSounds)
      sound.play();
      
      fill(255)
      text(`Game Over! Press any key to restart`, 45, height/2)
      restart = true;
    }
  }
  
  unicorn.show()
  unicorn.move()
  
  scroll += 0.005;
  scrollBg += scroll / 5;
}

class Unicorn {
  constructor() {
    this.r = 100;
    this.x = 50;
    this.y = height - this.r;
    this.vy = 0;
    this.gravity = 2;
  }

  move() {
    this.y += this.vy;
    this.vy += this.gravity;
    
    this.y = constrain(this.y,0,height-this.r)
  }

  jump() {
    if (this.y == height - this.r) {
      this.vy = -32;
      ding.play();
    }
  }

  collide(other) {
      let hitX = this.x + this.r > other.x &&
                 this.x < other.x + other.r
      let hitY = this.y + this.r > other.y
      return(hitX && hitY)
  }

  show() {
    fill(255,127);
    //rect(this.x, this.y, this.r, this.r)
    image(jumper,this.x, this.y, this.r, this.r)
  }
}

class Train {
  constructor() {  
    this.r = 75;
    this.x = width;
    this.y = height - this.r;
  }
  
  move(){
    this.x -= scroll;
  }

  show() {
    fill(255,127);
    //rect(this.x, this.y, this.r, this.r)
    image(train,this.x, this.y, this.r, this.r)
  }
}