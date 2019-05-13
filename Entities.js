// Base Entity
function Entity(x, y, size, color, viewBox) {
  this.x = x || 100
  this.y = y || 100
  this.size = size || 16
  this.colors = [color] || [Tools.getRandColor()]
  this.viewx = this.x - this.size
  this.viewy = this.y - this.size
  this.views = this.size * 2
  this.viewBox = viewBox || false 
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

Entity.prototype.addLife = function(n) {
  if(this.life < this.maxLife){
    this.life += n || 1
  }
};


Entity.prototype.dead = function(n=0) {
  if(this.death && (new Date() - this.death) / 1000 > n){
    return true
  }
  return false
}

Entity.prototype.draw = function () {
  c.fillStyle = this.colors[0]
  c.fillRect(this.x, this.y, this.size, this.size)
  this.drawLife()
  if(this.viewBox) {
    this.drawView()
  }
}

Entity.prototype.drawSprite = function(x, y, size, ctx) {
  Tools.drawSprite({'x': x, 'y': y, 'size': size, sprite: this.sprite, colors: this.colors}, ctx)

}

Entity.prototype.drawView = function() {
  var view = this.view()
  c.strokeStyle = this.colors[0]
  c.strokeRect(view.x, view.y, view.size, view.size)
};


Entity.prototype.drawLife = function(x, y, size, ctx) {
  if(this.life > 0){
    if(x && y && size){
      if(ctx){
        ctx.fillStyle = 'black'
        ctx.fillRect(x - 1, y - 1, size +2, 5)
        ctx.fillStyle = 'green'
        ctx.fillRect(x, y, (size / this.maxLife) * this.life, 3)
      }else{
        c.fillStyle = 'black'
        c.fillRect(x - 1, y - 1, size +2, 5)
        c.fillStyle = 'green'
        c.fillRect(x, y, (size / this.maxLife) * this.life, 3)
      }
    }else{
      c.fillStyle = 'black'
      c.fillRect(x - 1, y - 1, size +2, 5)
      c.fillStyle = 'green'
      c.fillRect(this.x, this.y - (this.size / 4), (this.size / this.maxLife) * this.life, 2)
    }
  }
}

Entity.prototype.hit = function() {
  if(this.colors[0] != this.hitColor){
    this.lastColor = this.colors[0]
    this.colors[0] = this.hitColor
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
  this.name = 'orb'
}

Orb.prototype = Object.create(Entity.prototype)
Orb.prototype.constructor = Orb

Orb.prototype.trigger = function(ent) {
  
};

Orb.prototype.move = function() {
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
};


Orb.prototype.update = function() {
  if(this.isAlive()){
    this.move()
  }
  if(this.wasHit && new Date().getTime() - this.lastHit > 200) {
    this.colors[0] = this.lastColor
    this.wasHit = false
  }
  if(!this.dead(this.decay)){
    this.draw()
  }
}
// End Orb

// LifeOrb
function LifeOrb(x, y, size) {
  Orb.call(this, x, y, size)
  this.colors = ['red']
  this.sprite =[[0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0]]
}

LifeOrb.prototype = Object.create(Orb.prototype)
LifeOrb.prototype.constructor = LifeOrb
  
LifeOrb.prototype.draw = function() {
  Tools.drawSprite(this)
};
// End LifeOrb


// ElevatorOrb
function ElevatorOrb(x, y, size, color, life){
  Orb.call(this, x, y, size, color)
  this.direction = 1
  this.life = life
  this.maxLife = life
  this.divs = this.life
  this.div = this.size/this.divs
  this.particles = []
  this.particle_size = this.size / 2 
  this.solid = false
  this.triggered = false
  this.particle_color = this.colors[0]
  this.viewBox = true 
}

ElevatorOrb.prototype = Object.create(Orb.prototype)
ElevatorOrb.prototype.constructor = ElevatorOrb

ElevatorOrb.prototype.trigger = function(player, floor) {
  if(new Date().getTime() - player.floorTime > 200){ 
    if(player.floor >= floor.x - 1){
      player.floor = 0
    }else{
      player.floor += 1 
      if(player.life < player.regen){
        player.addLife()
      }
    }
    player.floorTime = new Date().getTime()
    floor.checkPlayers()
  }

};


ElevatorOrb.prototype.reset = function(){
  this.particles = null
  this.particles = []
  for (var i = this.x; i < this.x + this.size; i += this.particle_size) {
    for (var j = this.y; j < this.y + this.size; j += this.particle_size) {
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

ElevatorOrb.prototype.dead = function() {}


ElevatorOrb.prototype.draw = function() {
  c.fillStyle = this.colors[0]
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
    c.strokeStyle = this.colors[0]
    c.strokeRect(view.x, view.y, view.size, view.size)

  }
  if(this.death){
    this.size = this.div * this.maxLife
    var view = this.view()
    c.fillStyle = this.colors[0]
    c.fillRect(view.x, view.y, view.size, view.size)
    c.fillStyle = 'black'
    c.fillRect(this.x, this.y, this.size, this.size)
    this.drawParticles()
  }
}

ElevatorOrb.prototype.update = function() {
  if(this.isAlive()){
    this.move()
  }
  if(this.wasHit && new Date().getTime() - this.lastHit > 200) {
    this.colors[0] = this.lastColor
    this.wasHit = false
  }
  this.draw()
}

// End ElevatorOrb

// Player subclass Entity
function Player(name, id) {
  Entity.call(this)
  this.id = id || 0 
  this.vx = 4
  this.vy = 4
  this.colors = [Tools.getRandColor(), 'rgba(255, 224, 189, 1)', Tools.getRandColor(), Tools.getRandColor()]
  this.floor = 0
  this.name = name
  this.size = 24
  this.life = 16 
  this.keys = {'left': 37, 'right': 39, 'up': 38, 'down': 40} // arrows
  this.hitColor = Tools.getRandColor()
  this.regen = 12
  this.maxLife = 16
  this.controller = null
  this.sprite = [[0, 0, 1, 1, 1, 1, 0, 0],
                 [0, 0, 1, 2, 2, 1, 0, 0],
                 [0, 0, 1, 2, 2, 1, 0, 0],
                 [0, 1, 1, 1, 1, 1, 1, 0],
                 [2, 0, 1, 1, 1, 1, 0, 2],
                 [0, 0, 3, 3, 3, 3, 0, 0],
                 [0, 0, 3, 0, 0, 3, 0, 0],
                 [0, 0, 2, 0, 0, 2, 0, 0]]
 }

Player.prototype = Object.create(Entity.prototype)
Player.prototype.constructor = Player

Player.prototype.draw = function() {
  Tools.drawSprite(this)
};


Player.prototype.update = function() {
  if(this.isAlive()){
    if(!this.controller && window.gp){
      this.controller = window.gp[this.id]
    }

    if (this.controller) {
      this.controller.buttons.forEach(button => {
        if(button.pressed){
          console.log(this.controller.buttons.indexOf(button))
        }
      })
      if(this.controller.axes[0] < -0){
        this.x -= Math.abs(this.controller.axes[0]) * this.vx
        this.status = 'Left'
        if(this.status == 'Dead'){
          this.floor -= 1
        }
      }
      if(this.controller.axes[0] > 0){
        this.x += this.controller.axes[0] * this.vx
        this.status = 'Right'
        if(this.status == 'Dead'){
          this.floor += 1
        }
      }
      if(this.controller.axes[1] < -0){
        this.y -= Math.abs(this.controller.axes[1]) * this.vy
        this.status = 'Up'
      }
      if(this.controller.axes[1] > 0){
        this.y += this.controller.axes[1] * this.vy
        this.status = 'Down'
      }
      if(this.controller.axes[0] == 0 && this.controller.axes[1] == 0){
        this.status = 'Resting'
      }

    }else {
      if (KeyHandler.pressed[this.keys.left]){
        this.x -= this.vx;
        this.status = 'Left'
      }
      if (KeyHandler.pressed[this.keys.up]) {
        this.y -= this.vy;
        this.status = 'Up'
      }
      if (KeyHandler.pressed[this.keys.right]) {
        this.x += this.vx;
        this.status = 'Right'
      }
      if (KeyHandler.pressed[this.keys.down]) {
        this.y += this.vy;
        this.status = 'Down'
      }
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
      this.colors[0] = this.lastColor
      this.wasHit = false
    }
  }
}
// End Player
