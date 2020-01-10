export default class NodeLines {
  constructor(ctx, stars, width, distance) {
    this.ctx = ctx;
    this.stars = stars;
    this.width = width;
    this.distance = distance;   // 小于等于该距离连线
    this.nodeLines = [];
    this.obj = {};
    this.update();
  }

  draw() {
    const ctx = this.ctx;
    this.nodeLines.forEach(nodeline => {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = (1.0 - nodeline.dis / this.distance) * this.width;
      ctx.globalAlpha = 1.0 - nodeline.dis / this.distance;
      ctx.beginPath();
      ctx.moveTo(nodeline.from.x, nodeline.from.y);
      ctx.lineTo(nodeline.to.x, nodeline.to.y);
      ctx.stroke();
    })
  }
  
  update() {
    this.nodeLines = [];
    this.obj = {};
    this.stars.forEach(source => {
      this.stars.forEach(target => {
        const dis = this.getDistance(source, target);
        if (dis <= this.distance) {
          if(!this.obj[source['id']]) {
            this.obj[source['id']] = [];
          }
          this.obj[source['id']].push(target['id']);
          if(!this.obj[target['id']] || !this.obj[target['id']].includes(source['id'])) {
            this.nodeLines.push(
              {
                from: {
                  x: source.x,
                  y: source.y,
                },
                to: {
                  x: target.x,
                  y: target.y,
                },
                dis
              }
            )
          }
        }
      })
    })
  }

  getDistance(source, target) {
    return Math.sqrt(Math.pow((target.x - source.x), 2) + Math.pow((target.y - source.y), 2));
  }
}