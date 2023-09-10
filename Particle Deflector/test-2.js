let score = 0;
let scroll = 10;
let scrollBg = 0;
let runner;
let particles = [];
let backgroundImg;
let whiteParticleImg;
let restart = false;
let runnerImages = [];
let newImageImg;
let newImageVisible = false;

function preload() {
  backgroundImg = loadImage('bg.jpg');
  whiteParticleImg = loadImage('white_particle.png');
  newImageImg = loadImage('new_image.png');
  runnerImages.push(loadImage('runner.png'));
  runnerImages.push(loadImage('runner_blue.png'));
}

function setup() {
  createCanvas(700, 400);
  runner = new Runner();
}

function keyPressed() {
  if (keyCode === 32) {
    if (restart) {
      restartGame();
    } else {
      runner.setImage('runner_blue');
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    runner.setImage('runner');
  }
}

function restartGame() {
  restart = false;
  score = 0;
  scrollBg = 0;
  scroll = 10;
  particles = [];
  runner.reset();
  loop();
}

function gameOver() {
  noLoop();
  fill(255);
  textSize(24);
  text(`Game Over! Press any key to restart`, 45, height / 2);
  restart = true;
}

function draw() {
  let collisionOccurred = false;
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.move();
    particle.show();

    if (runner.collide(particle)) {
      if (particle.type === 'white' && runner.colorIndex === 1) {
        //runner.collideWithBlueParticle(particle);
        //newImageVisible = true;
        collisionOccurred = true; // Collision occurred
      } else {
        gameOver();
      }
    }

    
    if (particle.isOffScreen()) {
      particles.splice(i, 1);
    }

    if (newImageVisible && runner.colorIndex === 1) {
      image(newImageImg, width - 50, 10, 40, 40);
    } else {
      image(newImageImg, -100, -100, 0, 0); // Hide the image
    }

  }

  image(backgroundImg, -scrollBg, 0, width*2, height);
  image(backgroundImg, -scrollBg + width, 0, width*2, height);

  if (scrollBg > width) {
    scrollBg = 0;
  }

  if (random(1) < 0.75 && frameCount % 50 === 0) {
    particles.push(new Particle());
  }

  fill(255);
  textSize(32);
  textFont('monospace');
  text(`Score: ${score}`, 10, 30);

  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.move();
    particle.show();

    // if (runner.collide(particle)) {
    //   if (particle.type === 'white' && runner.colorIndex === 1) {
    //     particle.bounceAway();
    //   } else {
    //     gameOver();
    //   }
    // }

    if (particle.isOffScreen()) {
      particles.splice(i, 1);
    }
  }

  runner.show();
  runner.move();

  scroll += 0.002;
  scrollBg += scroll / 5;

  // if (newImageVisible) {
  //   image(newImageImg, width - 50, 10, 40, 40);
  // } else {
  //   image(newImageImg, -100, -100, 0, 0); // Hide the image
  // }

  if (collisionOccurred) {
    // Display new_image only when collision occurred
    image(newImageImg, width - 100, 10, 80, 80);
  } else {
    // No collision, hide the image
    image(newImageImg, -100, -100, 0, 0);
  }
}

class Runner {
  constructor() {
    this.size = 50;
    this.x = 50;
    this.y = height - this.size;
    this.vy = 0;
    this.gravity = 2;
    this.colorIndex = 0;
  }

  collideWithBlueParticle(particle) {
    let angle = radians(45);
    let distance = width;
    particle.x += cos(angle) * distance;
    particle.y -= sin(angle) * distance;
  }

  move() {
    this.y += this.vy;
    this.vy += this.gravity;
    this.y = constrain(this.y, 0, height - this.size);
  }

  collide(particle) {
    let hitX = this.x + this.size > particle.x && this.x < particle.x + particle.size;
    let hitY = this.y + this.size > particle.y && this.y < particle.y + particle.size;
    return hitX && hitY;
  }

  setImage(imageName) {
    let imageIndex = 0;
    if (imageName === 'runner_blue') {
      imageIndex = 1;
    }
    this.colorIndex = imageIndex;
  }

  reset() {
    this.size = 50;
    this.x = 50;
    this.y = height - this.size;
    this.vy = 0;
    this.colorIndex = 0;
  }
  
  show() {
    const scaledSize = this.size * 2; // Increase the size by multiplying with a scale factor
    let runnerImage = runnerImages[this.colorIndex];
    image(runnerImage, this.x, this.y, scaledSize, scaledSize);
  }
  
  // show() {
  //   let runnerImage = runnerImages[this.colorIndex];
  //   image(runnerImage, this.x, this.y, this.size, this.size);
  // }
}

class Particle {
  constructor() {
    this.size = 30;
    this.x = width;
    this.y = height - this.size;
    this.type = 'white';
    this.velocity = createVector(0, 0);
  }

  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += 0.2;
    this.velocity.mult(0.99);
    if (this.y + this.size > height) {
      this.velocity.y *= -0.8;
      if (abs(this.velocity.y) < 1) {
        this.velocity.y = 0;
        this.y = height - this.size;
      }
    }
    this.x -= scroll;
  }

  isOffScreen() {
    return this.x + this.size < 0;
  }

  show() {
    const scaledSize = this.size * 2; // Increase the size by multiplying with a scale factor
    image(whiteParticleImg, this.x, this.y, scaledSize, scaledSize);
 }
} 

//   show() {
//     image(whiteParticleImg, this.x, this.y, this.size, this.size);
//   }
// }


// class Particle {
//   constructor() {
//    // this.bounce = false;
//     this.size = 30;
//     this.x = width;
//     this.y = height - this.size;
//     this.type = 'white';
//     this.velocity = createVector(0, 0);
//   }

//   move() {
//     this.x += this.velocity.x;
//     this.y += this.velocity.y;
//     this.velocity.y += 0.2;
//     this.velocity.mult(0.99);
//     if (this.y + this.size > height) {
//       this.velocity.y *= -0.8;
//       if (abs(this.velocity.y) < 1) {
//         this.velocity.y = 0;
//         this.y = height - this.size;
//       }
//     }
//     this.x -= scroll;
//   }

//   isOffScreen() {
//     return this.x + this.size < 0;
//   }

//   // bounceAway() {
//   //   let angle = radians(45);
//   //   let distance = width;
//   //   this.x += cos(angle) * distance;
//   //   this.y -= sin(angle) * distance;
//   // }

//   show() {
//     image(whiteParticleImg, this.x, this.y, this.size, this.size);
//   }
// 