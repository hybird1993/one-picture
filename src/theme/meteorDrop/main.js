import Stars from "./Stars";
import Meteor from "./Meteor";

// 流星划落

export default class MateorDrop {
  constructor(dom, config = {}) {
    this.ctx = dom.getContext("2d");

    this.width = dom.clientWidth;
    this.height = dom.clientHeight;
    dom.width = this.width;
    dom.height = this.height;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.config = config;
    this.isAnimate = false;
    this.stars = new Stars(this.ctx, this.width, this.height, 200);
    this.meteors = [];
    this.count = 0;
  }

  draw() {
    this.meteorGenerator();
    this.startAnimate();
    this.frame();
  }

  // 每一帧动画生成函数
  frame() {
    // 每隔10帧星星闪烁一次，节省计算资源
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.count++;
    this.count % 10 == 0 && this.stars.blink();

    this.stars.draw();

    this.meteors.forEach((meteor, index, arr) => {
      // 如果流星离开视野之内，销毁流星实例，回收内存
      if (meteor.flow()) {
        meteor.draw();
      } else {
        arr.splice(index, 1);
      }
    });
    if (this.isAnimate) {
      requestAnimationFrame(this.frame.bind(this));
    }
  }

  meteorGenerator() {
    let x = Math.random() * this.width + 200;
    this.meteors.push(new Meteor(this.ctx, x, this.height));

    // 每隔随机时间，生成新流星
    setTimeout(() => {
      this.meteorGenerator();
    }, Math.random() * 2000);
  }

  startAnimate() {
    this.isAnimate = true;
  }

  stopAnimate() {
    this.isAnimate = false;
  }
}
