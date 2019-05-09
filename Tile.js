// Tile
function Tile(x, y, size, color, solid=true) {
  this.x = x || 0
  this.y = y || 0
  this.size = size || 32
  this.color = color || Tools.getRandColor()
  this.solid = solid 
  this.triggered = false
}

Tile.prototype.draw = function () {
  if(this.solid){
    c.fillStyle = this.color
    c.fillRect(this.x, this.y, this.size, this.size)
  }else{
    c.strokeStyle = this.color
    c.strokeRect(this.x, this.y, this.size, this.size)
  }
}

Tile.prototype.update = function () {
}
// End Tile


// FallingTile
function FallingTile(x, y, size, color, solid){
  Tile.call(this, x, y, size, color, solid)
  this.alpha = 1
}

FallingTile.prototype = Object.create(Tile.prototype)
FallingTile.prototype.constructor = FallingTile

FallingTile.prototype.update = function () {
  if(this.triggered && this.alpha > 0){
    this.alpha -= .05
    this.color = Tools.getRandColor(this.alpha)
  }
}
// End FallingTile


// Particle
function Particle(x, y, size, color, solid){
  Tile.call(this, x, y, size, color, solid)
  this.dx = Math.random() - .5
  this.dy = Math.random() - .5
  this.alpha = 1
}

Particle.prototype = Object.create(Tile.prototype)
Particle.prototype.constructor = Particle

Particle.prototype.update = function(){
  this.y += this.dy
  this.x += this.dx
  this.alpha -= .03
  this.size -= (this.size * .04)
  if(this.alpha > 0){
    this.draw()
  }
}
// End Particle


// ExplodingTile
function ExplodingTile(x, y, size, color, solid){
  Tile.call(this, x, y, size, color, solid)
  this.particles = [];
  this.particle_size = Math.max(size / 8, 8);
  this.hidden = false;
  this.finished = false;
}

ExplodingTile.prototype = Object.create(Tile.prototype)
ExplodingTile.prototype.constructor = ExplodingTile

ExplodingTile.prototype.draw = function() {
  if (!this.hidden) {
    if(this.solid) {
      c.fillStyle = this.color
      c.fillRect(this.x, this.y, this.size, this.size)
    }else{
      c.strokeStyle = this.color
      c.strokeRect(this.x, this.y, this.size, this.size)
    }
  }
}

ExplodingTile.prototype.update = function() {
  if (this.triggered && !this.particles.length) {
    for (var i = this.x; i < this.x + this.size; i += this.particle_size) {
      for (var j = this.y; j < this.y + this.size; j += this.particle_size) {
        this.particles.push(new Particle(i, j, this.particle_size, Tools.getRandColor(), this.solid));
      }
    }
  }else if(!this.finished){
    this.particles.forEach(part => {
      if(part.alpha > .1){
        part.update()
        part.draw()
      }else{
        this.finished = true
      }
    })
  } 
  if(!this.particles.length) {this.draw()}
}
// End ExplodingTile

// DoorTile
// End DoorTile

