<template>
  <div
    class="main-container"
    ref="mainContainer"
    @mouseup="mouseup"
    @mouseover="mouseover"
  >
    <div id="themeContainer" style="width: 100%;height: 100%;">
      <canvas id="themeBox" style="width: 100%;height: 100%;">Internet Explorer 8 Not Supported</canvas>
    </div>
    <div
      v-for="item of defalutItemList"
      :key="item.name"
      :id="item.name"
      style="zIndex: 10;"
    >
      <div
        v-if="styleMap[item.name].isShow || isDrag"
        class="item-box"
        :style="styleMap[item.name].style"
        :class="{
          'drag-outline': isDrag,
          'dragover-oulline': dragOverItem === item.name
        }"
        :draggable="isAbleDrag"
        @drop="dropEvent($event, item.name)"
        @dragover.prevent="dragOverEvent($event, item.name)"
        @dragend="dragEndEvent($event, item.name)"
        @dragstart="dragStartEvent($event, item.name)"
      >
        <div
          v-if="isLogin && styleMap[item.name].isShow"
          :style="styleMap[item.name].style"
        >
          <img
            class="item-box-bg"
            src="../assets/image/icon-box.png"
            draggable="false"
          />
          <!-- 最新资讯 -->
          <template v-if="item.name === 'latestNews'">
            <LatestNews @showNewsDetail="showNewsDetail"></LatestNews>
          </template>
          <!-- 告警视图总览 -->
          <template v-else-if="item.name === 'alarmOverview'">
            <AlarmOverview></AlarmOverview>
          </template>
          <!-- 告警信息 -->
          <template v-else-if="item.name === 'alarmList'">
            <AlarmList @showAlarmDetail="showAlarmDetail"></AlarmList>
          </template>
          <!-- 分项指数 -->
          <template v-else-if="item.name === 'optionIndex'">
            <OptionIndex></OptionIndex>
          </template>
          <!-- 全局指数 -->
          <template v-else-if="item.name === 'globalIndex'">
            <GlobalIndex></GlobalIndex>
          </template>
          <!-- 人口与房屋 -->
          <template v-else-if="item.name === 'peopleHouse'">
            <PeopleHouse @showPeopleList="showPeopleList"></PeopleHouse>
          </template>
          <!-- 特殊人口 -->
          <template v-else-if="item.name === 'specialPeople'">
            <SpecialPeople
              @showSpecialPeople="showSpecialPeople"
            ></SpecialPeople>
          </template>
          <!-- 综治力量 -->
          <template v-else-if="item.name === 'generalPower'">
            <GeneralPower @showPeopleList="showGeneralPowerList"></GeneralPower>
          </template>
        </div>
      </div>
    </div>

    <!-- 地图设置 -->
    <div class="item-box-header" :style="styleMap.MapSetting" id="mapSetting">
      <img class="item-box-bg" src="../assets/image/icon-box-header.png" />
      <MapSetting
        :item-map="itemMap"
        @changeItemStatus="changeItemStatus"
      ></MapSetting>
    </div>

    <div
      v-for="window of windowList"
      class="item-box-header high-index"
      :style="window.style"
      :key="window.id"
      :id="window.id"
    >
      <img
        v-if="!window.isTopCenter"
        class="item-box-bg"
        src="../assets/image/icon-box.png"
      />
      <!-- <img v-else class="item-box-bg item-box-bg-header" src="../assets/image/icon-box-header.png" /> -->
      <PopupWindow
        :component="window.component"
        :prop="window.data"
        :component-id="window.id"
        @eventListener="eventListener"
      ></PopupWindow>
    </div>

    <OnePicture
      v-if="isLogin"
      id="onePicture"
      ref="onePicture"
      :method="method"
      :params="params"
      :event-time="eventTime"
      @mapEvent="mapEvent"
    ></OnePicture>

    <FaceSearchResult
      v-show="isShowFaceSearchResult"
      :prop="faceSearchData"
      @windowEvent="searchResultWindowEvent"
      ref="faceSearchResult"
    ></FaceSearchResult>

    <div class="map-type" :style="styleMap.mapType">
      <img
        v-if="mapType === '2d'"
        @click="changeMapType('3d')"
        src="../assets/image/bg-3D.png"
      />
      <img
        v-if="mapType === '3d'"
        @click="changeMapType('2d')"
        src="../assets/image/bg-2D.png"
      />
    </div>
  </div>
</template>

