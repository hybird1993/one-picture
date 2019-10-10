<template>
  <div class="main-container" ref="mainContainer">
    <div id="themeContainer" style="width: 100%;height: 100%;"></div>
    <div v-for="item of defalutItemList" :key="item" style="zIndex: 10;">
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
      <img v-else class="item-box-bg" src="../assets/image/icon-box-center.png" />
      <PopupWindow
        :component="window.component"
        :prop="window.data"
        :component-id="window.id"
        @eventListener="eventListener"
      ></PopupWindow>
    </div>

    <OnePicture :method="method" :params="params"></OnePicture>
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
export default {
  name: "main-container",
  data() {
    return {
      defalutItemList: [   // 默认展示模块
        "latestNews",
        "alarmOverview",
        "alarmList",
        "optionIndex",
        "globalIndex",
        "peopleHouse",
        "specialPeople",
        "generalPower"
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

      updateTime: null,  // 告警推送更新时间
      connection: null,
      streamId: null,
      userId: null,
      connectionState: ["正在连接..", "连接已建立", "正在关闭..", "已经关闭"],  // 链接状态提示
      connectState: false,      // 是否链接
      authState: false,    // 是否验证账号
      bindState: false,   // 是否绑定
      presenceState: false,
    };
  },
  computed: {
    isAbleDrag: function() {
      return this.windowList.length === 0;
    }
  },
  mounted() {
    const self = this;
    API.login("_ONSCREEN", "AF21B8C562854").then(
      res => {
        self.getDict();
        self.init();
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
  },
  methods: {
    init() {
      const self = this;
      const mainContainer = this.$refs.mainContainer;
      const width = mainContainer.offsetWidth;
      if (width >= 1920) {
        document.getElementsByTagName("html")[0].style.fontSize =
          Math.round(12 * (width / 1920)) + "px";
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
      self.showItems();
    },

    /**
     * 计算每个小模块的位置
     * 1       9      8
     * 2              7
     * 3    4    5    6   
     */
    setItemPosition(itemWidth, itemHeight) {
      const self = this;
      self.itemMap.set(1, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: 0,
        top: 0
      });
      self.itemMap.set(2, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: 0,
        top: `${itemHeight + parseInt(self.itemMarginRow, 10)}px`
      });
      self.itemMap.set(3, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: 0,
        top: `${(itemHeight + parseInt(self.itemMarginRow, 10)) * 2}px`
      });
      self.itemMap.set(4, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${itemWidth + parseInt(self.itemMarginCol, 10)}px`,
        top: `${itemHeight * 2 + parseInt(self.itemMarginRow, 10) * 2}px`
      });
      self.itemMap.set(5, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${(itemWidth + parseInt(self.itemMarginCol, 10)) * 2}px`,
        top: `${itemHeight * 2 + parseInt(self.itemMarginRow, 10) * 2}px`
      });
      self.itemMap.set(6, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${(itemWidth + parseInt(self.itemMarginCol, 10)) * 3}px`,
        top: `${(itemHeight + parseInt(self.itemMarginRow, 10)) * 2}px`
      });
      self.itemMap.set(7, {
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${itemWidth * 3 + parseInt(self.itemMarginCol, 10) * 3}px`,
        top: `${itemHeight + parseInt(self.itemMarginRow, 10)}px`
      });
      self.itemMap.set(8, {
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
        self.defalutItemList.forEach((item, index) => {
          self.cacheStyle[item] = {
            position: index + 1,
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
          self.styleMap[key]["style"] = self.itemMap.get(
            self.cacheStyle[key]["position"]
          );
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
      const mapEventMap = ['showRecentTrace', 'hideRecentTrace'];
      if (event.type === "close") {
        const index = self.windowList.findIndex(item => item.id === event.id);
        self.windowList.splice(index, 1);
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
      } else if (mapEventMap.includes(event.type)) {
        this.sendMessageToMap(event.type, event.data);
      } else {
      }
    },

    sendMessageToMap(method, params) {
      this.method = method;
      this.params = params;
    },

    /**
     * 获取未使用的index
     */
    getUnusedItemIndex(index) {
      const usedIndexArr = this.windowList.map(item => item.positionNum);
      usedIndexArr.push(index);
      const avalibaledIndexArr = [8, 7, 6, 5, 4, 3, 2, 1];
      let _index;
      avalibaledIndexArr.forEach(item => {
        if (usedIndexArr.indexOf(item) === -1) {
          _index = item;
        }
      });
      if (!_index) {
        _index = index + 1 > 8 ? 1 : index + 1;
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
        let style, positionNum;
        if (isTopCenter) {
          style = this.itemMap.get(9);
          positionNum = 9;
        } else {
          const styleIndex = this.getUnusedItemIndex(itemIndex);
          style = this.itemMap.get(styleIndex);
          positionNum = styleIndex;
        }
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

    initWebSocket() {
      console.log(document.cookie);
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
      API.getUserInfo().then(
        res => {
          console.log(res);
        },
        err => {}
      );
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
            let password =
              "auth-token=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1Njk0MDAwNDQsInN1YiI6IjIzIiwiaXNzIjoid2ViIiwiZXhwIjoxNTY5NDAxODQ0fQ.KZhlL2oTaKhN0agynqGWMLuCvYhofOQ4V-q6Qc3lD6I";
            password = password.split("=")[1];
            const username = "0#" + self.userId;
            //Base64编码
            var encodeToken = window.btoa(username + "\0" + password);
            var message =
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
          var message = "<presence id='" + self.streamId + "'><status>Online</status><priority>0</priority></presence>";
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
    }
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
