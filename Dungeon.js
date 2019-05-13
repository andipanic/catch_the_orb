// Level
function Level(x, id) {
  this.x = x
  this.size = Math.ceil(canvas.width / x)
  this.lvl = []
  this.id = id
  this.npc = []
}

Level.prototype.generate = function(){
  for (var x = 0; x < canvas.width; x += this.size) {
    for (var y = 0; y < canvas.height; y += this.size) {
      this.lvl.push(new Tile(x, y, this.size, Tools.getRandColor(), false))
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
  this.npc.push(new ElevatorOrb(Tools.r(canvas.width), Tools.r(canvas.height), Tools.r(16) + 16, Tools.getRandColor(), Tools.r(4) + 1, viewBox=true))
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
  this.npc.forEach(npc => {
    if(!npc.dead(npc.decay)){
      npc.draw()
    }
  })

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
    this.startTime = new Date().getTime()
  }
  if(this.hasPlayers()){
    this.players.forEach(function(player){
      this.npc.forEach(function(npc){
        if(npc.isAlive() && Tools.intersectRect(player, npc) && !player.wasHit){
          var h = Tools.choose([player, npc])
          h.lastHit = new Date().getTime()
          h.hit()
          if(npc instanceof LifeOrb){
            player.addLife()
            h.life -= 1
          }else{
            h.life -= 1
          }
          if(h.life == 0 && h == npc){
            player.kills += 1

            player.floorTime = new Date().getTime()
            this.clearTime = (new Date().getTime() - this.startTime)/1000
            this.complete = true
            this.completedBy = player.name
          }else if(player.life == 0){
            npc.kills += 1
            npc.status = 'Attacking'
          }
        }else if(npc.death && Tools.intersectRect(player, npc)){
          npc.status = 'Dead'
          npc.triggered = true
          npc.trigger(player, this)
        }

      }, this)
      if(this.complete && !player.floorTime){
        player.floorTime = new Date().getTime()
      }
    }, this)
    this.npc.forEach(npc => npc.update())
  }
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
