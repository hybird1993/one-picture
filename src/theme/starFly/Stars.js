export default class Stars {
  constructor(ctx, width, height, amount, depth) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
    this.starColor = "rgba(255, 255, 255, 0.8)";
    this.depth = depth;
    this.stars = this.getStars(amount);
  }

  getStars(amount) {
    let stars = [];
    while (amount--) {
      stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: 1,
        point3d: [(Math.random() * 800) - 400, (Math.random() * 800) - 400, (Math.random() * 800) - 400],
      });
    }
    return stars;
  }

  draw() {
    let ctx = this.ctx;
    ctx.save();
    this.stars.forEach(star => {
      ctx.beginPath();
      ctx.fillStyle = this.starColor;
      const x3d = star.point3d[0];
      const y3d = star.point3d[1];
      const z3d = star.point3d[2];
      const scale =  this.depth / ( this.depth + z3d);
      const x2d = (x3d * scale) + this.halfWidth;
      const y2d = (y3d * scale) + this.halfHeight;
      const r2d = star.r * (scale > 0 ? scale : 1);
      const r = (scale > 0 ? scale : 1) * star.r
      ctx.arc(x2d, y2d, r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });
    ctx.restore();
  }

  //闪烁，星星半径每隔10帧随机变大或变小
  move() {
    this.stars = this.stars.map(star => {
      let z3d = star.point3d[2];
      z3d -= 0.1;
      if (z3d < -this.depth) {
        z3d = (Math.random() * 800) - 400; // z3d +=500;
      }
      star.point3d[2] = z3d;
      return star;
    });
  }
}