<script>
import LatestNews from "./latest-news";
import AlarmOverview from "./alarm-overview";
import GeneralPower from "./general-power";
import OptionIndex from "./option-index";
import PeopleHouse from "./people-house";
import OnePicture from "./one-picture";
import MapSetting from "./map-setting";
import AlarmList from "./alarm-list";
import SpecialPeople from "./special-people";
import GlobalIndex from "./global-index";
import FaceSearchResult from "./face-search-result";
import PopupWindow from "./popup-window";
import { API } from "../request/api";
import { Util } from "../utils/util";
import { TimeUtil } from "../utils/time-util";
import {
  ISABLE_RESUME_HOME,
  RESUME_TIME,
  ISABLE_CTRL_RESUME_HOME
} from "../config/config";
import {
  DEFAULT_WINDOW_LIST,
  getWindowPosition
} from "../config/window-position";
const components = {
  LatestNews,
  AlarmOverview,
  GeneralPower,
  OptionIndex,
  PeopleHouse,
  OnePicture,
  MapSetting,
  AlarmList,
  SpecialPeople,
  GlobalIndex,
  FaceSearchResult,
  PopupWindow
};
export default {
  name: "main-container",
  data() {
    return {
      defalutItemList: DEFAULT_WINDOW_LIST,
      styleMap: {
        // 各个组件的位置信息及显示与否
        latestNews: {
          style: {},
          isShow: false
        },
        alarmOverview: {
          style: {},
          isShow: false
        },
        generalPower: {
          style: {},
          isShow: false
        },
        optionIndex: {
          style: {},
          isShow: false
        },
        specialPeople: {
          style: {},
          isShow: false
        },
        peopleHouse: {
          style: {},
          isShow: false
        },
        alarmList: {
          style: {},
          isShow: false
        },
        globalIndex: {
          style: {},
          isShow: false
        },
        MapSetting: {},
        mapType: {}
      },

      method: null, // 和地图通讯方法名
      params: null, // 和地图通讯参数

      dict: {}, // 字典信息
      cacheStyle: {}, // 缓存的位置信息
      itemMap: new Map(), // 小模块位置
      itemMarginRow: "10px", // 行之间间距
      itemMarginCol: "10px", // 列之间间距
      itemMinWidth: 400, // item最小宽度
      itemMinHeight: 280, // item最小高度
      borderColor: "rgba(0, 0, 0, 0)",
      isLogin: true, // 是否登录
      isDrag: false, // 是否在拖拽
      dragOverItem: "", // 正拖拽经过的item

      windowList: [], // 打开的popupwindow列表
      videoWindowList: [], // 打开的视频窗口列表
      videoWindowMap: new Map(), // 打开的视频窗口列表

      updateTime: null, // 告警推送更新时间
      connection: null,
      streamId: null,
      userId: null,
      connectionState: ["正在连接..", "连接已建立", "正在关闭..", "已经关闭"], // 链接状态提示
      connectState: false, // 是否链接
      authState: false, // 是否验证账号
      bindState: false, // 是否绑定
      presenceState: false,

      defalutFontSize: 12, // 默认字体大小
      itemStyle_: null, // 放大模块原有样式

      eventTime: null, // 当前给地图发消息的时间
      roamingVideoWindowId: 10, // 漫游视频打开窗口id 不为1-9

      width: undefined,
      height: undefined,

      isShowFaceSearchResult: false,
      faceSearchData: {},

      mapType: "2d",
      homeSetting: {},
      timer: undefined,
      timeStamp: undefined
    };
  },
  computed: {
    isAbleDrag: function() {
      // return false;
      return (
        this.windowList.length === 0 &&
        !this.itemStyle_ &&
        !this.isShowFaceSearchResult
      );
    }
  },
  mounted() {
    const self = this;
    self.init();
    // if (false && Util.getRequest("auth-token")) {
    if (Util.getRequest("auth-token")) {
      console.warn(Util.getRequest("auth-token"));
      var exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 * 24); //过期时间 一天
      document.cookie = `auth-token=${Util.getRequest(
        "auth-token"
      )};Path=/;expires=" + ${exp.toGMTString()}`;
      // alert(document.cookie)
      self.getDict();
      self.showItems();
      self.isLogin = true;
      self.userId = Util.getRequest("userId");
      // alert(Util.getRequest('userId'))
      if (!self.userId) {
        API.getUserInfo().then(
          res => {
            console.log(res);
            self.userId = res.userId;
            self.initWebSocket();
          },
          err => {}
        );
      } else {
        self.initWebSocket();
      }
    } else {
      API.login("_ONSCREEN", "AF21B8C562854").then(
        res => {
          self.getDict();
          self.showItems();
          self.isLogin = true;
          self.userId = res.userInfo.userId;
          self.initWebSocket();
        },
        err => {
          // self.isLogin = true;
        }
      );
      //  self.isLogin = true;
    }
    window.mainContainer = this;
  },
  destroyed() {
    const self = this;
    if (self.timer) {
      clearInterval(self.timer);
    }
  },
  methods: {
    mouseup() {
      if (this.isShowFaceSearchResult) {
        this.$refs.faceSearchResult.dragEnd();
      }
      this.updateTimeStamp();
    },
    mouseover(e) {
      if (this.isShowFaceSearchResult) {
        this.$refs.faceSearchResult.dragEvent(e);
      }
      this.updateTimeStamp();
    },
    init() {
      window.onresize = () => {
        console.log("change");
        if (this.windowList.length === 0) {
          this.setWidthAndHeight();
          this.showItems();
        }
      };
      this.setWidthAndHeight();
      this.updateTimeStamp();
      this.setHomeWindow();
    },

    setHomeWindow() {
      let homeSetting = localStorage.getItem("homeSetting");
      if (homeSetting) {
        this.homeSetting = JSON.parse(homeSetting);
      } else {
        this.homeSetting = {
          value1: ISABLE_RESUME_HOME,
          num: RESUME_TIME,
          value2: ISABLE_CTRL_RESUME_HOME
        };
      }
      if (this.homeSetting.value1) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          // console.log(`检查${this.homeSetting.num}分钟内有无操作`);
          // console.log(new Date().getTime() - this.timeStamp >= 1000 * 60 * this.homeSetting.num);
          if (
            new Date().getTime() - this.timeStamp >=
            1000 * 60 * this.homeSetting.num
          ) {
            console.log("关闭打开的弹框");
            this.closeAllPopupWindow();
          }
        }, 1000);
      }
    },

    updateTimeStamp() {
      this.timeStamp = new Date().getTime();
    },

    closePopupWindow() {
      if (this.homeSetting.value2) {
        this.closeAllPopupWindow();
        this.closeAllVideoWindow();
      }
    },

    closeAllPopupWindow() {
      this.windowList = [];
    },

    closePopupWindowByIndex(positionNum) {
      const _index = this.windowList.findIndex(
        item => item.positionNum === positionNum
      );
      if (_index > -1) {
        this.windowList.splice(_index, 1);
      }
    },

    closeAllVideoWindow() {
      for (let item of this.videoWindowMap.entries()) {
        if (item[1]) {
          this.closeVideo(item[0]);
        }
      }
      this.videoWindowMap.clear();
    },

    /**
     * 打开窗口
     */
    openPopupWindow(event, component, type, itemIndex) {
      const index = this.windowList.findIndex(item => item.type === type);
      if (index > -1) {
        this.windowList[index]["data"] = event;
      } else {
        const id = this.createId(type);
        const isTopCenter = ["news", "alarmDeal"].includes(type);
        const positionNum = itemIndex ? itemIndex : getWindowPosition(type);
        if (this.videoWindowMap.get(positionNum)) {
          this.closeVideo(positionNum);
        }
        this.closePopupWindowByIndex(positionNum);
        const style = Object.assign({}, this.itemMap.get(positionNum));
        this.windowList.push({
          id,
          type,
          isTopCenter,
          component,
          data: event,
          style,
          positionNum
        });
        console.log(this.windowList);
      }
    },

    /**
     * 打开窗口
     */
    openFixedPopupWindow(event, component, type, index) {
      const id = this.createId(type);
      const isTopCenter = ["news", "alarmDeal"].includes(type);
      const style = Object.assign({}, this.itemMap.get(index));
      const positionNum = index;
      this.windowList.push({
        id,
        type,
        isTopCenter,
        component,
        data: event,
        style,
        positionNum
      });
    },

    setWidthAndHeight() {
      const self = this;
      self.width = window.document.body.offsetWidth;
      // if (width >= 1920) {
      self.defalutFontSize = Math.round(12 * (self.width / 1920));
      if (self.defalutFontSize < 12) {
        self.defalutFontSize = 12;
      }
      document.getElementsByTagName("html")[0].style.fontSize =
        self.defalutFontSize + "px";
      // }
      self.height = window.document.body.offsetHeight;
      let itemWidth = parseInt(400 * (self.width / 1920), 10);

      itemWidth =
        Math.floor(itemWidth) > self.itemMinWidth
          ? Math.floor(itemWidth)
          : self.itemMinWidth;
      let itemHeight =
        (parseInt(self.height, 10) - parseInt(self.itemMarginRow, 10) * 2) / 3;

      itemHeight =
        Math.floor(itemHeight) > self.itemMinHeight
          ? Math.floor(itemHeight)
          : self.itemMinHeight;
      self.setItemPosition(itemWidth, itemHeight);
    },

    /**
     * 计算每个小模块的位置
     * 8       9      1
     * 7              2
     * 6    5    4    3
     */
    setItemPosition(itemWidth, itemHeight) {
      const self = this;
      let centerWidth =
        (this.width - itemWidth * 2 - parseInt(self.itemMarginCol, 10) * 3) / 2;
      centerWidth =
        Math.floor(centerWidth) > self.itemMinWidth
          ? Math.floor(centerWidth)
          : self.itemMinWidth;
      const left =
        itemWidth + centerWidth * 2 + parseInt(self.itemMarginCol, 10) * 3;
      self.itemMap.set(8, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: 0,
        top: 0
      });
      self.itemMap.set(7, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: 0,
        top: `${itemHeight + parseInt(self.itemMarginRow, 10)}px`
      });
      self.itemMap.set(6, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: 0,
        top: `${(itemHeight + parseInt(self.itemMarginRow, 10)) * 2}px`
      });
      self.itemMap.set(5, {
        width: `${centerWidth}px`,
        height: `${itemHeight}px`,
        left: `${itemWidth + parseInt(self.itemMarginCol, 10)}px`,
        top: `${itemHeight * 2 + parseInt(self.itemMarginRow, 10) * 2}px`
      });
      self.itemMap.set(4, {
        width: `${centerWidth}px`,
        height: `${itemHeight}px`,
        left: `${itemWidth +
          centerWidth +
          parseInt(self.itemMarginCol, 10) * 2}px`,
        top: `${itemHeight * 2 + parseInt(self.itemMarginRow, 10) * 2}px`
      });
      self.itemMap.set(3, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${left}px`,
        top: `${(itemHeight + parseInt(self.itemMarginRow, 10)) * 2}px`
      });
      self.itemMap.set(2, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${left}px`,
        top: `${itemHeight + parseInt(self.itemMarginRow, 10)}px`
      });
      self.itemMap.set(1, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${left}px`,
        top: 0
      });
      self.itemMap.set(9, {
        width: `${centerWidth * 2 + parseInt(self.itemMarginCol, 10)}px`,
        height: `${itemHeight * 2 + parseInt(self.itemMarginRow, 10)}px`,
        left: `${itemWidth + parseInt(self.itemMarginCol, 10)}px`,
        top: 0
      });

      self.itemMap.set(98, {
        width: `${400 * Util.getFontSizeTimes()}px`,
        height: `${270 * Util.getFontSizeTimes()}px`,
        left: `${itemWidth +
          centerWidth +
          parseInt(self.itemMarginCol, 10) * 1.5 -
          200 * Util.getFontSizeTimes()}px`,
        top: `${itemHeight * 2 +
          parseInt(self.itemMarginRow, 10) * 2 -
          320 * Util.getFontSizeTimes()}px`
      });

      self.styleMap.MapSetting = {
        width: `${centerWidth * 2 + parseInt(self.itemMarginCol, 10)}px`,
        height: `3.5rem`,
        left: `${itemWidth + parseInt(self.itemMarginCol, 10)}px`,
        top: 0
      };

      self.styleMap.mapType = {
        left: `${itemWidth +
          centerWidth * 2 +
          parseInt(self.itemMarginCol, 10) * 2 -
          108 * Util.getFontSizeTimes()}px`,
        top: `${itemHeight * 2 +
          parseInt(self.itemMarginRow, 10) -
          84 * Util.getFontSizeTimes()}px`,
        width: `${108 * Util.getFontSizeTimes()}px`,
        height: `${84 * Util.getFontSizeTimes()}px`
      };

      self.itemMap.set(self.roamingVideoWindowId, {
        width: `${itemWidth}`,
        height: `${itemHeight}`,
        top: 0,
        left: `${itemWidth * 2 + parseInt(self.itemMarginCol, 10) * 2}`
      });
      console.log(self.itemMap);
      self.cacheItems();
    },

    /**
     * 缓存模块对应的index及是否显示
     */
    cacheItems() {
      const self = this;
      const _cacheStyle = localStorage.getItem("cacheStyle");
      if (_cacheStyle) {
        self.cacheStyle = JSON.parse(_cacheStyle);
      } else {
        self.cacheStyle = {};
        self.defalutItemList.forEach(item => {
          self.cacheStyle[item.name] = {
            position: item.index,
            isShow: true
          };
        });
      }
      localStorage.setItem("cacheStyle", JSON.stringify(self.cacheStyle));
    },

    showItems() {
      const self = this;
      console.log("self.itemMap ---> ", self.itemMap);
      console.log("self.cacheStyle --> ", self.cacheStyle);
      for (const key in self.cacheStyle) {
        if (self.cacheStyle.hasOwnProperty(key)) {
          self.styleMap[key]["style"] = Object.assign(
            {},
            self.itemMap.get(self.cacheStyle[key]["position"])
          );
          self.styleMap[key]["isShow"] = self.cacheStyle[key]["isShow"];
          // console.log(`self.styleMap  -- ${key}  --> `, self.styleMap[key]);
        }
      }
      console.log("self.styleMap --> ", self.styleMap);
    },

    dropEvent(event, id) {
      // 防止或火狐中拖拽打开新页面
      event.preventDefault(); // 阻止冒泡
      event.stopPropagation(); // 阻止默认行为
      const self = this;
      const _id = event.dataTransfer.getData("id");
      const _style = self.cacheStyle[_id]["position"];
      const style = self.cacheStyle[id]["position"];
      // 交换拖动源和目标的位置并存储
      self.cacheStyle[_id]["position"] = style;
      self.cacheStyle[id]["position"] = _style;
      self.styleMap[_id]["style"] = self.itemMap.get(style);
      self.styleMap[id]["style"] = self.itemMap.get(_style);
      localStorage.setItem("cacheStyle", JSON.stringify(self.cacheStyle));
      self.dragOverItem = "";
      self.isDrag = false;
    },

    dragStartEvent(event, id) {
      if (!this.isAbleDrag) {
        return;
      }
      console.log(event);
      event.dataTransfer.setData("id", id);
      this.isDrag = true;
    },

    dragEndEvent(event, id) {
      this.dragOverItem = "";
      this.isDrag = false;
    },

    dragOverEvent(event, id) {
      if (!this.isAbleDrag) {
        return;
      }
      console.log(id);
      this.dragOverItem = id;
    },

    changeItemStatus(event) {
      const self = this;
      event.forEach(item => {
        self.styleMap[item.id]["isShow"] = item.checked;
        self.cacheStyle[item.id]["isShow"] = item.checked;
      });
      localStorage.setItem("cacheStyle", JSON.stringify(self.cacheStyle));
    },

    // 格式化时间
    formatDate(date) {
      return TimeUtil.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },

    // 调用cs端播放视频
    playVideo(
      type,
      windowId,
      cameraInfo,
      param = {},
      allowLock = false,
      allowClose = true,
      allowFullScreen = true,
      fb
    ) {
      // alert(`windowId: ${windowId}`)
      console.log("播放视频");
      console.log(
        `video--->type: ${type}  ---- windowId: ${windowId}  ----  cameraInfo: ${cameraInfo}  ---- param: ${JSON.stringify(
          param
        )}`
      );
      try {
        if (jsobj) {
          // if (true) {
          const style = this.itemMap.get(windowId);
          const params = Object.assign(
            {
              cameraInfo: cameraInfo,
              position: {
                x: parseInt(style.left, 10),
                y: parseInt(style.top, 10),
                w: parseInt(style.width, 10),
                h: parseInt(style.height, 10)
              },
              windowId,
              allowClose,
              allowLock,
              allowFullScreen,
            },
            param
          );

          const typeObj = {
            play: "播放视频",
            review: "回放视频"
          };
          const typeName = typeObj[type];
          // alert(JSON.stringify(params));
          // alert(typeName);
          // alert(params.beginTime);
          // alert(params.endTime);
          // alert(JSON.stringify(params.position));

          this.videoWindowMap.set(windowId, {
            name: cameraInfo,
            time: new Date().getTime()
          });

          jsobj.SendUIMessage(typeName, params);
          this.closePopupWindowByIndex(windowId);
        }
      } catch (e) {
        console.warn("视频播放异常");
        if (fb) {
          fb();
        }
      }
    },

    closeVideo(index, fb) {
      try {
        if (jsobj) {
          jsobj.SendUIMessage("关闭视频", { windowId: index });
          this.videoWindowMap.delete(index);
        }
      } catch (e) {
        console.warn("关闭视频失败");
        if (fb) {
          fb();
        }
      }
    },

    getUnusedVideoIndex(videoUrl) {
      let index;
      const usedIndexArr = [];
      for (let item of this.videoWindowMap.entries()) {
        if (item[1]) {
          usedIndexArr.push(item[0]);
          if (item[1]["name"] === videoUrl) {
            index = item[0];
          }
        }
      }
      if (index) {
        // 摄像头窗口是否已经打开
        return index;
      }
      console.log("usedIndexArr:  ", JSON.stringify(usedIndexArr));
      const avalibaledIndexArr = [8, 7, 6, 5, 4, 3, 2, 1];
      avalibaledIndexArr.forEach(item => {
        if (!usedIndexArr.includes(item)) {
          index = item;
        }
      });
      // 如果8个窗口满了，替换最早的窗口
      if (!index) {
        let time, earliestWindowId;
        for (let item of this.videoWindowMap.entries()) {
          if (item[1]) {
            if (!time || item[1].time < time) {
              time = item[1].time;
              earliestWindowId = item[0];
              console.log("earliestWindowId --> " + earliestWindowId);
            }
          }
        }
        index = earliestWindowId;
      }
      return index;
    },

    initAlarm() {
      const time = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;
      const date = TimeUtil.formatDate(new Date(time), "yyyy-MM-dd hh:mm:ss");
      API.getImportantPeopleList(date).then(
        res => {
          this.sendMessageToMap("importantPeople", res);
        },
        err => {}
      );
      API.getAlarmEventList(date).then(
        res => {
          this.sendMessageToMap("eventAlarm", res);
        },
        err => {}
      );
    },

    recvUIMessage(name, data) {
      // alert(name);
      // alert(data);
      const windowId = JSON.parse(data)["windowId"];
      if (name === "视频结束" || name === "播放视频失败") {
        if (windowId === this.roamingVideoWindowId) {
          this.sendMessageToMap("cancelCameraLight");
          this.sendMessageToMap("roamingVideoEnd");
        } else {
          this.videoWindowMap.delete(windowId);
        }
      }
    },

    /**
     * 获取字典
     */
    getDict() {
      const self = this;
      API.getDict().then(
        res => {
          self.dict = res;
        },
        err => {}
      );
    },

    // 地图事件回传
    mapEvent(event) {
      if (event.type === "house") {
        this.openPopupWindow(
          event.data,
          "house-electricity",
          "houseElectricity"
        );
        this.openPopupWindow(event.data, "people-info", "peopleInfo");
      } else if (event.type === "building") {
        this.openPopupWindow(event.data, "building-info", "buildingInfo");
      } else if (event.type === "playVideo") {
        const index = this.getUnusedVideoIndex(event.data);
        this.playVideo("play", index, event.data, {});
      } else if (event.type === "roamingVideoStart") {
        const fb = () => {
          setTimeout(() => {
            this.sendMessageToMap("roamingVideoEnd", "");
          }, 1000 * 1);
        };
        this.playVideo(
          "play",
          this.roamingVideoWindowId,
          event.data,
          {
            time: 1000 * 10
          },
          true,
          true,
          false,
          fb
        );
      } else if (event.type === "openFaceSearch") {
        this.openFixedPopupWindow(
          event.data,
          "face-recognition",
          "faceRecognition",
          98
        );
      } else if (event.type === "2dMapLoaded") {
        console.log("2d地图加载完毕");
        this.initAlarm();
      } else if (event.type === "mouseup") {
        this.updateTimeStamp();
        this.mouseup();
      } else if (event.type === "mouseover") {
        this.mouseover(event.data);
      } else {
      }
    },

    searchResultWindowEvent(event) {
      if (event.type === "showTrace") {
        this.sendMessageToMap("unImportantPersonTrace", event.data);
      }
    },

    /**
     * 打开的窗口回传事件监听
     */
    eventListener(event) {
      const self = this;
      const mapEventMap = [
        "showRecentTrace",
        "hideRecentTrace",
        "unImportantPersonTrace"
      ];
      if (event.type === "close") {
        const index = self.windowList.findIndex(item => item.id === event.id);
        self.windowList.splice(index, 1);
        if (this.itemStyle_) {
          this.fullScreenExit(-1);
        }
        if (event.id.toLowerCase().includes("recenttrace")) {
          this.sendMessageToMap("hideRecentTrace", {});
        }
      } else if (event.type === "alarmDeal") {
        self.openPopupWindow(event, "work-order", "alarmDeal", 9);
      } else if (event.type === "peopleDetail") {
        self.openPopupWindow(event.id, "people-detail", "peopleDetail");
      } else if (event.type === "house") {
        if (event.data) {
          self.openPopupWindow(
            event.data.houseId,
            "house-electricity",
            "houseElectricity"
          );
        } else {
        }
      } else if (event.type === "peopleInfo") {
        this.openPopupWindow(event.data, "people-info", "peopleInfo");
      } else if (event.type === "houseInfo") {
        this.openPopupWindow(event.data, "people-info", "peopleInfo");
        this.openPopupWindow(event.data, "house-tile", "houseTile");
        this.openPopupWindow(
          event.data,
          "house-electricity",
          "houseElectricity"
        );
      } else if (mapEventMap.includes(event.type)) {
        this.sendMessageToMap(event.type, event.data);
      } else if (event.type === "fullScreen") {
        this.fullScreen(event.id);
      } else if (event.type === "fullScreenExit") {
        this.fullScreenExit(event.id);
      } else if (event.type === "searchFace") {
        this.faceSearchData = Object.assign({}, event.data);
        this.isShowFaceSearchResult = true;
      } else {
      }
    },

    faceSearchListener(event) {
      if (event.type === "close") {
        this.isShowFaceSearchResult = false;
      }
    },

    // 给地图发消息
    sendMessageToMap(method, params) {
      this.method = method;
      this.params = params;
      this.eventTime = new Date().getTime();
    },

    createId(name) {
      return name.toLowerCase() + new Date().getTime();
    },

    /**
     * 点击最新资讯打开窗口
     */
    showNewsDetail(event) {
      this.openPopupWindow(event, "news-detail", "news", 9);
    },

    /**
     * 点击人口与房屋人口分布饼状图打开窗口
     */
    showPeopleList(event) {
      this.openPopupWindow(
        { peopleType: event, peopleList: [], fromItem: "people" },
        "people-list",
        "importantPeopleList",
      );
    },

    /**
     * 点击综治力量打开窗口
     */
    showGeneralPowerList(event) {
      this.generalPowerType = event.type;
      this.generalPowerList = event.list;
      this.openPopupWindow(
        { peopleType: event.type, peopleList: event.list, fromItem: "power" },
        "people-list",
        "powerPeopleList"
      );
    },

    /**
     * 点击告警打开窗口
     */
    showAlarmDetail(event, isPush = false) {
      this.openPopupWindow(event.id, "alarm-detail", "alarmDetail");
      if (event.identityCard) {
        this.openPopupWindow(
          event.identityCard,
          "people-detail",
          "peopleDetail"
        );
      }
      if (event.captureImageUri) {
        this.openPopupWindow(event, "pass-records", "passRecords");
      }
      if (event.videoUrl) {
        const happenTime = new Date(event.alarmTime).getTime();
        const beginTime = this.formatDate(new Date(happenTime - 1000 * 15));
        const endTime = this.formatDate(new Date(happenTime + 1000 * 15));
        // console.log(beginTime);
        // console.log(endTime);
        const index = isPush
          ? getWindowPosition("pushAlarmVideo")
          : getWindowPosition("videoReview");
        this.playVideo("review", index, event.videoUrl, { beginTime, endTime });
      }
      this.sendMessageToMap("alarmLocation", event);
      if (event.alarmDesc === "独居老人帮扶异常") {
        this.openPopupWindow(event.houseId, "house-tile", "houseTile");
      }
    },

    /**
     * 点击特殊人群打开窗口
     */
    showSpecialPeople(event, isPush = false) {
      this.openPopupWindow(
        event.identityCard,
        "important-people-detail",
        "importantPeopleDetail"
      );
      if (event.identityCard) {
        this.openPopupWindow(
          { id: event.identityCard, name: event.relationPerson, time: event.alarmTime },
          "recent-trace",
          "recentTrace"
        );
      }
      this.sendMessageToMap("importantPeopleLocation", event);
      if (event.videoUrl) {
        const happenTime = new Date(event.alarmTime).getTime();
        const beginTime = this.formatDate(new Date(happenTime - 1000 * 15));
        const endTime = this.formatDate(new Date(happenTime + 1000 * 15));
        // console.log(beginTime);
        // console.log(endTime);
        const index = isPush
          ? getWindowPosition("pushAlarmVideo")
          : getWindowPosition("videoReview");
        this.playVideo("review", index, event.videoUrl, { beginTime, endTime });
      }
    },

    changeMapType(type) {
      this.mapType = type;
      this.$refs.onePicture.changeMapType(type);
    },

    initWebSocket() {
      // 初始化weosocket
      // const wsuri = process.env.WS_API + "/websocket/threadsocket";//ws地址
      // ws://172.29.1.18:9070/ws/
      console.log("websocket地址：   ", Util.getWebSocketUrl());
      const wsuri = Util.getWebSocketUrl(); //ws地址
      this.connection = new WebSocket(wsuri, "xmpp");
      this.connection.onopen = this.websocketonopen;
      this.connection.onerror = this.websocketonerror;
      this.connection.onmessage = this.websocketonmessage;
      this.connection.onclose = this.websocketclose;
    },

    websocketonopen() {
      console.log("WebSocket连接成功");
      //打印链接状态
      console.log(this.connectionState[this.connection.readyState]);
      //发送建立流请求
      var stream =
        "<open from='hxct@unicorn' to='unicorn' xmlns='urn:ietf:params:xml:ns:xmpp-framing' xml:lang='en' version='1.0'/>";
      console.log("Client: " + stream);
      this.connection.send(stream);
    },

    websocketonerror(event) {
      //错误
      console.log("WebSocket连接发生错误");
    },

    websocketonmessage(event) {
      const self = this;
      console.log("Server: " + event.data);
      const jsonStr = this.$x2js.xml2js(event.data);
      console.log(jsonStr);

      if (jsonStr.open) {
        self.streamId = jsonStr.open._id;
      }

      if (self.connectionState && jsonStr.features) {
        const data = jsonStr.features;
        if (data.mechanisms) {
          const mechanism = data.mechanisms.mechanism[0];
          if (mechanism) {
            console.log("验证客户端身份！");
            const password = Util.getCookie();
            console.log(password);
            const username = "0#" + self.userId;
            console.log(username);
            //Base64编码
            const encodeToken = window.btoa(username + "\0" + password);
            const message =
              "<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='" +
              mechanism +
              "'>" +
              encodeToken +
              "</auth>";
            console.log("Client: " + message);
            this.connection.send(message);
          }
        }
      }

      if (jsonStr.success) {
        console.log("用户账号验证成功！");
        const message =
          "<iq id='" +
          self.streamId +
          "' type='set'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind'><resource></resource></bind></iq>";
        console.log("Client: " + message);
        self.authState = true;
        self.connection.send(message);
      }

      if (self.authState && jsonStr.iq) {
        if (jsonStr.iq.error) {
          if (jsonStr.iq.error.conflict) {
            console.log(
              "用户session绑定资源名冲突，请修改资源名或者注销账号！"
            );
            return;
          }
        } else {
          console.log("用户session绑定成功！");
          // alert('ok')
          self.bindState = true;
          const message =
            "<presence id='" +
            self.streamId +
            "'><status>Online</status><priority>0</priority></presence>";
          console.log("Client: " + message);
          self.connection.send(message);
          self.presenceState = true;
        }
      }

      if (self.presenceState && jsonStr.message) {
        if (jsonStr.message.body === "add") {
          // alert(jsonStr.message.subject);
          // alert(jsonStr.message.subject.split("#")[1]);
          const id = jsonStr.message.subject.split("#")[1];
          if (!id) {
            return;
          }
          API.getAlarmDetail(id).then(
            res => {
              if (res.alarmType === '人员类告警') {
                self.showSpecialPeople(res, true);
              } else {
                self.showAlarmDetail(res, true);
              }
              self.updateTime = new Date().getTime();
            },
            err => {}
          );
        }
      }

      if (self.connectionState && jsonStr.close) {
        console.log("用户退出openfire服务！");
        self.connectState = false;
        self.authState = false;
        self.bindState = false;
        self.presenceState = false;
        self.connection.close();
        console.log(self.connectionState[self.connection.readyState]);
      }

      if (jsonStr.failure) {
        console.log("用户退出openfire服务！");
        self.connectState = false;
        self.authState = false;
        self.bindState = false;
        self.presenceState = false;
        self.connection.close();
        // cur_reconnect_count = cur_reconnect_count + 1;
        // if (cur_reconnect_count >= max_reconnect_count) {
        //   console.log("达到最大重连次数，不再重连！");
        //   return;
        // }
        // console.log("。。。。。。重连。。。。。。。。。!");
        // setTimeout(connectWS(), 1000);
      }
    },

    websocketsend(agentData) {
      //数据发送
      this.websock.send(agentData);
    },

    websocketclose(event) {
      //关闭
      console.log("connection closed (" + event.code + ")");
    },

    // 窗口还原
    fullScreenExit(id) {
      // document.getElementsByTagName("html")[0].style.fontSize =
      //   this.defalutFontSize + "px";
      const index = this.windowList.findIndex(item => item.id === id);
      if (index > -1) {
        this.windowList[index]["style"] = this.itemStyle_;
        this.windowList[index]["style"]["zIndex"] = 200;
      } else {
        this.styleMap[id]["style"] = this.itemStyle_;
        this.styleMap[id]["style"]["zIndex"] = 200;
        this.styleMap[id]["style"]["backgroundColor"] = null;
      }
      this.itemStyle_ = null;
    },

    // 窗口放大全屏
    fullScreen(id) {
      const index = this.windowList.findIndex(item => item.id === id);
      if (index > -1) {
        this.itemStyle_ = Object.assign({}, this.windowList[index]["style"]);
        this.windowList[index]["style"]["width"] = "100%";
        this.windowList[index]["style"]["height"] = "100%";
        this.windowList[index]["style"]["top"] = 0;
        this.windowList[index]["style"]["left"] = 0;
        this.windowList[index]["style"]["zIndex"] = 1000;
      } else {
        this.itemStyle_ = Object.assign({}, this.styleMap[id].style);
        this.styleMap[id]["style"]["width"] = "100%";
        this.styleMap[id]["style"]["height"] = "100%";
        this.styleMap[id]["style"]["top"] = 0;
        this.styleMap[id]["style"]["left"] = 0;
        this.styleMap[id]["style"]["zIndex"] = 1000;
        this.styleMap[id]["style"]["backgroundColor"] = "rgba(11, 60, 80, 1)";
      }
    }
  },
  components: components
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main-container {
  position: fixed;
  color: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: url("../../public/img/icon-bg.jpg");
  background-size: 100% 100%;
  background-attachment: fixed;
  .item-box {
    position: absolute;
    z-index: 10;
    user-select: none;
    // background-color: rgba(11, 60, 80, 0.5);
    .item-box-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
  .item-box-header {
    position: absolute;
    z-index: 20;
    user-select: none;
    .item-box-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
    .item-box-bg-header {
      height: 3rem;
    }
  }
  .drag-outline {
    position: absolute;
    z-index: 100;
    display: block !important;
    border: 0.25rem dotted white !important;
  }

  .dragover-oulline {
    animation: glow 800ms ease-out infinite alternate;
  }

  .high-index {
    z-index: 200;
  }

  .map-type {
    z-index: 1;
    bottom: 34%;
    position: absolute;
    right: 410px;
    width: 108px;
    height: 84px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  @keyframes glow {
    0% {
      border-color: #393;
      box-shadow: 0 0 0.5rem rgba(0, 255, 0, 0.2),
        inset 0 0 0.5rem rgba(0, 255, 0, 0.1), 0 0.2rem 0 #393;
    }
    100% {
      border-color: #6f6;
      box-shadow: 0 0 2rem rgba(0, 255, 0, 0.6),
        inset 0 0 1rem rgba(0, 255, 0, 0.4), 0 0.2rem 0 #6f6;
    }
  }
}
</style>
