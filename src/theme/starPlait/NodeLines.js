export default class NodeLines {
  constructor(ctx, stars, width, distance) {
    this.ctx = ctx;
    this.stars = stars;
    this.width = width;
    this.distance = distance; // 小于等于该距离连线
    this.nodeLines = [];
    this.update();
  }

  /**
   * 绘制
   */
  draw() {
    const ctx = this.ctx;
    ctx.save();
    this.nodeLines.forEach(nodeline => {
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = ((1.0 - nodeline.dis / this.distance) * this.width) / 2;
      ctx.globalAlpha = 1.0 - nodeline.dis / this.distance;
      ctx.beginPath();
      ctx.moveTo(nodeline.from.x, nodeline.from.y);
      ctx.lineTo(nodeline.to.x, nodeline.to.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  /**
   * 更新
   */
  update() {
    this.nodeLines = [];
    // console.time("update");
    const length = this.stars.length;
    this.stars.forEach((source, index) => {
      for (let n = index + 1; n < length; n++) {
        const target = this.stars[n];
        const dis = this.getDistance(source, target);
        if (dis <= this.distance) {
          this.nodeLines.push({
            from: {
              x: source.x,
              y: source.y
            },
            to: {
              x: target.x,
              y: target.y
            },
            dis
          });
        }
      }
    });
    // console.timeEnd("update");
  }

  /**
   * 获取两个节点间的距离
   * @param {Object} source
   * @param {Object} target
   */
  getDistance(source, target) {
    return Math.sqrt(
      Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
    );
  }
}
