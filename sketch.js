class Particle{
  constructor(x, y, dx, dy, speed, color, size, life, child){
    this.child = child
    this.visible = true
    this.pos = createVector(x,y)
    this.dir = p5.Vector.normalize(createVector(dx-x,dy-y))
    this.dir.mult(speed)
    this.color = color
    this.dirSlow = p5.Vector.normalize(createVector(dx-x,dy-y))
    this.dir.mult(speed/5)
    this.size = size;
    this.life = life;
    
    this.maxLife = life
  }
  isAlive(){
    return this.life >= 0
  }
  draw(){
    if(this.visible){
      const alpha = this.child? map(this.maxLife, 
                                    40,0,
                                    255,0) : 255;
    
      // fill(this.color.x, this.color.y, this.color.z, alpha);
      // circle(this.pos.x,this.pos.y, this.size);
      textSize(this.size);
      text(this.color,this.pos.x,this.pos.y);
     
    }
  }
  update(){
    if(this.isAlive()){
      const gravity = createVector(0,0.4)
      this.dirSlow.add(gravity)
      this.dir.lerp(this.dirSlow, 0.05)
      this.pos.add(this.dir)
      this.life--;
    } else {
      this.visible = false
    }
  }
}
class FireWorkBullet{
  constructor(x, y, speed, dx,dy, child){
    const hearts = ['💙', '❤️', 
                    '💚', '💗',
                    '💘', '💜',
                    '🧡', '💛'];
    const randomHeart = Math.floor(Math.random()*hearts.length)
    this.color = hearts[randomHeart];
    this.particle = new Particle(x,y,
                                 dx,dy,speed, 
                                 this.color, 25,40,child)
   
    this.children = []
    this.child = child
  
    this.exploded = false

  }
  isAlive(){
    let alive = this.particle.isAlive()
    print(this.children.length)
    if(!this.child && this.children.length > 0){
      const hasChildrenAlive = this.children
        .map((elem) => elem.isAlive())
        .filter((value) => value == true)
        .length > 0
      // print(`${alive}, ${hasChildrenAlive}`)
      return alive || hasChildrenAlive
    }
    return alive
  }
  update(){
    if(this.exploded){
      this.children.forEach((elem) => elem.update());
    } else {
      if(!this.particle.isAlive()){
        this.exploded = true
        if(!this.child){

          const inc = 2*Math.PI / 10
          for(let i = 0; i< 2*Math.PI; i += inc){
            let dir = p5.Vector.fromAngle(i, 0.01); 
            dir.add(this.pos)
            this.children.push(
              this.particle = new Particle(
                this.particle.pos.x,
                this.particle.pos.y,
                this.particle.pos.x + dir.x,
                this.particle.pos.y + dir.y,
                4,
                this.color,
                10,
                40,
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
      
      // if(!bullet.isAlive()){
      //   this.bullets.splice(i)
      // } 
      
    }
    for(let bullet of this.bullets){
      
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
function mouseClicked() {
  gun.shoot(mouseX, mouseY, 10)
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke()
  gun = new FireWorkGun(width/2,height-20)
}

function draw() {
  background(0,40);
  gun.update()
  gun.draw()
}