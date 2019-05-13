var Tools = {
  r: function(n) {
    if (n) {
      return parseInt(Math.random() * n)
    } else {
      return parseInt(Math.random() * 255)
    }
  }, 
  intersectRect: function(r1, r2) {
    return !(r2.x > r1.x + r1.size ||
             r2.x + r2.size < r1.x ||
             r2.y > r1.y + r1.size ||
             r2.y + r2.size < r1.y);
  },
  getRandColor: function(alpha){
    this.alpha = alpha || 1
    return "rgba(" + this.r() +"," + this.r() + "," + this.r()+", " + this.alpha + ")"
  },
  choose: function(items) {
    return items[Math.floor(Math.random() * items.length)]
  },
  drawSprite: function(ent, ctx){
    var pixSize = ent.size / ent.sprite[0].length
    for(var i = 0; i < ent.sprite.length; i+=1){
      for(var j = 0; j < ent.sprite[i].length; j+=1){
        if(ent.sprite[i][j]){
          if(ctx){
            ctx.fillStyle = ent.colors[ent.sprite[i][j] - 1]
            ctx.fillRect(ent.x + (j * pixSize), ent.y + (i * pixSize), pixSize, pixSize)
          }else{
            c.fillStyle = ent.colors[ent.sprite[i][j] - 1]
            c.fillRect(ent.x + (j * pixSize), ent.y + (i * pixSize), pixSize, pixSize)
          }
        }
      }
    }
  },
}
