<template>
  <div class="panel-container">
    <!-- <div class="panel-title">指挥调度一张图</div> -->
    <div class="panel-content">
      <!-- <iframe src="http://www.baidu.com" class="map" id="supermap"></iframe> -->
      <iframe
        src="http://10.129.75.1:8801/map2d/index.html"
        class="map"
        id="supermap"
      ></iframe>
      <!-- <iframe src="http://10.129.75.1:8801/map3d/index.html" class="map" id="supermap"></iframe> -->
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  name: "one-picture",
  props: {
    method: {
      type: String,
      default: null
    },
    params: {
      type: [Array, String, Object],
      default: null,
    },
  },
  data() {
    return {
      isShowMap: false,
      map: null,
      methodMap: {},
    };
  },
  mounted() {
    this.methodMap = {
      importantPeopleLocation: '重点人员定位',    // 对应数据为特殊人员告警
      alarmLocation: '告警定位',    // 对应数据为告警数组
      showRecentTrace: '显示行踪',   
      hideRecentTrace: '取消行踪显示',   
    };
    setTimeout(() => {
      this.init();
      window.addEventListener("message", this.handleMessage);
    }, 1000);
    // 初始化地图容器
  },
  methods: {
    handleMessage(data) {
      console.log(data.method);
      console.log(data.params);
    },
    init() {
      this.map = document.getElementById("supermap").contentWindow;
    },
    postMessage() {
      const method = this.methodMap[this.method];
      if (!method) {
        return;
      }
    // this.map.postMessage({ method: "摄像头定位", params: "SPJK-002" }, "*");
      this.map.postMessage({ method: method, params: this.params }, "*");
    },
  },
  watch: {
    method: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.postMessage();
    },
    params: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.postMessage();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.1);
  cursor: move;
}
</style>