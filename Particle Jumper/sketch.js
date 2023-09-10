let score = 0;
let scroll = 10;
let scrollBg = 0;
let runner;
let particles = [];
let cloudImages = [];
let backgroundImg;
let protonImg, neutronImg, quantImg, badImg;
let restart = false;
let runnerImages = [];

let protonCount = 0;
let neutronCount = 0;
let quantCount = 0;

function preload() {
  backgroundImg = loadImage('bg.jpg');
  cloudImages.push(loadImage('cloud1.png'));
  cloudImages.push(loadImage('cloud2.png'));
  protonImg = loadImage('proton.png');
  neutronImg = loadImage('neutron.png');
  quantImg = loadImage('quant.png');
  badImg = loadImage('bad.png');

  // Load the images for the runner with different colors
  runnerImages.push(loadImage('runner.png'));
  runnerImages.push(loadImage('runner_blue.png'));
  runnerImages.push(loadImage('runner_yellow.png'));
  runnerImages.push(loadImage('runner_red.png'));
}

function setup() {
  createCanvas(700, 400);
  runner = new Runner();

  createP('Controls: ')
  createP('Press any key to jump. Avoid the particles!')
  createP('<hr>');
  createP('Plot:');
  createP('Quantum Particle Runner is an exciting game where you control the runner who travels along the quantum path. The path is filled with particles like protons, neutrons, quants, and bad particles. When the runner collides with these particles, interesting things happen. Colliding with protons enlarges the runner, neutrons turn the cloud into blue, quants turn the cloud into gold, and bad particles decrease the size of the runner. Be careful and navigate through the quantum world with precision!')
  createP('<hr>');
}

function keyPressed() {
  if (keyCode === 32) { // 32 is the keycode for the space bar
    if (restart) {
      restartGame();
    } else {
      runner.jump();
    }
  }
}

function restartGame() {
  restart = false;
  score = 0;
  scrollBg = 0;
  scroll = 10;
  particles = [];
  protonCount = 0;
  neutronCount = 0;
  quantCount = 0;
  runner.reset();
  loop();
}

function handleCollision(particle) {
  if (particle.type === 'proton') {
    runner.enlarge();
    particle.turnIntoCloud('blue');
  } else if (particle.type === 'neutron') {
    runner.changeColor('blue');
    particle.turnIntoCloud('yellow');
  } else if (particle.type === 'quant') {
    runner.changeColor('yellow');
    particle.turnIntoCloud('green');
  } else if (particle.type === 'bad') {
    runner.shrink();
    particle.turnIntoCloud('red');
  }
  particle.isCollided = true;
  score++;
  if (particle.type === 'bad' && score > 3) {
    gameOver();
  }
}

function gameOver() {
  noLoop();
  fill(255);
  textSize(24);
  text(`Game Over! Press any key to restart`, 45, height / 2);
  restart = true;
}

function draw() {
  image(backgroundImg, -scrollBg, 0, width, height);
  image(backgroundImg, -scrollBg + width, 0, width, height);

  if (scrollBg > width) {
    scrollBg = 0;
  }

  if (random(1) < 0.75 && frameCount % 50 === 0) {
    particles.push(new Particle());
  }

  if (frameCount % 5 === 0) {
    score++;
  }

  fill(255);
  textSize(32);
  textFont('monospace');
  text(`Score: ${score}`, 10, 30);

  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.move();
    particle.show();

    if (runner.collide(particle)) {
      handleCollision(particle);
    }

    if (particle.isOffScreen()) {
      particles.splice(i, 1);
    }
  }

  runner.show();
  runner.move();

  scroll += 0.002;
  scrollBg += scroll / 5;

  fill(255);
  textSize(18);
  text(`Protons: ${protonCount}`, 10, 60);
  text(`Neutrons: ${neutronCount}`, 10, 90);
  text(`Quants: ${quantCount}`, 10, 120);

  if (runner.spacePressed) {
    runner.jump();
  }
}

class Runner {
  constructor() {
    this.size = 50;
    this.x = 50;
    this.y = height - this.size;
    this.vy = 0;
    this.gravity = 2;
    this.jumpForce = -25;
    this.jumpCount = 0;
    this.colorIndex = 0;
    this.spacePressed = false;
  }

