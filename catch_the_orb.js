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
player1.x = 200
player1.y = 200
var orbs = []
for (var i = 0; i<2048; i++){
  orbs.push(new Orb(Tools.r(canvas.width), Tools.r(canvas.height)))
}
function loop() {
  //console.time('loop')
  c.fillStyle = "rgba(5, 5, 5, .15)" 
  c.fillRect(0, 0, canvas.width, canvas.height)

  orbs.forEach(o => {
    if(Tools.intersectRect(player1, o)){
      orbs.splice(orbs.indexOf(o), 1)
    }
    o.update()
  })
  
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



