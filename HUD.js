// Takes a canvas id and uses it to display messages
function HUD(id){
  this.id = id
  this.canvas = document.getElementById(id)
  this.c = this.canvas.getContext('2d')
  this.update = false
  this.background = "rgba(0, 0, 255, .065)"
  this.title = ''
  this.normal = "white"
  this.clear = function (){
    this.c.fillStyle = this.background
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
  this.displayTitle = function (){
    this.c.font = "48px monospace"
    this.c.fillStyle = this.normal
    this.c.textAlign = 'center'
    this.c.fillText(this.title, (this.canvas.width / 2), 58)
  }
}


/*
function hupLoop() {
  this.clear = function () {
    hupc.fillStyle = "rgba(0, 0, 255, .065)"
    hupc.fillRect(0, 0, hup.width, hup.height)
  }
  this.displayTitle = function (){
    hupc.font = "48px monospace"
    hupc.fillStyle = "white"
    hupc.fillText("Catch the Orb!", 48, 48)
  }
  this.displayMessage = function (message) {
    hupc.font = "16px monospace"
    hupc.fillStyle = "white"
    hupc.fillText(message, 16, 16)
  }
  if(hupdate) {
    this.clear()
    this.displayMessage(hmessage)
  } else {
    this.clear()
    this.displayTitle()
  }
  requestAnimationFrame(hupLoop)
}
hupLoop()
*/

