var canvas = document.getElementById('canvas')
var screen1 = canvas.getContext('2d')

var canvas2 = document.getElementById('canvas2')

var screen2 = canvas2.getContext('2d')

var c = screen1

canvas.width = 512
canvas.height = 512


/*
 * Game Info
 * 
 * Make a cube dungeon and add an orb to each level.  When orb
 * is killed, it's body becomes the portal to the floor below.
 *
 * The object of the game is to collect the most orbs.
 *
 * Score is time taken to retrieve orb.
 *
 * Needs:
 *  Orb
 *  Player
 *  Dungeon
 *
 * */

var player1 = new Player('Andy')
player1.x = Tools.r(canvas.width) 
player1.y = Tools.r(canvas.height) 
player1.viewBox = false
var player2 = new Player('Steph')
player2.x = Tools.r(canvas.width)
player2.y = Tools.r(canvas.height)
player2.color = Tools.getRandColor()
player2.viewBox = false
player1.keys = {'left': 65, 'up': 87, 'right': 68, 'down': 83}  // wasd

var d = new Dungeon(8, [player1, player2])
d[player1.floor].players.push(player1)
d.player1floor = player1.floor
d[player2.floor].players.push(player2)
d.player2floor = player2.floor

function loop() {
  c.fillStyle = "rgba(0, 0, 0, .5)"
  c.fillRect(0, 0, canvas.width, canvas.height)

  if(d.player1floor != player1.floor){
    d[player1.floor].players.push(player1)
    d.player1floor = player1.floor
  }
  if(d.player2floor != player2.floor){
    d[player2.floor].players.push(player2)
    d.player2floor = player2.floor
  }

  if(d[player1.floor].hasPlayers()){
    d[player1.floor].update()
    d[player1.floor].draw()
  }else{
    d[player1.floor].draw()
  }
  if(!player1.dead(player1.decay)){
    player1.update()
  }


  c = screen2
  c.fillStyle = "rgba(0, 0, 0, .5)"
  c.fillRect(0, 0, canvas.width, canvas.height)
  if(d[player2.floor].hasPlayers() && player2.floor != player1.floor){
    d[player2.floor].update()
    d[player2.floor].draw()
  }else{
    d[player2.floor].draw()
  }
   
  if(!player2.dead(player2.decay)){
    player2.update()
  }

  c = screen1

  requestAnimationFrame(loop)
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



