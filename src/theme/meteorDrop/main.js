import Stars from "./Stars";
import Meteor from "./Meteor";
import Theme from "../common/Theme";
import { CONFIG } from "./config";

// 流星划落

export default class MateorDrop extends Theme {

  constructor(dom, config = {}) {
    super(dom, CONFIG, config);
    this.stars = new Stars(this.ctx, this.width, this.height, this.config.starNum);
    this.meteors = [];
    this.count = 0;
  }

  /**
   * 参数设置
   * @param {object} config 
   */
  setOption(config = {}) {
    const _config = this.deepClone(this.config);
    this.setConfig(config);
    if (config.starNum && config.starNum !== _config.starNum) {
      this.stars = new Stars(this.ctx, this.width, this.height, this.config.starNum);
    }
  }

  /**
   * 开始绘制
   */
  draw() {
    this.meteorGenerator();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.stars.draw();
    this.meteors.forEach((meteor, index, arr) => {
      // 如果流星离开视野之内，销毁流星实例，回收内存
      // console.log(meteor.flow())
      if (meteor.flow()) {
        meteor.draw();
      } else {
        arr.splice(index, 1);
      }
    });
  }

  /**
   * 每一帧动画生成函数
   */
  frame() {
    if (!this.isAnimate) {
      return;
    }
    // 每隔10帧星星闪烁一次，节省计算资源
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.count++;
    this.count % this.config.starblinkSpeed == 0 && this.stars.blink();
    this.stars.draw();
    this.meteors.forEach((meteor, index, arr) => {
      // 如果流星离开视野之内，销毁流星实例，回收内存
      if (meteor.flow()) {
        meteor.draw();
      } else {
        arr.splice(index, 1);
      }
    });
    this.req = requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * 生成流星
   */
  meteorGenerator() {
    let x = Math.random() * this.width + 200;
    if (this.meteors.length <= this.config.maxMeteorNum) {
      this.meteors.push(new Meteor(this.ctx, x, this.height));
    }
  }

  /**
   * 开始动画
   */
  startAnimate() {
    this.timer = setInterval(() => {
      this.meteorGenerator();
    }, 2000);
    this.isAnimate = true;
    this.frame();
  }

}
