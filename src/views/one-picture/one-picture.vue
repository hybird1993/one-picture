<template>
  <div class="map-container">
    <div class="map-content">
      <iframe
        v-show="mapType === '2d'"
        :src="d2Url"
        class="map"
        id="supermap2D"
      ></iframe>
      <iframe
        v-show="mapType === '3d'"
        :src="d3Url"
        class="map"
        id="supermap3D"
      ></iframe>
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
    },
    eventTime: [String, Number]
  },
  data() {
    return {
      isShowMap: false,
      map2D: null,
      map3D: null,
      methodMap2D: {}, // 向2D地图发的消息种类
      methodMap3D: {}, // 向3D地图发的消息种类
      d2Url: null,
      d3Url: null,
      mapType: "2d"
    };
  },
  mounted() {
    const token = Util.getCookie();
    this.d2Url = `./map/map2d/index.html?auth-token=${token}`;
    this.d3Url = `./map/map3d/index.html?auth-token=${token}`;
    this.methodMap2D = {
      importantPeopleLocation: "重点人员定位", // 对应数据为特殊人员告警
      importantPeople: "重点人员",     // 2d地图重点人员告警
      eventAlarm: "告警事件",     // 2d地图事件告警
      alarmLocation: "告警定位", // 对应数据为告警数组
      showRecentTrace: "显示行踪",
      hideRecentTrace: "取消行踪显示",
      unImportantPersonTrace: "黑名单行踪轨迹",
      cameraLocation: "摄像头定位",
      cancelCameraLight: "取消高亮",
      addAlarm: '添加告警',
    };
    this.methodMap3D = {
      roamingVideoEnd: "当前漫游完毕"
    };
    window.addEventListener("message", this.handleMessage);
  },
  methods: {
    handleMessage(data) {
      if (data.data.method) {
        console.log(
          `接收到地图发来的消息-----> ${data.data.method} ----> ${
            typeof data.data.params === "object"
              ? JSON.stringify(data.data.params)
              : data.data.params
          }`
        );
      }
      if (data.data.method === "搜索调度人员") {
        this.searchPeopleByKey(data.data.params);
      } else if (data.data.method === "查看关联人口") {
        this.$emit("mapEvent", { type: "house", data: data.data.params });
      } else if (data.data.method === "查看建筑") {
        this.$emit("mapEvent", { type: "building", data: data.data.params });
      } else if (data.data.method === "人脸检索") {
        this.$emit("mapEvent", {
          type: "openFaceSearch",
          data: data.data.params
        });
      } else if (data.data.method === "漫游视频") {
        this.$emit("mapEvent", {
          type: "roamingVideoStart",
          data: data.data.params
        });
      } else if (data.data.method === "结束漫游") {
        this.$emit("mapEvent", {
          type: "cancelCameraLight",
          data: data.data.params
        });
      } else if (data.data.method === "摄像头定位") {
        this.postMessage("cameraLocation", data.data.params);
      } else if (data.data.method === "视频信息") {
        this.$emit("mapEvent", { type: "playVideo", data: data.data.params });
      } else if (data.data.method === "2dMapLoaded") {
        this.$emit("mapEvent", { type: "2dMapLoaded", data: data.data.params });
      } else if (data.data.method === "mouseup") {
        this.$emit("mapEvent", { type: "mouseup", data: data.data.params });
      } else if (data.data.method === "mouseover") {
        this.$emit("mapEvent", { type: "mouseover", data: data.data.params });
      } else {
      }
    },

    changeMapType(type) {
      this.mapType = type;
    },

    postMessage(data, param) {
      const _method = data || this.method;
      let method;
      let type = "";
      if (this.methodMap2D[_method]) {
        type = "2d";
        method = this.methodMap2D[_method];
      } else if (this.methodMap3D[_method]) {
        type = "3d";
        method = this.methodMap3D[_method];
      } else {
      }
      if (!method) {
        return;
      }
      const params = data ? param : this.params;
      console.log(method);
      console.log(params);
      if (type === "3d") {
        if (!this.map3D) {
          this.map3D = document.getElementById("supermap3D").contentWindow;
        }
        console.log(
          `给3D地图发消息-----> ${method} ----> ${
            typeof params === "object" ? JSON.stringify(params) : params
          }`
        );
        this.map3D.postMessage({ method, params }, "*");
      } else {
        if (!this.map2D) {
          this.map2D = document.getElementById("supermap2D").contentWindow;
        }
        console.log(
          `给2D地图发消息-----> ${method} ----> ${
            typeof params === "object" ? JSON.stringify(params) : params
          }`
        );
        this.map2D.postMessage({ method, params }, "*");
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
    },
    eventTime: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.postMessage();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.map-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .map-content {
    z-index: 0;
    .map {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      cursor: move;
    }
  }
}
</style>
