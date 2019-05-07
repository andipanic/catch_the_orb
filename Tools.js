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
  getRandColor: function(){
    return "rgba(" + this.r() +"," + this.r() + "," + this.r()+", 1)"
  },
}
