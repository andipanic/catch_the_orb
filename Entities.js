// Base Entity
function Entity(x, y, size, color) {
  this.x = x || 100
  this.y = y || 100
  this.size = size || 16
  this.color = color || "red"
}

Entity.prototype.draw = function () {
  c.fillStyle = this.color
  c.fillRect(this.x, this.y, this.size, this.size)
}

Entity.prototype.update = function () {
  this.draw()
}
// End Entity


// Orb subclass of Entity
function Orb() {
  Entity.call(this)
  this.vx = 4
  this.vy = 4
  this.isOrb = true
  this.color = Tools.getRandColor()
  this.dirTime = new Date().getTime()
}

Orb.prototype = Object.create(Entity.prototype)
Orb.prototype.constructor = Orb

Orb.prototype.update = function() {
  if(new Date().getTime() - this.dirTime > Tools.r(3000)){
    this.vx = (Tools.r(this.size) - (this.size/2))
    this.vy = (Tools.r(this.size) - (this.size/2))
    this.dirTime = new Date().getTime()
  }
  this.x += this.vx 
  this.y += this.vy
  if(this.y <= 0) this.y = 0
  if(this.x <= 0) this.x = 0
  if(this.y + this.size >= canvas.height) this.y = (canvas.height - this.size)
  if(this.x + this.size >= canvas.width) this.x = (canvas.width - this.size)
  this.draw()
}
// End Orb



// Player subclass Entity
function Player() {
  Entity.call(this)
  this.vx = 4
  this.vy = 4
  this.color = "red"
}

Player.prototype = Object.create(Entity.prototype)
Player.prototype.constructor = Player

Player.prototype.update = function() {
  // Left
  if (KeyHandler.pressed[37]) {
    this.x -= this.vx;
  }
  // Up
  if (KeyHandler.pressed[38]) {
    this.y -= this.vy;
  }
  // Right
  if (KeyHandler.pressed[39]) {
    this.x += this.vx;
  }
  // Down
  if (KeyHandler.pressed[40]) {
    this.y += this.vy;
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

  this.draw();
}
// End Player
