// Level
function Level(x, id) {
  this.x = x
  this.size = Math.ceil(canvas.width / x)
  this.lvl = []
  this.id = id
}

Level.prototype.generate = function(){
  for (var x = 0; x < canvas.width; x += this.size) {
    for (var y = 0; y < canvas.height; y += this.size) {
      this.lvl.push(new ExplodingTile(x, y, this.size, Tools.getRandColor(), false))
    }
  }
}

Level.prototype.draw = function(){
  this.lvl.forEach(tile => tile.draw())
}
// End Level


// OrbLevel
function OrbLevel(x, id) {
  Level.call(this, x, id)
  this.orb = new ElevatorOrb(Tools.r(canvas.width), Tools.r(canvas.height), 16, Tools.getRandColor())
  this.players = []
  this.complete = false
}

OrbLevel.prototype = Object.create(Level.prototype)
OrbLevel.prototype.constructor = OrbLevel

OrbLevel.prototype.hasPlayers = function(){
  if(this.players.length > 0){
    return true
  }else{
    return false
  }
}

OrbLevel.prototype.checkPlayers = function(){
  for(var i = 0; i < this.players.length; i++){
    if(this.players[i].floor != this.id){
      this.players.splice(i, 1) 
    }
  }
}

OrbLevel.prototype.draw = function(){
  this.lvl.forEach(tile=>tile.draw())
  this.orb.draw()
  if(this.orb.death){
    this.orb.drawParticles()
  }
  this.players.forEach(player => {
    if(!player.dead(player.decay)){
      player.draw()
    }else{
      player.status = 'Dead'
    }
  })
  c.font = "64px Georgia"
  c.fillStyle = "rgba(245, 245, 245, 1)"
  c.fillText(this.id+1, 236, 280)
}

OrbLevel.prototype.update = function(){
  if(!this.lvl.length){
    this.generate()
    this.orb.dead = function(){} 
    this.startTime = new Date().getTime()
  }
  if(this.hasPlayers()){
    this.players.forEach(function(player){
      if(this.orb.isAlive() && Tools.intersectRect(player, this.orb) && !player.wasHit){
        // Combat
        var h = Tools.choose([this.orb, player])
        h.lastHit = new Date().getTime()
        h.hit()
        h.life -= 1
        if(h.life == 0 && h == this.orb){
          player.kills += 1

          player.floorTime = new Date().getTime()
          this.clearTime = (new Date().getTime() - this.startTime)/1000
          this.complete = true
          this.completedBy = player.name
        }else if(player.life == 0){
          this.orb.kills += 1
          this.orb.status = 'Attacking'
        }
        // End Combat
      }else if(this.orb.death && Tools.intersectRect(player, this.orb)){
        this.orb.status = 'Dead'
        this.orb.triggered = true

        if(new Date().getTime() - player.floorTime > 200){ 
          if(player.floor >= this.x - 1){
            player.floor = 0
          }else{
            player.floor += 1 
            if(player.life < player.regen){
              player.life += 1
            }
          }
          player.floorTime = new Date().getTime()
          this.checkPlayers()
        }
      }
      if(this.complete && !player.floorTime){
        player.floorTime = new Date().getTime()
      }
    }, this)
  }
  this.orb.update()
}
// End OrbLevel


// Dungeon
function Dungeon(lvls, players) {
  players = players
  d = []
  for (var z = 0; z < lvls; z++) {
    d.push(new OrbLevel(lvls, z))
  }
  return d
}
// End Dungeon