  move() {
    this.y += this.vy;
    this.vy += this.gravity;
    this.y = constrain(this.y, 0, height - this.size);
  }


  jump() {
    if (this.jumpCount < 2) {
      this.vy = this.jumpForce;
      this.jumpCount++;
    }
  }

  collide(particle) {
    let hitX = this.x + this.size > particle.x && this.x < particle.x + particle.size;
    let hitY = this.y + this.size > particle.y && this.y < particle.y + particle.size;
    return hitX && hitY;
  }

  enlarge() {
    if (this.size < 100) {
      this.size += 10;
      this.colorIndex = 0;
      this.startColorTransition();
    }
  }

  changeColor(color) {
    if (color === 'blue') {
      this.colorIndex = 1;
    } else if (color === 'yellow') {
      this.colorIndex = 2;
    }
    this.startColorTransition();
  }

  shrink() {
    if (this.size > 10) {
      this.size -= 10;
      this.colorIndex = 3;
      this.startColorTransition();
      return true;
    }
    return false;
  }

  startColorTransition() {
    setTimeout(() => {
      this.colorIndex = 0;
    }, 500);
  }

  reset() {
    this.size = 50;
    this.x = 50;
    this.y = height - this.size;
    this.vy = 0;
    this.jumpCount = 0;
    this.colorIndex = 0;
  }

  keyPressed() {
    if (keyCode === 32) { // 32 is the keycode for the space bar
      this.spacePressed = true; // Set the spacePressed variable to true
    }
  }

  keyReleased() {
    if (keyCode === 32) { // 32 is the keycode for the space bar
      this.spacePressed = false; // Set the spacePressed variable to false when spacebar is released
    }
  }

  show() {
    let runnerImage = runnerImages[this.colorIndex];
    image(runnerImage, this.x, this.y, this.size, this.size);
  }
}

class Particle {
  constructor() {
    this.size = 30;
    this.x = width;
    this.y = height - this.size;
    this.type = random(['proton', 'neutron', 'quant', 'bad']);
    this.cloudImg = null;
    this.isCollided = false;
  }

  move() {
    this.x -= scroll;
  }

  isOffScreen() {
    return this.x + this.size < 0;
  }

  turnIntoCloud(color) {
    if (color === 'blue') {
      this.cloudImg = cloudImages[0];
    } else if (color === 'yellow') {
      this.cloudImg = cloudImages[1];
    } else if (color === 'green') {
      this.cloudImg = cloudImages[2];
    } else if (color === 'red') {
      this.cloudImg = cloudImages[3];
    }
  }

  show() {
    if (this.cloudImg) {
      image(this.cloudImg, this.x - 20, this.y - 30, this.size + 40, this.size + 30);
    } else {
      if (this.type === 'proton') {
        image(protonImg, this.x, this.y, this.size, this.size);
      } else if (this.type === 'neutron') {
        image(neutronImg, this.x, this.y, this.size, this.size);
      } else if (this.type === 'quant') {
        image(quantImg, this.x, this.y, this.size, this.size);
      } else if (this.type === 'bad') {
        image(badImg, this.x, this.y, this.size, this.size);
      }
    }
  }
}

function keyPressed() {
  if (keyCode === 32) { // 32 is the keycode for the space bar
    if (restart) {
      restartGame();
    } else {
      runner.jump();
    }
  }
}

function restartGame() {
  restart = false;
  score = 0;
  scrollBg = 0;
  scroll = 10;
  particles = [];
  protonCount = 0;
  neutronCount = 0;
  quantCount = 0;
  runner.reset();
  loop();
}

function handleCollision(particle) {
  if (particle.type === 'proton') {
    runner.enlarge();
    particle.turnIntoCloud('blue');
  } else if (particle.type === 'neutron') {
    runner.changeColor('blue');
    particle.turnIntoCloud('yellow');
  } else if (particle.type === 'quant') {
    runner.changeColor('yellow');
    particle.turnIntoCloud('green');
  } else if (particle.type === 'bad') {
    runner.shrink();
    particle.turnIntoCloud('red');
  }
  particle.isCollided = true;
  score++;
  if (particle.type === 'bad' && score > 3) {
    gameOver();
  }
}

function gameOver() {
  noLoop();
  fill(255);
  textSize(24);
  text(`Game Over! Press any key to restart`, 45, height / 2);
  restart = true;
}
