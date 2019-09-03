<template>
  <div class="main-container" ref="mainContainer">
    <div id="themeContainer" style="width: 100%;height: 100%;"></div>
    <div v-for="item of defalutItemList" :key="item">
      <div
        v-if="styleMap[item].isShow || isDrag"
        class="item-box"
        :style="styleMap[item].style"
        :class="{'drag-outline': isDrag, 'dragover-oulline': dragOverItem === item}"
        draggable="true"
        @drop="dropEvent($event, item)"
        @dragover.prevent="dragOverEvent($event, item)"
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
            <AlarmList @showAlarmDetail="showAlarmDetail"></AlarmList>
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

    <!-- 新闻详情 -->
    <div v-if="isShowNewsDetail" class="item-box-header high-index" :style="styleMap.centerItem">
      <img class="item-box-bg" src="../assets/image/icon-box-center.png" />
      <NewsDetail :detail="newsDetail" @closeNewsDetail="closeNewsDetail"></NewsDetail>
    </div>

    <!-- 告警详情 -->
    <div v-if="isShowAlarmDetail" class="item-box-header high-index" :style="styleMap.alarmDetail">
      <img class="item-box-bg" src="../assets/image/icon-box.png" />
      <AlarmDetail :id="alarmId" @closeAlarmDetail="closeAlarmDetail"></AlarmDetail>
    </div>

    <!-- 特殊人口告警详情 -->
    <div
      v-if="isShowPeopleAlarmDetail"
      class="item-box-header high-index"
      :style="styleMap.peopleAlarmDetail"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" />
      <AlarmDetail :id="peopleAlarmId" @closeAlarmDetail="closePeopleAlarmDetail"></AlarmDetail>
    </div>

    <!-- 人员详情 -->
    <div
      v-if="isShowPeopleDetail"
      class="item-box-header high-index"
      :style="styleMap.peopleDetail"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" />
      <PeopleDetail :id="idNo" @closePeopleDetail="closePeopleDetail"></PeopleDetail>
    </div>

    <!-- 人员列表 -->
    <div v-if="isShowPeopleList" class="item-box-header high-index" :style="styleMap.peopleList">
      <img class="item-box-bg" src="../assets/image/icon-box.png" />
      <PeopleList :people-type="peopleType" from-item="people" @closePeopleList="closePeopleList"></PeopleList>
    </div>

    <!-- 综治力量人员列表 -->
    <div
      v-if="isShowGeneralPowerList"
      class="item-box-header high-index"
      :style="styleMap.generalPowerList"
    >
      <img class="item-box-bg" src="../assets/image/icon-box.png" />
      <PeopleList
        :people-type="generalPowerType"
        :people-list="generalPowerList"
        from-item="generalPower"
        @closePeopleList="closeGeneralPowerList"
      ></PeopleList>
    </div>

    <!-- 人员行踪 -->
    <div v-if="isShowRecentTrace" class="item-box-header high-index" :style="styleMap.recentTrace">
      <img class="item-box-bg" src="../assets/image/icon-box.png" />
      <RecentTrace :id="peopleId" :people-name="peopleName" @closeRecentTrace="closeRecentTrace"></RecentTrace>
    </div>

    <!-- 地图设置 -->
    <div class="item-box-header" :style="styleMap.MapSetting">
      <img class="item-box-bg" src="../assets/image/icon-box-header.png" />
      <MapSetting item-map="itemMap" @changeItemStatus="changeItemStatus"></MapSetting>
    </div>

    <!-- 通行记录 -->
    <!-- <div
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
    </div>-->

    <!-- 人口信息 -->
    <!-- <div
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
    </div>-->

    <!-- 房屋用电情况 -->
    <!-- <div
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
    </div>-->

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
import AlarmList from "./alarm-list";
import SpecialPeople from "./special-people";
import GlobalIndex from "./global-index";
import NewsDetail from "./news-detail";
import AlarmDetail from "./alarm-detail";
import PeopleDetail from "./people-detail";
import PeopleList from "./people-list";
import RecentTrace from "./recent-trace";
import { API } from "../request/api";
export default {
  name: "main-container",
  data() {
    return {
      defalutItemList: [
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
        MapSetting: {},
        centerItem: {},
        alarmDetail: {},
        peopleDetail: {},
        peopleList: {},
        generalPowerList: {},
        recentTrace: {},
        peopleAlarmDetail: {},
        video: {}
      },
      dict: {},
      cacheStyle: {}, // 缓存的位置信息
      itemMap: new Map(), // 小模块位置
      itemMarginRow: "10px", // 行之间间距
      itemMarginCol: "10px", // 列之间间距
      itemMinWidth: 468, // item最小宽度
      itemMinHeight: 316, // item最小高度
      borderColor: "rgba(0, 0, 0, 0)",
      isLogin: false, // 是否登录
      isDrag: false, // 是否在拖拽
      dragOverItem: "", // 正拖拽经过的item
      isShowNewsDetail: false, // 是否显示新闻详情
      newsDetail: null, // 新闻详情
      isShowAlarmDetail: false, // 是否显示告警详情
      alarmId: null, // 告警id
      isShowPeopleDetail: false, // 是否显示人员详情
      idNo: null, // 身份证id
      isShowPeopleList: false, // 是否显示人员列表
      peopleType: null, // 人员类型
      isShowGeneralPowerList: false, // 是否显示综治力量的人员列表
      generalPowerType: null, // 人员类型
      generalPowerList: [], // 人员列表
      isShowRecentTrace: false, // 是否显示综治力量的人员列表
      peopleId: null, // 人员id
      isShowPeopleAlarmDetail: false, // 是否显示人员告警详情
      peopleAlarmId: null, // 人员告警详情
      peopleName: "" // 人员名称
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
    self.getDict();
  },
  methods: {
    init() {
      const self = this;
      const mainContainer = this.$refs.mainContainer;
      const width = mainContainer.offsetWidth;
      if (width >= 1920) {
        document.getElementsByTagName('html')[0].style.fontSize = Math.round(12 * (width / 1920)) + 'px';
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
    setItemPosition(itemWidth, itemHeight) {
      // 计算每个小模块的位置
      //    item1    item9     item8
      //    item2              item7
      //    item3  item4 item5 item6
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
      self.styleMap.centerItem = self.itemMap.get(9);
      self.cacheItems();
    },
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
    getDict() {
      const self = this;
      API.getDict().then(
        res => {
          self.dict = res;
        },
        err => {}
      );
    },
    showNewsDetail(event) {
      this.newsDetail = event;
      this.isShowNewsDetail = true;
    },
    closeNewsDetail() {
      this.isShowNewsDetail = false;
    },
    showAlarmDetail(event) {
      let index = parseInt(this.cacheStyle["alarmList"]["position"], 10) + 1;
      let style1 = index > 8 ? 1 : index;
      this.styleMap.alarmDetail = this.itemMap.get(style1);
      this.alarmId = event.id;
      this.isShowAlarmDetail = true;
      if (event.identityCard) {
        this.idNo = event.identityCard;
        style1++;
        const style2 = style1 > 8 ? 1 : style1;
        this.styleMap.peopleDetail = this.itemMap.get(style2);
        this.isShowPeopleDetail = true;
      }
    },
    closeAlarmDetail() {
      this.isShowAlarmDetail = false;
    },
    closePeopleDetail() {
      this.isShowPeopleDetail = false;
    },
    showPeopleList(event) {
      this.peopleType = event;
      let index = parseInt(this.cacheStyle["peopleHouse"]["position"], 10) + 1;
      const style = index > 8 ? 1 : index;
      this.styleMap.peopleList = this.itemMap.get(style);
      this.isShowPeopleList = true;
    },
    closePeopleList() {
      this.isShowPeopleList = false;
    },
    showGeneralPowerList(event) {
      this.generalPowerType = event.type;
      this.generalPowerList = event.list;
      let index = parseInt(this.cacheStyle["generalPower"]["position"], 10) + 1;
      const style = index > 8 ? 1 : index;
      this.styleMap.generalPowerList = this.itemMap.get(style);
      this.isShowGeneralPowerList = true;
    },
    closeGeneralPowerList() {
      this.isShowGeneralPowerList = false;
    },
    showSpecialPeople(event) {
      let index =
        parseInt(this.cacheStyle["specialPeople"]["position"], 10) + 1;
      let style1 = index > 8 ? 1 : index;
      this.styleMap.peopleAlarmDetail = this.itemMap.get(style1);
      this.peopleAlarmId = event.id;
      this.peopleName = event.relationPerson;
      this.isShowPeopleAlarmDetail = true;
      if (event.identityCard) {
        this.peopleId = event.identityCard;
        style1++;
        const style2 = style1 > 8 ? 1 : style1;
        this.styleMap.recentTrace = this.itemMap.get(style2);
        this.isShowRecentTrace = true;
      }
    },
    closeRecentTrace() {
      this.isShowRecentTrace = false;
    },
    closePeopleAlarmDetail() {
      this.isShowPeopleAlarmDetail = false;
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
    MapSetting,
    AlarmList,
    SpecialPeople,
    GlobalIndex,
    NewsDetail,
    AlarmDetail,
    PeopleDetail,
    PeopleList,
    RecentTrace
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
    border: .25rem dotted white !important;
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
      box-shadow: 0 0 .5rem rgba(0, 255, 0, 0.2),
        inset 0 0 .5rem rgba(0, 255, 0, 0.1), 0 .2rem 0 #393;
    }
    100% {
      border-color: #6f6;
      box-shadow: 0 0 2rem rgba(0, 255, 0, 0.6),
        inset 0 0 1rem rgba(0, 255, 0, 0.4), 0 .2rem 0 #6f6;
    }
  }
}
</style>
