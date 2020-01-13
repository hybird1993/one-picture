import NodeLines from "./NodeLines";

export default class Stars {
  constructor(ctx, width, height, amount, speed, lineWidth) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.maxR = 3;
    this.speed = speed;
    this.stars = this.getStars(amount);
    this.nodeLines = new NodeLines(ctx, this.stars, lineWidth, this.width / 8);
  }

  getStars(amount) {
    let stars = [];
    while (amount--) {
      stars.push({
        id: amount,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: Math.random() * this.maxR,
        alpha: 1, // 透明度
        // ra: Math.random() * 0.05, // 透明度变化
        // 横向移动偏移量
        vx: (Math.random() * 0.2 - 0.1) * this.speed,
        // 纵向移动偏移量
        vy: (Math.random() * 0.2 - 0.1) * this.speed
      });
    }
    return stars;
  }

  draw() {
    let ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "white";
    this.stars.forEach(star => {
      ctx.beginPath();
      var bg = ctx.createRadialGradient(
        star.x,
        star.y,
        0,
        star.x,
        star.y,
        star.r
      );
      bg.addColorStop(0, "rgba(255,255,255," + star.alpha + ")");
      bg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = bg;
      ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });
    ctx.restore();
    this.nodeLines.draw();
  }

  move() {
    this.stars = this.stars.map(star => {
      star.x += star.vx;
      // x轴坐标判断
      if (star.x >= this.width || star.x <= 0) {
        star.x = this.clamp(0, this.width, star.x);
        star.vx *= -1;
      }
      star.y += star.vy;
      // y轴坐标判断
      if (star.y >= this.height || star.y <= 0) {
        star.y = this.clamp(0, this.height, star.y);
        star.vy *= -1;
      }
      return star;
    });
    this.nodeLines.update();
  }

  clamp(min, max, value) {
    if (value > max) {
      return max;
    } else if (value < min) {
      return min;
    } else {
      return value;
    }
  }
}
