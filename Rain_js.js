//raindrops per 100 pixels
let countPerH = 50;

//Amount of splashes
let minS = 5;
let maxS = 10;

// is the water rising: yes = 1, no = 0
let rising = 0;

let raindrops = [];
let depth;
let dropsHit;
let countPer;
let scrolbar;
let draining;
let prefx;
let minDepth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  count = width * (countPerH / 100);
  if(height/4 < 200){
    minDepth = 200;
  }else{
    minDepth = height/4;
  }
  
  
  depth = minDepth;  
  dropsHit = 0;
  scrolbar = new Scrolbar();
  scrolbar.x = 100;
  draining = false;
  
  for (let i = 0; i < count; i++) {
    x = random(width);
    y = random(-height, 0);
    w = random(2, 4);
    h = random(15, 20);
    a = random(0.5, 1.5);

    raindrops[i] = new Raindrop(x, y, w, h, a, i);
  }
}

function draw() {
  noStroke();
  background(0);
  fill(0, 255, 255);
  rect(0, height - depth, width, depth);
  for (let raindrop of raindrops) {
    raindrop.show();
    raindrop.move();
    raindrop.hitBottom();
  }
  if(depth >= 5*height/6){
    draining = true;
  }else if(depth <= minDepth){
    draining = false;
  }
  if(draining){
    depth -= 2;
  }
  countPer = map(scrolbar.x, 50, 350, 0.01, 1);
  scrolbar.show();
}

function mouseDragged() {
  if(mouseY >= height - minDepth/2 - 15 && mouseY <= height - minDepth/2 + 15){
    if(mouseX >= 50 && mouseX <= 350){
      scrolbar.x = mouseX;
    }
  }
}
function mousePressed(){
  prefx = scrolbar.x;
}
function mouseReleased(){
  let dis = dist(scrolbar.x, height - minDepth/2, mouseX, mouseY);  
  if(dis < 30 && prefx == scrolbar.x){
    if(rising == 1){
      rising = 0;
    }else if(rising == 0){
      rising = 1;
    }
  }
}

class Raindrop {
  constructor(x, y, w, h, a, i) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.a = a;
    this.h = h  * this.a;
    this.dY = (height / 300);
    this.ddY = this.ddY = random(0.01, 0.1) * this.a;
    this.s = random(minS - 1, maxS - 1);
    this.i = i;
    this.splashes = [];
  }
  show() {
    if(this.i/count < countPer){
      fill(0, 255, 255);
      rect(this.x, this.y, this.w, this.h);
    }
  }
  move() {
    this.dY = this.dY + this.ddY;
    this.y = this.y + this.dY;
  }
  hitBottom() {
    if (this.y >= height - depth) {  
      if(this.i/count < countPer){
        depth = depth + (((this.w * this.h) / width) * rising);
      }
      
      for (let i = 0; i <= this.s; i++) {
        this.splashes[i] = new Splash(this.x, height - depth, this.dY, this.i);
      }
      this.y = -height;
      this.x = random(width);
      this.dY = (height / 300) * this.a;
    }
    for (let splash of this.splashes) {
      splash.show();
      splash.move();
    }
  }
}
class Splash {
  constructor(x, y, m, i) {
    this.x = x;
    this.y = y;
    this.m = m / 8;
    this.d = random(1, 5);
    this.dX = random(-0.6, 0.6) * this.m;
    this.dY = -1 * this.m;
    this.ddY = random(0.06, 0.2);
    this.i = i;
  }
  show() {
    if(this.i/count < countPer){
      fill(0, 255, 255, this.alpha);
      ellipse(this.x, this.y, this.d);
    }
  }
  move() {
    this.dY = this.dY + this.ddY;
    this.x = this.x + this.dX;
    this.y = this.y + this.dY;
  }
}

class Scrolbar{
  Constructor(){
    this.x = 100;
  }
  show(){
    stroke(255);
    strokeWeight(10);
    line(50, height - minDepth/2, 350, height - minDepth/2);
    strokeWeight(30);
    if(rising == 0){
      stroke(255,0,0);
    }else if(rising == 1){
      stroke(255,255,0);
    }
    point(this.x, height - minDepth/2);
    
    stroke(255,0,0);
    point(50, height - 2*minDepth/6);
    stroke(255,255,0);
    point(50, height - minDepth/6);
    
    
    
    
    noStroke();
    fill(0);
    textSize(25);
    textAlign(LEFT, CENTER);
    text("Amount of raindrops", 70, height - 4*minDepth/6);
    text("Rising", 70, height - 2*minDepth/6);
    text("Not rising",70, height - minDepth/6);   
  }
}
