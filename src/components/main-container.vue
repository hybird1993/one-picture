<template>
  <div class="main-container" ref="mainContainer">
    <div id="themeContainer" style="width: 100%;height: 100%;"></div>
    <!-- 最新资讯 -->
    <div
      v-if="isLogin"
      class="item-box"
      id="latestNews"
      :style="styleMap.latestNews"
      draggable="true"
      @drop="dropEvent($event, 'latestNews')"
      @dragover.prevent
      @dragstart="dragStartEvent($event, 'latestNews')"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
      <LatestNews></LatestNews>
    </div>

    <!-- 告警视图总览 -->
    <div
      v-if="isLogin"
      class="item-box"
      id="alarmOverview"
      :style="styleMap.alarmOverview"
      draggable="true"
      @drop="dropEvent($event, 'alarmOverview')"
      @dragover.prevent
      @dragstart="dragStartEvent($event, 'alarmOverview')"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
      <AlarmOverview></AlarmOverview>
    </div>

    <!-- 通行记录 -->
    <div
      v-if="isLogin"
      class="item-box"
      id="passRecords"
      :style="styleMap.passRecords"
      draggable="true"
      @drop="dropEvent($event, 'passRecords')"
      @dragover.prevent
      @dragstart="dragStartEvent($event, 'passRecords')"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
      <PassRecords></PassRecords>
    </div>

    <!-- 分项指数 -->
    <div
      v-if="isLogin"
      class="item-box"
      id="optionIndex"
      :style="styleMap.optionIndex"
      draggable="true"
      @drop="dropEvent($event, 'optionIndex')"
      @dragover.prevent
      @dragstart="dragStartEvent($event, 'optionIndex')"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
      <OptionIndex></OptionIndex>
    </div>

    <!-- 人口信息 -->
    <div
      v-if="isLogin"
      class="item-box"
      id="peopleInfo"
      :style="styleMap.peopleInfo"
      draggable="true"
      @drop="dropEvent($event, 'peopleInfo')"
      @dragover.prevent
      @dragstart="dragStartEvent($event, 'peopleInfo')"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
      <PeopleInfo></PeopleInfo>
    </div>

    <!-- 人口与房屋 -->
    <div
      v-if="isLogin"
      class="item-box"
      id="peopleHouse"
      :style="styleMap.peopleHouse"
      draggable="true"
      @drop="dropEvent($event, 'peopleHouse')"
      @dragover.prevent
      @dragstart="dragStartEvent($event, 'peopleHouse')"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
      <PeopleHouse></PeopleHouse>
    </div>

    <!-- 房屋用电情况 -->
    <div
      v-if="isLogin"
      class="item-box"
      id="houseElectricity"
      :style="styleMap.houseElectricity"
      draggable="true"
      @drop="dropEvent($event, 'houseElectricity')"
      @dragover.prevent
      @dragstart="dragStartEvent($event, 'houseElectricity')"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
      <HouseElectricity></HouseElectricity>
    </div>

    <!-- 综治力量 -->
    <div
      v-if="isLogin"
      class="item-box"
      id="generalPower"
      :style="styleMap.generalPower"
      draggable="true"
      @drop="dropEvent($event, 'generalPower')"
      @dragover.prevent
      @dragstart="dragStartEvent($event, 'generalPower')"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" draggable="false" />
      <GeneralPower></GeneralPower>
    </div>

    <!-- 地图设置 -->
    <div class="item-box-header" id="map-setting" :style="styleMap.MapSetting">
      <img class="item-box-bg" src="../assets/image/icon-box-header.png" />
      <MapSetting item-map="itemMap" @changeItemStatus="changeItemStatus"></MapSetting>
    </div>
    <OnePicture></OnePicture>
  </div>
</template>

