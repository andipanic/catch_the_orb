// Base Entity
function Entity(x, y, size, color) {
  this.x = x || 100
  this.y = y || 100
  this.size = size || 16
  this.color = color || "red"
  this.viewx = this.x - this.size
  this.viewy = this.y - this.size
  this.views = this.size * 2
  this.viewBox = true
  this.life = 1
  this.death = null
  this.decay = 3
  this.kills = 0
  this.lastHit = null
  this.hitColor = 'white'
  this.status = ''
  this.maxLife = 1
}

Entity.prototype.isAlive = function() {
  if(this.life > 0){
    return true
  }else{
    if(!this.death){
      this.death = new Date()
      this.status = 'Dead'
    }
    return false
  }
}

Entity.prototype.dead = function(n=0) {
  if(this.death && (new Date() - this.death) / 1000 > n){
    return true
  }
  return false
}

Entity.prototype.draw = function () {
  c.fillStyle = this.color
  c.fillRect(this.x, this.y, this.size, this.size)
  if(this.life > 0){
    c.fillStyle = 'green'
    c.fillRect(this.x, this.y - (this.size / 4), (this.size / this.maxLife) * this.life, 2)
  }
  if(this.viewBox) {
    var view = this.view()
    c.strokeStyle = this.color
    c.strokeRect(view.x, view.y, view.size, view.size)
  }
}

Entity.prototype.hit = function() {
  if(this.color != this.hitColor){
    this.lastColor = this.color
    this.color = this.hitColor
  }

  this.wasHit = true
}

Entity.prototype.update = function () {
}

Entity.prototype.view = function () {
  this.viewx = this.x - this.size
  this.viewy = this.y - this.size
  this.views = this.size * 3
  return { x: this.viewx, y: this.viewy, size: this.views}
}

// End Entity


// Orb subclass of Entity
function Orb(x, y, size, color) {
  Entity.call(this, x, y, size, color)
  this.vx = 4
  this.vy = 4
  this.maxv = Tools.r(12) + 4 
  this.dirTime = new Date().getTime()
  this.maxmove = Tools.r(5000) 
  this.life = 3
  this.maxLife = 3
}

Orb.prototype = Object.create(Entity.prototype)
Orb.prototype.constructor = Orb

Orb.prototype.update = function() {
  if(this.isAlive()){
    if(new Date().getTime() - this.dirTime > Tools.r(this.maxmove)){
      this.vx = (Tools.r(this.maxv) - (this.maxv/2))
      this.vy = (Tools.r(this.maxv) - (this.maxv/2))
      this.dirTime = new Date().getTime()
    }
    this.x += this.vx 
    this.y += this.vy
    if(this.y <= 0) this.y = 0
    if(this.x <= 0) this.x = 0
    if(this.y + this.size >= canvas.height) this.y = (canvas.height - this.size)
    if(this.x + this.size >= canvas.width) this.x = (canvas.width - this.size)
    this.status = 'Moving'
  }
  if(this.wasHit && new Date().getTime() - this.lastHit > 200) {
    this.color = this.lastColor
    this.wasHit = false
  }
  if(this.death){
    this.draw()
  }
}
// End Orb


// ElevatorOrb
function ElevatorOrb(x, y, size, color, direction){
  Orb.call(this, x, y, size, color)
  this.direction = direction || 1
  this.size = 16
  this.divs = this.life
  this.div = this.size/this.divs
  this.particles = []
  this.particle_size = this.size / 2 
  this.solid = false
  this.triggered = false
  this.particle_color = this.color
  this.viewBox = true 
}

ElevatorOrb.prototype = Object.create(Orb.prototype)
ElevatorOrb.prototype.constructor = ElevatorOrb

ElevatorOrb.prototype.reset = function(){
  this.particles = null
  this.particles = []
  for (var i = this.x; i < this.x + this.size; i += this.particle_size) {
    for (var j = this.y; j < this.y + this.size; j += this.particle_size) {
      console.log('hit')
      this.particles.push(new Particle(i, j, this.particle_size, this.particle_color, this.solid));
    }
  }
  this.finished = false
  this.triggered = false
}

ElevatorOrb.prototype.drawParticles = function() {
  if (!this.particles.length) {
    this.reset()
  }else if(this.triggered && !this.finished){
    this.particles.forEach(part => {
      if(part.alpha > .1){
        part.update()
        part.draw()
      }else{
        this.reset()
      }
    }, this)
  } 
  if(!this.particles.length) {this.draw()}
}


ElevatorOrb.prototype.draw = function() {
  c.fillStyle = this.color
  this.divs = this.life
  this.size = this.div * this.divs
  for (var i = 0; i < this.divs; i++){
    for  (var j = 0; j < this.divs; j++){
      if(j%2==0 && i%2==0 || i%2==1 && j%2==1)
        c.fillRect(this.x + (i*this.div), this.y + (j*this.div), this.div, this.div)
    }
  }
  if(this.life > 0){
    c.fillStyle = 'green'
    c.fillRect(this.x, this.y - (this.size / 4), (this.size / this.maxLife) * this.life, 2)
  } 
   if(this.viewBox) {
    var view = this.view()
    c.strokeStyle = this.color
    c.strokeRect(view.x, view.y, view.size, view.size)

  }
  if(this.death){
    this.size = this.div * this.maxLife
    var view = this.view()
    c.fillStyle = this.color
    c.fillRect(view.x, view.y, view.size, view.size)
    c.fillStyle = 'black'
    c.fillRect(this.x, this.y, this.size, this.size)
  }
}

// End ElevatorOrb

// Player subclass Entity
function Player(name) {
  Entity.call(this)
  this.vx = 4
  this.vy = 4
  this.color = "red"
  this.floor = 0
  this.name = name
  this.life = 16 
  this.keys = {'left': 37, 'right': 39, 'up': 38, 'down': 40} // arrows
  this.hitColor = Tools.getRandColor()
  this.regen = 12
  this.maxLife = 16
}

Player.prototype = Object.create(Entity.prototype)
Player.prototype.constructor = Player

Player.prototype.update = function() {
  if(this.isAlive()){
    // Left
    if (KeyHandler.pressed[this.keys.left]) {
      this.x -= this.vx;
      this.status = 'Left'
    }
    // Up
    if (KeyHandler.pressed[this.keys.up]) {
      this.y -= this.vy;
      this.status = 'Up'
    }
    // Right
    if (KeyHandler.pressed[this.keys.right]) {
      this.x += this.vx;
      this.status = 'Right'
    }
    // Down
    if (KeyHandler.pressed[this.keys.down]) {
      this.y += this.vy;
      this.status = 'Down'
    }

    // keep player in screen
    if (this.x > (canvas.height - this.size)) {
      this.x = canvas.height - this.size
    }
    if (this.x < 0) {
      this.x = 0
    }
    if (this.y > (canvas.height - this.size)) {
      this.y = (canvas.height - this.size)
    }
    if (this.y < 0) {
      this.y = 0
    }
    if(this.wasHit && new Date().getTime() - this.lastHit > 200){
      this.color = this.lastColor
      this.wasHit = false
    }
  }
}
// End Player
