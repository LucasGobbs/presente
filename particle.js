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