<script>
import LatestNews from "./latest-news";
import AlarmOverview from "./alarm-overview";
import GeneralPower from "./general-power";
import OptionIndex from "./option-index";
import HouseElectricity from "./house-electricity";
import PeopleHouse from "./people-house";
import PassRecords from "./pass-records";
import PeopleInfo from "./people-info";
import OnePicture from "./one-picture";
import MapSetting from "./map-setting";
import { API } from "../request/api";
export default {
  name: "main-container",
  data() {
    return {
      styleMap: {
        // 各个组件的定位信息
        latestNews: {},
        alarmOverview: {},
        generalPower: {},
        optionIndex: {},
        houseElectricity: {},
        peopleHouse: {},
        passRecords: {},
        peopleInfo: {},
        MapSetting: {}
      },
      itemMap: new Map(),
      borderWidthRow: "10px", // 行之间border宽度
      borderWidthCol: "10px", // 列之间border宽度
      itemMinWidth: 468,
      itemMinHeight: 316,
      borderColor: "rgba(0, 0, 0, 0)",
      isLogin: false // 是否登录
    };
  },
  mounted() {
    const self = this;
    if (process.env.NODE_ENV === "production") {
      self.init();
      self.isLogin = true;
    } else {
      API.login("_ONSCREEN", "AF21B8C562854").then(
        res => {
          console.log(res);
          self.init();
          self.isLogin = true;
        },
        err => {
          self.init();
          self.isLogin = true;
        }
      );
    }
  },
  methods: {
    init() {
      const self = this;
      const cacheStyle = localStorage.getItem("cacheStyle");
      if (cacheStyle) {
        self.itemMap = new Map(JSON.parse(cacheStyle));
        for (const [key, value] of self.itemMap) {
          self.styleMap[key] = value;
        }
      } else {
        const mainContainer = this.$refs.mainContainer;
        const width = mainContainer.offsetWidth;
        const height = mainContainer.offsetHeight;
        let itemWidth =
          (parseInt(width, 10) - parseInt(self.borderWidthCol, 10) * 3) / 4;
        itemWidth =
          Math.floor(itemWidth) > self.itemMinWidth
            ? Math.floor(itemWidth)
            : self.itemMinWidth;
        let itemHeight =
          (parseInt(height, 10) - parseInt(self.borderWidthRow, 10) * 2) / 3;
        itemHeight =
          Math.floor(itemHeight) > self.itemMinHeight
            ? Math.floor(itemHeight)
            : self.itemMinHeight;

        self.setItemPosition(itemWidth, itemHeight);
      }
    },
    setItemPosition(itemWidth, itemHeight) {
      // 计算每个小模块的位置
      const self = this;
      const item1 = {
        display: "block",
        width: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        height: `${itemHeight + parseInt(self.borderWidthRow, 10)}px`,
        left: 0,
        top: 0,
        borderBottom: `${self.borderWidthRow} solid ${self.borderColor}`,
        borderRight: `${self.borderWidthCol} solid ${self.borderColor}`
      };
      self.styleMap.latestNews = item1;
      self.itemMap.set("latestNews", item1);
      const item2 = {
        display: "block",
        width: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        height: `${itemHeight + parseInt(self.borderWidthRow, 10)}px`,
        left: 0,
        top: `${itemHeight + parseInt(self.borderWidthRow, 10)}px`,
        borderBottom: `${self.borderWidthRow} solid ${self.borderColor}`,
        borderRight: `${self.borderWidthCol} solid ${self.borderColor}`
      };
      self.styleMap.alarmOverview = item2;
      self.itemMap.set("alarmOverview", item2);

      const item3 = {
        display: "block",
        width: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        height: `${itemHeight}px`,
        left: 0,
        top: `${(itemHeight + parseInt(self.borderWidthRow, 10)) * 2}px`,
        borderRight: `${self.borderWidthCol} solid ${self.borderColor}`
      };
      self.styleMap.passRecords = item3;
      self.itemMap.set("passRecords", item3);

      const item4 = {
        display: "block",
        width: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        height: `${itemHeight + parseInt(self.borderWidthRow, 10)}px`,
        left: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        top: `${itemHeight * 2 + parseInt(self.borderWidthRow, 10)}px`,
        borderRight: `${self.borderWidthCol} solid ${self.borderColor}`,
        borderTop: `${self.borderWidthRow} solid ${self.borderColor}`
      };
      self.styleMap.optionIndex = item4;
      self.itemMap.set("optionIndex", item4);

      const item5 = {
        display: "block",
        width: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        height: `${itemHeight + parseInt(self.borderWidthRow, 10)}px`,
        left: `${(itemWidth + parseInt(self.borderWidthCol, 10)) * 2}px`,
        top: `${itemHeight * 2 + parseInt(self.borderWidthRow, 10)}px`,
        borderRight: `${self.borderWidthCol} solid ${self.borderColor}`,
        borderTop: `${self.borderWidthRow} solid ${self.borderColor}`
      };
      self.styleMap.peopleInfo = item5;
      self.itemMap.set("peopleInfo", item5);

      const item6 = {
        display: "block",
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        left: `${(itemWidth + parseInt(self.borderWidthCol, 10)) * 3}px`,
        top: `${(itemHeight + parseInt(self.borderWidthRow, 10)) * 2}px`
      };
      self.styleMap.peopleHouse = item6;
      self.itemMap.set("peopleHouse", item6);

      const item7 = {
        display: "block",
        width: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        height: `${itemHeight + parseInt(self.borderWidthRow, 10)}px`,
        left: `${itemWidth * 3 + parseInt(self.borderWidthCol, 10) * 2}px`,
        top: `${itemHeight + parseInt(self.borderWidthRow, 10)}px`,
        borderBottom: `${self.borderWidthRow} solid ${self.borderColor}`,
        borderLeft: `${self.borderWidthCol} solid ${self.borderColor}`
      };
      self.styleMap.houseElectricity = item7;
      self.itemMap.set("houseElectricity", item7);

      const item8 = {
        display: "block",
        width: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        height: `${itemHeight + parseInt(self.borderWidthRow, 10)}px`,
        left: `${itemWidth * 3 + parseInt(self.borderWidthCol, 10) * 2}px`,
        top: 0,
        borderBottom: `${self.borderWidthRow} solid ${self.borderColor}`,
        borderLeft: `${self.borderWidthCol} solid ${self.borderColor}`
      };
      self.styleMap.generalPower = item8;
      self.itemMap.set("generalPower", item8);

      const item9 = {
        width: `${itemWidth * 2 + parseInt(self.borderWidthCol, 10)}px`,
        height: `40px`,
        left: `${itemWidth + parseInt(self.borderWidthCol, 10)}px`,
        top: 0
      };
      self.styleMap.MapSetting = item9;
      self.itemMap.set("MapSetting", item9);
      localStorage.setItem(
        "cacheStyle",
        JSON.stringify(Array.from(self.itemMap.entries()))
      );
    },
    dropEvent(event, id) {
      // 防止或火狐中拖拽打开新页面
      event.preventDefault(); // 阻止冒泡
      event.stopPropagation(); // 阻止默认行为
      const self = this;
      const _id = event.dataTransfer.getData("id");
      const _style = self.itemMap.get(_id);
      const style = self.itemMap.get(id);
      // 交换拖动源和目标的位置并存储
      self.styleMap[_id] = style;
      self.itemMap.set(_id, style);
      self.styleMap[id] = _style;
      self.itemMap.set(id, _style);
      localStorage.setItem(
        "cacheStyle",
        JSON.stringify(Array.from(self.itemMap.entries()))
      );
    },
    dragStartEvent(event, id) {
      event.dataTransfer.setData("id", id);
    },
    changeItemStatus(event) {
      const self = this;
      event.forEach(item => {
        self.styleMap[item.id]["display"] = item.checked ? "block" : "none";
        self.itemMap.set(item.id, self.styleMap[item.id]);
      });
      localStorage.setItem(
        "cacheStyle",
        JSON.stringify(Array.from(self.itemMap.entries()))
      );
    }
  },
  components: {
    LatestNews,
    AlarmOverview,
    GeneralPower,
    OptionIndex,
    HouseElectricity,
    PassRecords,
    PeopleHouse,
    PeopleInfo,
    OnePicture,
    MapSetting
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
  background: url("../assets/image/icon-bg.jpg");
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
    cursor: pointer;
    .item-box-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
}
</style>
