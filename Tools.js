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
}
