import Theme from "../common/Theme";
import { CONFIG } from "./config";

// 静态背景
export default class StaticBg extends Theme {

  constructor(dom, config = {}) {
    super(dom, CONFIG, config);
  }
}
