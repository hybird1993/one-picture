import Theme from "../common/Theme";
import { CONFIG } from "./config";
const clouds = require("./clouds.png");

export default class Clouds extends Theme {
  img;
  x = 0;
  constructor(dom, config = {}) {
    super(dom, CONFIG, config);
    this.createClouds();
  }

  createClouds() {
    this.img = new Image();   // 创建img元素
    this.img.src = clouds; // 设置图片源地址
  }

  draw() {
    this.ctx.drawImage(this.img, this.x, 0, this.width, this.height)
  }

  frame() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.x -= this.config.cloudSpeed;
    if (this.x + this.width <= 0) {
      this.x += this.width;
    }
    this.ctx.drawImage(this.img, this.x, 0, this.width, this.height)
    this.ctx.drawImage(this.img, this.x + this.width, 0, this.width, this.height)
    this.req = requestAnimationFrame(this.frame.bind(this));
  }
}