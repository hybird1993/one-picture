<template>
  <div class="panel-container">
    <!-- <div class="panel-title">指挥调度一张图</div> -->
    <div class="panel-content">
      <iframe  v-show="mapType === '2d'" :src="d2Url" class="map" id="supermap2D"></iframe>
      <iframe  v-show="mapType === '3d'" :src="d3Url" class="map" id="supermap3D"></iframe>
      <div class="map-type">
        <img
          v-if="mapType === '2d'"
          @click="changeMapType('3d')"
          src="../../assets/image/bg-2D.png"
        />
        <img
          v-if="mapType === '3d'"
          @click="changeMapType('2d')"
          src="../../assets/image/bg-3D.png"
        />
      </div>
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
      map2D: null,
      map3D: null,
      methodMap: {},
      d2Url: null,
      d3Url: null,
      mapType: "2d"
    };
  },
  mounted() {
    const token = Util.getCookie();
    this.d2Url = `http://172.29.1.20/s/demo/webOneMap/map2d/index.html?auth-token=${token}`;
    this.d3Url = `http://172.29.1.20/s/demo/webOneMap/map3d/index.html?auth-token=${token}`;
    this.methodMap = {
      importantPeopleLocation: "重点人员定位", // 对应数据为特殊人员告警
      alarmLocation: "告警定位", // 对应数据为告警数组
      showRecentTrace: "显示行踪",
      hideRecentTrace: "取消行踪显示",
      unImportantPersonTrace: "黑名单行踪轨迹",
      roamingVideoEnd: "当前漫游完毕",
    };
    window.addEventListener("message", this.handleMessage);
    setTimeout(() => {
      // this.init();
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
      } else if (data.data.method === "漫游视频") {
        this.$emit("mapEvent", { type: "roamingVideoStart", data: data.data.params });
      } else if (data.data.method === "视频信息") {
        this.$emit("mapEvent", { type: "playVideo", data: data.data.params });
        // const param = {
        //   cameraInfo: data.data.params,
        //   position: { x: 0, y: 0, w: 472, h: 316 },
        //   time: 10000,
        //   allowClose: true
        // };
        // jsobj.SendUIMessage("播放视频", param);
      } else {
      }
    },
    init() {
      this.map2D = document.getElementById("supermap2D").contentWindow;
      this.map3D = document.getElementById("supermap3D").contentWindow;
    },
    changeMapType(type) {
      this.mapType = type;
    },
    postMessage() {
      alert(this.method)
      const method = this.methodMap[this.method];
      if (!method) {
        return;
      }
      alert(method)
      if (['roamingVideoEnd'].includes(this.method)) {
        if (!this.map3D) {
          this.map3D = document.getElementById("supermap3D").contentWindow;
        }
        this.map3D.postMessage({ method: method, params: this.params }, "*");
      } else {
        if (!this.map2D) {
          this.map2D = document.getElementById("supermap2D").contentWindow;
        }
        this.map2D.postMessage({ method: method, params: this.params }, "*");
      }
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
.map-type {
  z-index: 1;
  bottom: 34%;
  position: absolute;
  right: 25.5%;
  width: 9rem;
  height: 7rem;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>