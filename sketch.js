p5.disableFriendlyErrors = true; // disables FES

class FireWorkBullet{
  constructor(x, y, speed, dx,dy, child){
    const hearts = ['💙', '❤️', 
                    '💚', '💗',
                    '💘', '💜',
                    '🧡', '💛'];
    const randomHeart = Math.floor(Math.random()*hearts.length)
    this.color = hearts[randomHeart];
    this.particle = new Particle(
      x, y,
      dx,dy,speed, 
      this.color,
      sizeParticleBig, 40, child
    )
   
    this.children = []
    this.child = child
  
    this.exploded = false

  }
  isAlive(){
    let alive = this.particle.isAlive()
    if(!this.child && this.children.length > 0){
      const hasChildrenAlive = this.children
        .filter((value) => value.isAlive() == true)
        .length > 0
      return alive || hasChildrenAlive
    }
    return true
  }
  update(){
    if(this.exploded){
      this.children.forEach((elem) => elem.update());
    } else {
      if(!this.particle.isAlive()){
        this.exploded = true
        if(!this.child){

          const inc = 2*Math.PI / 12
          for(let i = 0; i< 2*Math.PI; i += inc){
            let dir = p5.Vector.fromAngle(i, 0.01); 
            dir.add(this.pos)

            const posX = this.particle.pos.x
            const posY = this.particle.pos.y
            const dirX = this.particle.pos.x + dir.x
            const dirY = this.particle.pos.y + dir.y
            this.children.push(
              new Particle(
                posX,
                posY,
                dirX,
                dirY,
                6,
                this.color,
                sizeParticleSmall,
                60,
                true
              ))
            
              
          }
        }
        
      }
      this.particle.update()
    }
  }
  draw(){
    this.children.forEach((elem) => elem.draw());
    if(!this.exploded){
      this.particle.draw()
    }
  }
}
class FireWorkGun {
  constructor(x,y){
    this.pos = createVector(x,y)
    this.bullets = []
  }
  update(){  
    for(let i = this.bullets.length - 1; i>=0;i-- ){
      const bullet = this.bullets[i]
      bullet.update()
      bullet.draw()
      if(!bullet.isAlive()){
        this.bullets.splice(i,1)
      } 
    }

  }
  draw(){
    fill(255);
    //circle(this.pos.x,this.pos.y, 20);
  }
  shoot(dx,dy,vel){    
    this.bullets.push(
      new FireWorkBullet(this.pos.x, this.pos.y,vel, dx, dy, false)
    )
  }
}
let gun;
let sizeParticleBig;
let sizeParticleSmall;
function mouseClicked() {
  let mouse = createVector(mouseX, mouseY)
  let dist = p5.Vector.dist(mouse, createVector(mouseX, gun.pos.y));
  gun.shoot(mouseX, mouseY, map(dist, 0, height, 10,15))
}

function setup() {
  pixelDensity(1)
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke()
  sizeParticleBig = width * 0.05
  sizeParticleSmall = width * 0.02
  gun = new FireWorkGun(width/2,height-20)
}

function draw() {
  background(20,0,40,40);
  gun.update()
  gun.draw()
  console.log(gun.bullets.length)
  console.log(frameRate())
}