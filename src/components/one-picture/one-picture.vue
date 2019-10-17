<template>
  <div class="panel-container">
    <!-- <div class="panel-title">指挥调度一张图</div> -->
    <div class="panel-content">
      <!-- <iframe src="map.html" class="map" id="supermap"></iframe> -->
      <iframe :src="url" class="map" id="supermap"></iframe> 
    </div>
  </div>
</template>
<script>
import { API } from "../../request/api";
import { Util } from "../../utils/util";
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
      default: null
    }
  },
  data() {
    return {
      isShowMap: false,
      map: null,
      methodMap: {},
      d2Url: null,
      d3Url: null,
      url: null
    };
  },
  mounted() {
    const token = Util.getCookie();
    this.d2Url = `http://172.29.1.20/s/demo/webOneMap/map2d/index.html?auth-token=${token}`;
    this.d3Url = `http://172.29.1.20/s/demo/webOneMap/map3d/index.html?auth-token=${token}`;
    this.url = this.d2Url;
    this.methodMap = {
      importantPeopleLocation: "重点人员定位", // 对应数据为特殊人员告警
      alarmLocation: "告警定位", // 对应数据为告警数组
      showRecentTrace: "显示行踪",
      hideRecentTrace: "取消行踪显示"
    };
    window.addEventListener("message", this.handleMessage);
    setTimeout(() => {
      this.init();
    }, 1000);
    // 初始化地图容器
  },
  methods: {
    handleMessage(data) {
      if (data.data.method) {
        console.log(data.data.method);
        console.log(data.data.params);
      }
      if (data.data.method === "搜索调度人员") {
        this.searchPeopleByKey(data.data.params);
      } else if (data.data.method === "查看关联人口") {
        this.$emit("mapEvent", { type: "house", data: data.data.params });
      } else if (data.data.method === "查看建筑") {
        this.$emit("mapEvent", { type: "building", data: data.data.params });
      } else if (data.data.method === "人脸搜索") {
      } else {
      }
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
    searchPeopleByKey(key) {}
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