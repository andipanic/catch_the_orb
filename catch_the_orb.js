var canvas = document.getElementById('canvas')
var c = canvas.getContext('2d')

canvas.width = 512
canvas.height = 512

var orb = new Orb()
var player1 = new Player()
function loop() {
  //console.time('loop')
  c.fillStyle = "black"
  c.fillRect(0, 0, canvas.width, canvas.height)


  orb.update()
  player1.update()

  requestAnimationFrame(loop)
  //console.timeEnd('loop')
}
loop()

