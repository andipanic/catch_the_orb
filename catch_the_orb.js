var canvas = document.getElementById('canvas')
var c = canvas.getContext('2d')

canvas.width = 512
canvas.height = 512

/*
 * Game Info
 * 
 * Make a cube dungeon and add an orb below a specified depth to wander.
 *
 * The object of the game is to collide the player with the orb.
 *
 * Score is time taken to retrieve orb.
 *
 * Needs:
 *  Orb
 *  Player
 *  Dungeon
 *
 * */

var player1 = new Player()
var orb = new Orb()
player1.x = 200
player1.y = 200

var lvl = Level(4)


player1.viewBox = false

lvl.forEach(tile => {tile.solid = true})
lvl.forEach(tile=>tile.update())
var index = lvl.indexOf(Tools.choose(lvl))
var t = lvl[index]
tile = new ExplodingTile(t.x, t.y, t.size, t.color)
tile.solid = false
lvl[index] = tile


function loop() {
  //console.time('loop')
  c.fillStyle = "rgba(0, 0, 0, .15)"
  c.fillRect(0, 0, canvas.width, canvas.height)

  lvl.forEach(function(tile) {
    if(player1.isAlive() && Tools.intersectRect(player1.view(), tile) || 
       orb.isAlive() && Tools.intersectRect(orb.view(), tile)){
      if(Tools.intersectRect(player1, tile)){
        tile.triggered = true
      }

    }

    tile.update()

  })

  if(player1.isAlive() && orb.isAlive() && Tools.intersectRect(orb, player1)){
    var a = Tools.choose([orb, player1])
    a.life -= 1
  }

  orb.update()

  player1.update()

  requestAnimationFrame(loop)
  //console.timeEnd('loop')
}
loop()

var hud = new HUD('hud')
hud.title = "Catch the Orb!"

function hudloop(){
  hud.clear()
  hud.displayTitle()

  requestAnimationFrame(hudloop)
}
hudloop()



