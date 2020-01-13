import Stars from "./Stars";
import Theme from "../common/Theme";
import { CONFIG } from "./config";

// 编织星空

export default class StarPlait extends Theme {

  constructor(dom, config = {}) {
    super(dom, CONFIG, config);
    this.stars = new Stars(this.ctx, this.width, this.height, this.config.starNum, this.config.plaitSpeed, this.config.lineWidth);
    this.count = 0;
  }

  /**
   * 参数设置
   * @param {object} config 
   */
  setOption(config) {
    const _config = this.deepClone(this.config);
    this.setConfig(config);
    if (this.config.starNum !== _config.starNum ||
      this.config.plaitSpeed !== _config.plaitSpeed  || 
      this.config.lineWidth !== _config.lineWidth 
      ) {
      this.stars = new Stars(this.ctx, this.width, this.height, this.config.starNum, this.config.plaitSpeed, this.config.lineWidth);
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
    // 每隔10帧星星闪烁一次，节省计算资源
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.count++;
    this.stars.move();
    this.stars.draw();
    this.req = requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * 开始动画
   */
  startAnimate() {
    this.frame();
  }

}
