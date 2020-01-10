import Stars from "./Stars";
import Theme from "../common/Theme";
import { CONFIG } from "./config";

// 流星划落

export default class MateorDrop extends Theme {

  constructor(dom, config = {}) {
    super(dom, CONFIG, config);
    this.stars = new Stars(this.ctx, this.width, this.height, this.config.starNum);
    this.count = 0;
  }

  /**
   * 参数设置
   * @param {object} config 
   */
  setOption(config = {}) {
    const _config = this.deepClone(this.config);
    this.setConfig(config);
    if (
      (config.starNum && config.starNum !== _config.starNum) ||
      (config.skyDepth && config.skyDepth !== _config.skyDepth)  
    ) {
      this.stars = new Stars(this.ctx, this.width, this.height, this.config.starNum, this.config.skyDepth);
      this.clear();
      this.draw();
      this.startAnimate();
    }
  }

  /**
   * 开始绘制
   */
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);   
    this.stars.draw();
  }

  /**
   * 每一帧动画生成函数
   */
  frame() {
    if (!this.isAnimate) {
      return;
    }
    this.count++;
    this.count % this.config.starSpeed == 0 && this.stars.move();   
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = this.config.bg;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = 'lighter';  
    this.stars.draw();
    ctx.restore();
    this.req = requestAnimationFrame(this.frame.bind(this));
  }
}
