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
player2.color = "blue"
player2.viewBox = false
player2.keys = {'left': 65, 'up': 87, 'right': 68, 'down': 83}  // wasd

var d = new Dungeon(8, [player1, player2])
d[player1.floor].players.push(player1)
d.player1floor = player1.floor
d[player2.floor].players.push(player2)
d.player2floor = player2.floor

function loop() {
  c.fillStyle = "rgba(0, 0, 0, .25)"
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
  c.fillStyle = "rgba(0, 0, 0, .25)"
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
var hud2 = new HUD('hud2')
hud.title = "Catch the Orb!"
hud2.title = "Catch the Orb!"
function hudloop(){
  orb1 = d[player1.floor].orb
  hud.background = player1.colors[0]
  hud.clear()
  hud.message(player1.name, 20)
  if(player1.isAlive()){
    hud.message('Life: ' + player1.life + ', Kills: ' + player1.kills + ", Orb: " + orb1.status, 42)
  }else{
    hud.message('You have died on floor ' + (player1.floor) + ' with ' + player1.kills + ' kills.', 42)
  }

  if(orb1.wasHit){
    player1.status = "Attacking"
  }
  if(player1.wasHit){
    player1.status = "Defending"
  }
  hud.message(player1.status, 64)

  orb2 = d[player2.floor].orb
  hud2.background = player2.colors[0]
  hud2.clear()
  hud2.message(player2.name, 20)
  if(player2.isAlive()){
    hud2.message('Life: ' + player2.life + ', Kills: ' + player2.kills + ", Orb: " + orb2.status, 42)
  }else{
    hud2.message('You have died on floor ' + (player2.floor+1) + ' with ' + player2.kills + ' kills.', 42)
  }
  if(d[player2.floor].orb.wasHit){
    player2.status = "Attacking"
  }
  if(player2.wasHit){
    player2.status = "Defending"
  }
  hud2.message(player2.status, 64)

  requestAnimationFrame(hudloop)
}
hudloop()



