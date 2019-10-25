<template>
  <div class="main-container" ref="mainContainer">
    <div id="themeContainer" style="width: 100%;height: 100%;"></div>
    <div v-for="defalutItem of defalutItemList" :v-bind="item = defalutItem.name" :key="defalutItem.name" :id="item" style="zIndex: 10;">
      <div
        v-if="styleMap[item].isShow || isDrag"
        class="item-box"
        :style="styleMap[item].style"
        :class="{'drag-outline': isDrag, 'dragover-oulline': dragOverItem === item}"
        :draggable="isAbleDrag"
        @drop="dropEvent($event, item)"
        @dragover.prevent="dragOverEvent($event, item)"
        @dragend="dragEndEvent($event, item)"
        @dragstart="dragStartEvent($event, item)"
      >
        <div v-if="isLogin && styleMap[item].isShow" :style="styleMap[item].style">
          <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
          <!-- 最新资讯 -->
          <template v-if="item === 'latestNews'">
            <LatestNews @showNewsDetail="showNewsDetail"></LatestNews>
          </template>
          <!-- 告警视图总览 -->
          <template v-else-if="item === 'alarmOverview'">
            <AlarmOverview></AlarmOverview>
          </template>
          <!-- 告警信息 -->
          <template v-else-if="item === 'alarmList'">
            <AlarmList @showAlarmDetail="showAlarmDetail" :update-time="updateTime"></AlarmList>
          </template>
          <!-- 分项指数 -->
          <template v-else-if="item === 'optionIndex'">
            <OptionIndex></OptionIndex>
          </template>
          <!-- 全局指数 -->
          <template v-else-if="item === 'globalIndex'">
            <GlobalIndex></GlobalIndex>
          </template>
          <!-- 人口与房屋 -->
          <template v-else-if="item === 'peopleHouse'">
            <PeopleHouse @showPeopleList="showPeopleList"></PeopleHouse>
          </template>
          <!-- 特殊人口 -->
          <template v-else-if="item === 'specialPeople'">
            <SpecialPeople @showSpecialPeople="showSpecialPeople"></SpecialPeople>
          </template>
          <!-- 综治力量 -->
          <template v-else-if="item === 'generalPower'">
            <GeneralPower @showPeopleList="showGeneralPowerList"></GeneralPower>
          </template>
        </div>
      </div>
    </div>

    <!-- 地图设置 -->
    <div class="item-box-header" :style="styleMap.MapSetting">
      <img class="item-box-bg" src="../assets/image/icon-box-header.png" />
      <MapSetting :item-map="itemMap" @changeItemStatus="changeItemStatus"></MapSetting>
    </div>

    <div
      v-for="window of windowList"
      class="item-box-header high-index"
      :style="window.style"
      :key="window.id"
      :id="window.id"
    >
      <img v-if="!window.isTopCenter" class="item-box-bg" src="../assets/image/icon-box.png" />
      <img v-else class="item-box-bg item-box-bg-header" src="../assets/image/icon-box-header.png" />
      <PopupWindow
        :component="window.component"
        :prop="window.data"
        :component-id="window.id"
        @eventListener="eventListener"
      ></PopupWindow>
    </div>

    <OnePicture v-if="isLogin" :method="method" :params="params" :event-time="eventTime" @mapEvent="mapEvent"></OnePicture>
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
import PopupWindow from "./popup-window";
import { API } from "../request/api";
import { Util } from "../utils/util";
import { TimeUtil } from "../utils/time-util";
export default {
  name: "main-container",
  data() {
    return {
      defalutItemList: [   // 默认展示模块
        {
          name: "latestNews",
          index: 8,
        },
        {
          name: "alarmOverview",
          index: 7,
        },
        {
          name: "alarmList",
          index: 6,
        },
        {
          name: "optionIndex",
          index: 5,
        },
        {
          name: "globalIndex",
          index: 4,
        },
        {
          name: "peopleHouse",
          index: 3,
        },
        {
          name: "specialPeople",
          index: 2,
        },
        {
          name: "generalPower",
          index: 1,
        },
      ],
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
        MapSetting: {}
      },

      method: null, // 和地图通讯方法名
      params: null, // 和地图通讯参数 

      dict: {},     // 字典信息
      cacheStyle: {}, // 缓存的位置信息
      itemMap: new Map(), // 小模块位置
      itemMarginRow: "10px", // 行之间间距
      itemMarginCol: "10px", // 列之间间距
      itemMinWidth: 468, // item最小宽度
      itemMinHeight: 316, // item最小高度
      borderColor: "rgba(0, 0, 0, 0)",
      isLogin: true, // 是否登录
      isDrag: false, // 是否在拖拽
      dragOverItem: "", // 正拖拽经过的item

      windowList: [],   // 打开的popupwindow列表
      videoWindowList: [],   // 打开的视频窗口列表

      updateTime: null,  // 告警推送更新时间
      connection: null,
      streamId: null,
      userId: null,
      connectionState: ["正在连接..", "连接已建立", "正在关闭..", "已经关闭"],  // 链接状态提示
      connectState: false,      // 是否链接
      authState: false,    // 是否验证账号
      bindState: false,   // 是否绑定
      presenceState: false,

      defalutFontSize: 12,   // 默认字体大小
      itemStyle_: null,   // 放大模块原有样式

      eventTime: null,   // 当前给地图发消息的时间
      roamingVideoInfo: {
        index: null,
        name: '',
      },

      roamingVideoWindowPosition: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
    };
  },
  computed: {
    isAbleDrag: function() {
      return this.windowList.length === 0 && !this.itemStyle_;
    }
  },
  mounted() {
    const self = this;
    self.init();
    if (false && Util.getRequest('auth-token')) {
    // if (Util.getRequest('auth-token')) {
      // alert(Util.getRequest('auth-token'));
      var exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 *60);//过期时间 2分钟
      document.cookie = `auth-token=${Util.getRequest('auth-token')};Path=/;expires=" + ${exp.toGMTString()}`;
      // alert(document.cookie)
      self.getDict();
      self.init();
      self.showItems();
      self.isLogin = true;
      self.userId = Util.getRequest('userId');
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
          // self.init();
          // self.isLogin = true;
        }
      );
      //  self.init();
      //  self.isLogin = true;
    }
    window.mainContainer = this;

  },
  methods: {
    init() {
      const self = this;
      const mainContainer = this.$refs.mainContainer;
      const width = window.screen.availWidth;
      if (width >= 1920) {
        this.defalutFontSize = Math.round(12 * (width / 1920));
        document.getElementsByTagName("html")[0].style.fontSize = this.defalutFontSize + "px";
      }
      const height = mainContainer.offsetHeight;
      let itemWidth =
        (parseInt(width, 10) - parseInt(self.itemMarginCol, 10) * 3) / 4;
      itemWidth =
        Math.floor(itemWidth) > self.itemMinWidth
          ? Math.floor(itemWidth)
          : self.itemMinWidth;
      let itemHeight =
        (parseInt(height, 10) - parseInt(self.itemMarginRow, 10) * 2) / 3;
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
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${itemWidth + parseInt(self.itemMarginCol, 10)}px`,
        top: `${itemHeight * 2 + parseInt(self.itemMarginRow, 10) * 2}px`
      });
      self.itemMap.set(4, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${(itemWidth + parseInt(self.itemMarginCol, 10)) * 2}px`,
        top: `${itemHeight * 2 + parseInt(self.itemMarginRow, 10) * 2}px`
      });
      self.itemMap.set(3, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${(itemWidth + parseInt(self.itemMarginCol, 10)) * 3}px`,
        top: `${(itemHeight + parseInt(self.itemMarginRow, 10)) * 2}px`
      });
      self.itemMap.set(2, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${itemWidth * 3 + parseInt(self.itemMarginCol, 10) * 3}px`,
        top: `${itemHeight + parseInt(self.itemMarginRow, 10)}px`
      });
      self.itemMap.set(1, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${itemWidth * 3 + parseInt(self.itemMarginCol, 10) * 3}px`,
        top: 0
      });
      self.itemMap.set(9, {
        width: `${itemWidth * 2 + parseInt(self.itemMarginCol, 10)}px`,
        height: `${itemHeight * 2 + parseInt(self.itemMarginRow, 10)}px`,
        left: `${itemWidth + parseInt(self.itemMarginCol, 10)}px`,
        top: 0
      });
      self.styleMap.MapSetting = {
        width: `${itemWidth * 2 + parseInt(self.itemMarginCol, 10)}px`,
        height: `3.5rem`,
        left: `${itemWidth + parseInt(self.itemMarginCol, 10)}px`,
        top: 0
      };
      self.roamingVideoWindowPosition = {
        top: 0,
        left: `${itemWidth * 2 + parseInt(self.itemMarginCol, 10) * 2}`,
        width: `${itemWidth}`,
        height: `${itemHeight}`,
      }
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
      for (const key in self.cacheStyle) {
        if (self.cacheStyle.hasOwnProperty(key)) {
          self.styleMap[key]["style"] = Object.assign({}, self.itemMap.get(
            self.cacheStyle[key]["position"]
          ));
          self.styleMap[key]["isShow"] = self.cacheStyle[key]["isShow"];
        }
      }
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
      console.log(event)
      event.dataTransfer.setData("id", id);
      this.isDrag = true;
    },

    dragEndEvent(event, id) {
      this.dragOverItem = "";
      this.isDrag = false;
    },

    dragOverEvent(event, id) {
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

    // 地图事件回传
    mapEvent(event) {
      if (event.type === 'house') {
        this.openPopupWindow(
          event.data,
          "house-electricity",
          "houseElectricity",
        );
        this.openPopupWindow(
          event.data,
          "people-info",
          "peopleInfo",
        );
      } else if (event.type === 'building') {
        this.openPopupWindow(
          event.data,
          "building-info",
          "buildingInfo",
        );
      } else if (event.type === 'playVideo') {
        this.playVideo('play', 0, event.data, {})
      } else if (event.type === 'roamingVideoStart') {
        try {
          this.playVideo('play', 10, event.data, {time: 1000 * 10})
        } catch(e) { 
          setTimeout(() => {
            this.sendMessageToMap('roamingVideoEnd', '');
          }, 1000 * 1)
        }
      }
    },

    // 格式化时间
    formatDate(date) {
      return TimeUtil.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },

    // 调用cs端播放视频
    playVideo(type, index, cameraInfo, param = {}) {
      console.log('播放视频');
      console.log(`video--->type: ${type}  ---- index: ${index}  ----  cameraInfo: ${cameraInfo}  ---- param: ${JSON.stringify(param)}`)
      try {
        if(jsobj) {  // TODO 待优化
          let params;
          if (index === 10) { // 漫游视频播放
             params = Object.assign(
              {
              "cameraInfo": cameraInfo,
              "position": this.roamingVideoWindowPosition,
              // windowId: index,
              "allowClose": true,
              }, param
            )
            this.roamingVideoInfo = cameraInfo;
          } else {
            const _index = this.getUnusedItemIndex(index);
            const style = this.itemMap.get(_index);
            params = Object.assign(
              {
              "cameraInfo": cameraInfo,
              // "position": {
              //   x: parseInt(style.left, 10),
              //   y: parseInt(style.top, 10),
              //   w: parseInt(style.width, 10),
              //   h: parseInt(style.height, 10) 
              // },
              windowId: _index,
              "allowClose": true,
              }, param
            )
            this.videoWindowList.push(_index);
          }
    
          const typeObj = {
            play: '播放视频',
            review: '回放视频'
          }
          const typeName = typeObj[type];
          // alert(JSON.stringify(params));
          // alert(typeName);
          // alert(params.beginTime);
          // alert(params.endTime);
          // alert(JSON.stringify(params.position));
          jsobj.SendUIMessage(typeName, params);
        }
      } catch(e) {
        throw new Error('视频播放异常');
      }
    },

    recvUIMessage(name, data) {
      alert(name);
      alert(data);
      if (name === '播放结束') {
        if (data === this.roamingVideoInfo) {
          this.roamingVideoInfo = '';
          this.sendMessageToMap('cancelCameraLight');
          this.sendMessageToMap('roamingVideoEnd');
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

    /**
     * 打开的窗口回传事件监听
     */
    eventListener(event) {
      const self = this;
      const mapEventMap = ['showRecentTrace', 'hideRecentTrace', 'unImportantPersonTrace'];
      if (event.type === "close") {
        const index = self.windowList.findIndex(item => item.id === event.id);
        self.windowList.splice(index, 1);
        if (this.itemStyle_) {
          this.fullScreenExit(-1);
        }
        if (event.id.toLowerCase().includes('recenttrace')) {
            this.sendMessageToMap('hideRecentTrace', {});
        }
      } else if (event.type === "alarmDeal") {
        self.openPopupWindow(event, "work-order", "alarmDeal");
      } else if (event.type === "peopleDetail") {
        self.openPopupWindow(event.id, "people-detail", "peopleDetail");
      } else if (event.type === "house") {
        if (event.data) {
          let index = parseInt(this.cacheStyle["alarmList"]["position"], 10);
          self.openPopupWindow(
            event.data.houseId,
            "house-electricity",
            "houseElectricity",
            index
          );
        } else {
        }
      } else if (event.type === "peopleInfo") {
        this.openPopupWindow(
          event.data,
          "people-info",
          "peopleInfo",
        );
        this.getHouseDetail(event.data);
      } else if (mapEventMap.includes(event.type)) {
        this.sendMessageToMap(event.type, event.data);
      }  else if (event.type === "fullScreen") {
        this.fullScreen(event.id)
      }  else if (event.type === "fullScreenExit") {
        this.fullScreenExit(event.id)
      } else {
      }
    },

    // 给地图发消息
    sendMessageToMap(method, params) {
      this.method = method;
      this.params = params;
      this.eventTime = new Date().getTime();
    },

    /**
     * 获取未使用的index  (0-8)
     */
    getUnusedItemIndex(index) {
      let usedIndexArr = this.windowList.map(item => item.positionNum);
      usedIndexArr.push(index);
      usedIndexArr = usedIndexArr.concat(this.videoWindowList);
      const avalibaledIndexArr = [8, 7, 6, 5, 4, 3, 2, 1].filter(item => item !== index);
      let _index;
      avalibaledIndexArr.forEach(item => {
        if (usedIndexArr.indexOf(item) === -1) {
          _index = item;
        }
      });
      if (!_index) {
        if (this.videoWindowList.length > 0) {
          avalibaledIndexArr.forEach(item => {
            if (this.videoWindowList.indexOf(item) === -1) {
              _index = item;
            }
          });
          if (!_index) {
            _index = avalibaledIndexArr.reverse()[0];
          }
        } else {
          _index = avalibaledIndexArr.reverse()[0];
        }
      }
      return _index;
    },
    
    /**
     * 打开窗口
     */
    openPopupWindow(event, component, type, itemIndex = -1) {
      const index = this.windowList.findIndex(item => item.type === type);
      if (index > -1) {
        this.windowList[index]["data"] = event;
      } else {
        const id = this.createId(type);
        const isTopCenter = ["news", "alarmDeal"].includes(type);
        const positionNum = isTopCenter ? 9 : this.getUnusedItemIndex(itemIndex);
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
      }
    },

    createId(name) {
      return name.toLowerCase() + new Date().getTime();
    },

    /**
     * 点击最新资讯打开窗口
     */
    showNewsDetail(event) {
      this.openPopupWindow(event, "news-detail", "news");
    },

    /**
     * 点击告警打开窗口
     */
    showAlarmDetail(event) {
      let index = parseInt(this.cacheStyle["alarmList"]["position"], 10);
      this.openPopupWindow(event.id, "alarm-detail", "alarmDetail", index);
      if (event.identityCard) {
        this.openPopupWindow(
          event.identityCard,
          "people-detail",
          "peopleDetail",
          index
        );
      }
      if (event.captureImageUri) {
        this.openPopupWindow(event, "pass-records", "passRecords", index);
      }
      if (event.videoUrl) {
        const happenTime = new Date(event.alarmTime).getTime();
        const beginTime = this.formatDate(new Date(happenTime - 1000 * 15));
        const endTime = this.formatDate(new Date(happenTime + 1000 * 15));
        console.log(beginTime);
        console.log(endTime);
        this.playVideo('review', index, event.videoUrl, {beginTime, endTime});
      }
    },

    /**
     * 点击人口与房屋人口分布饼状图打开窗口
     */
    showPeopleList(event) {
      const index = parseInt(this.cacheStyle["peopleHouse"]["position"], 10);
      this.openPopupWindow(
        { peopleType: event, peopleList: [], fromItem: "people" },
        "people-list",
        "peopleList",
        index
      );
    },

    /**
     * 点击综治力量打开窗口
     */
    showGeneralPowerList(event) {
      this.generalPowerType = event.type;
      this.generalPowerList = event.list;
      const index = parseInt(this.cacheStyle["generalPower"]["position"], 10);
      this.openPopupWindow(
        { peopleType: event.type, peopleList: event.list, fromItem: "power" },
        "people-list",
        "powerPeopleList",
        index
      );
    },

    /**
     * 点击特殊人群打开窗口
     */
    showSpecialPeople(event) {
      let index = parseInt(this.cacheStyle["specialPeople"]["position"], 10);
      this.openPopupWindow(event.id, "alarm-detail", "peopleAlarm", index);
      if (event.identityCard) {
        const peopleIndex = index > 8 ? 1 : index;
        this.openPopupWindow(
          { id: event.identityCard, name: event.relationPerson },
          "recent-trace",
          "recentTrace",
          index
        );
      }
      this.sendMessageToMap('importantPeopleLocation', event);
    },

    getHouseDetail(id) {
      API.getHouseDetail(id).then(res => {
        if (res.drawingPath) {
          
        }
      })
    },

    initWebSocket() {
      // 初始化weosocket
      // const wsuri = process.env.WS_API + "/websocket/threadsocket";//ws地址
      console.log(process.env.VUE_APP_WEBSOCKET_API);
      const wsuri = process.env.VUE_APP_WEBSOCKET_API; //ws地址
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
            console.log( "用户session绑定资源名冲突，请修改资源名或者注销账号！");
            return;
          }
        } else {
          console.log("用户session绑定成功！");
          self.bindState = true;
          const message = "<presence id='" + self.streamId + "'><status>Online</status><priority>0</priority></presence>";
          console.log("Client: " + message);
          self.connection.send(message);
          self.presenceState = true;
        }
      }

      if (self.presenceState && jsonStr.message) {
        if (jsonStr.message.body === 'add') {
          const id = jsonStr.message.subject.split("#")[1];
          API.getAlarmDetail(id).then(res => {
            self.showAlarmDetail(res);
            self.updateTime = new Date().getTime();
          }, err => {
          })
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
      document.getElementsByTagName("html")[0].style.fontSize = this.defalutFontSize + 'px';
      const index = this.windowList.findIndex(item => item.id === id);
      if (index > -1) {
        this.windowList[index]['style'] = this.itemStyle_;
        this.windowList[index]['style']['zIndex'] = 200;
      } else {
        this.styleMap[id]['style'] = this.itemStyle_;
        this.styleMap[id]['style']['zIndex'] = 200;
        this.styleMap[id]['style']['backgroundColor'] = null;
      }
      this.itemStyle_ = null;
    },

    // 窗口放大全屏
    fullScreen(id) {
      const index = this.windowList.findIndex(item => item.id === id);
      if (index > -1) {
        this.itemStyle_ = Object.assign({}, this.windowList[index]['style']);
        this.windowList[index]['style']['width'] = '100%';
        this.windowList[index]['style']['height'] = '100%';
        this.windowList[index]['style']['top'] = 0;
        this.windowList[index]['style']['left'] = 0;
        this.windowList[index]['style']['zIndex'] = 1000;
      } else {
        this.itemStyle_ = Object.assign({}, this.styleMap[id].style);
        this.styleMap[id]['style']['width'] = '100%';
        this.styleMap[id]['style']['height'] = '100%';
        this.styleMap[id]['style']['top'] = 0;
        this.styleMap[id]['style']['left'] = 0;
        this.styleMap[id]['style']['zIndex'] = 1000;
        this.styleMap[id]['style']['backgroundColor'] = 'rgba(11, 60, 80, 1)';
      }
      document.getElementsByTagName("html")[0].style.fontSize = this.defalutFontSize * 3 + 'px';
    },
  },
  components: {
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
    PopupWindow
  }
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
  background: url("../../public/img/icon-bg.jpg");
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
