export default class Theme {
  timer;
  req;
  config;
  constructor(dom, defalutConfig, config) {
    this.dom = dom;
    this.ctx = dom.getContext("2d");
    this.width = dom.clientWidth;
    this.height = dom.clientHeight;
    dom.width = this.width;
    dom.height = this.height;
    this.defalutConfig = this.deepClone(defalutConfig);
    this.initConfig(defalutConfig);
    this.setConfig(config);
    this.isAnimate = false;
  }

  /**
   * 获取默认配置
   */
  getDefalutConfig() {
    return this.defalutConfig;
  }

  /**
   * 开始绘制
   */
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * 获取当前配置
   */
  getConfig() {
    return this.config;
  }

  /**
   * 初始化参数
   * @param {object} config
   */
  initConfig(config) {
    this.config = this.deepClone(config);
    // this.starNum = config.starNum || CONFIG.starNum;
    // this.maxMeteorNum = config.maxMeteorNum || CONFIG.maxMeteorNum;
    // this.bg = config.bg || CONFIG.bg;
    // this.starblinkSpeed = config.starblinkSpeed || CONFIG.starblinkSpeed;
    this.setBg();
  }

  /**
   * 参数设置
   * @param {object} config
   */
  setConfig(config) {
    if (isObject(config)) {
      Object.keys(this.defalutConfig).forEach(key => {
        if (config[key]) {
          this.config[key] = config[key];
        }
      });
      this.setBg();
    }
  }

  setOption(config = {}) {
    this.setConfig(config);
  }

  /**
   * 设置背景
   */
  setBg() {
    this.dom.style.background = this.config.bg;
    this.dom.style.backgroundSize = "cover";
  }

  frame() {}

  /**
   * 开始动画
   */
  startAnimate() {
    this.isAnimate = true;
    this.frame();
  }

  /**
   * 停止动画
   */
  stopAnimate() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.req) {
      cancelAnimationFrame(this.req);
    }
    this.isAnimate = false;
  }

  /**
   * 清空画布
   */
  clear() {
    this.stopAnimate();
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * 深拷贝
   * param obj   拷贝对象
   * return {any[] | {}}   返回拷贝对象
   */
  deepClone(obj) {
    const objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = this.deepClone(obj[key]);
          } else {
            // 如果不是，简单复制
            objClone[key] = obj[key];
          }
        }
      }
    }
    return objClone;
  }
}

/**
 * 检查是否为对象
 * return {boolean}   是否为对象
 */
function isObject(obj) {
  return (
    Object.prototype.toString.call(obj).toLowerCase() === "[object object]"
  );
}
