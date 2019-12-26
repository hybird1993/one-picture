<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">近期行踪</div>
    <div class="panel-content">
      <div class="trace-title">
        <div class="people-name">{{prop.name}}</div>
        <div class="date">
          <span @click="preDay">&lt;</span>
          {{date}}
          <span @click="nextDay">&gt;</span>
        </div>
        <button @click="showRecentTrace">显示轨迹</button>
        <button @click="hideRecentTrace">隐藏轨迹</button>
      </div>
      <el-scrollbar class="trace-content">
        <ul>
          <li>
            <span class="item-number">流水号</span>
            <span class="item-trace">踪迹</span>
          </li>
          <li v-for="(item, index) of list" :key="index">
            <span class="item-number">{{item.alarmTime}}</span>
            <span class="item-trace">{{item.alarmLocationName}}</span>
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <div v-if="!isFullScreen" class="fullscreen-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="fullscreen-item">
      <img @click="exitFullScreen" src="../../assets/image/icon-fullscreen-exit.png" />
    </div>
    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png" />
    </div>
  </div>
</template>
<script>
import { API } from "../../request/api";
import { TimeUtil } from "../../utils/time-util";
export default {
  name: "recent-trace",
  props: {
    prop: {
      type: Object,
      default: {
        id: null,
        name: "",
        time: undefined
      }
    },
    peopleName: {
      type: String
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      date: null,
      list: [],
      isFullScreen: false,
      dateArr: [],
      allData: []
    };
  },
  mounted() {
    // const nowDate = new Date();
    // this.date = new Date(
    //   nowDate.getFullYear(),
    //   nowDate.getUTCMonth(),
    //   nowDate.getDate()
    // );
    this.getRecentMonthTrace();
  },
  methods: {
    showRecentTrace() {
      if (this.isFullScreen) {
        this.exitFullScreen();
      }
      this.$parent.eventListener({
        type: "showRecentTrace",
        data: this.list.map(item => {
          // item.status = '未处理';
          return item;
        })
      });
    },

    hideRecentTrace() {
      this.$parent.eventListener({
        type: "hideRecentTrace"
      });
    },

    /**
     * param {date | number} date  时间或是时间戳
     */
    formatDay(date) {
      return TimeUtil.formatDate(new Date(date), "yyyy-MM-dd");
    },

    // 获取最近一个月行踪
    getRecentMonthTrace() {
      const self = this;
      self.date = TimeUtil.formatDate(new Date(this.prop.time), "yyyy-MM-dd");
      const timestamp = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;
      const startDate = self.formatDay(timestamp) + " 00:00:00";
      const endDate = TimeUtil.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      API.getRencentTrace(self.prop.id, startDate, endDate).then(
        res => {
          self.dateArr = [];
          self.allData = res;
          self.allData.forEach(item => {
            item.alarmLocationName = item.alarmLocation.split("/")[0];
            item.alarmDay = self.formatDay(new Date(item.alarmTime));
            if (!this.dateArr.includes(item.alarmDay)) {
              self.dateArr.push(item.alarmDay);
            }
          });
          self.dateArr.sort((pre, next) => {
            return new Date(pre) - new Date(next);
          })
          console.log(self.dateArr);
          self.showDayData();
        },
        err => {}
      );
    },
    
    /**
     * 显示某一天的行踪数据
     */
    showDayData() {
      const list = this.allData.filter(item => {
        return item.alarmDay === this.date;
      }).sort((pre, next) => {
        return new Date(pre.alarmTime) - new Date(next.alarmTime);
      })
      this.list = list;
    },

    getRencentTrace() {
      const self = this;
      if (!self.date) {
        return;
      }
      const timestamp = self.date.getTime() + 24 * 60 * 60 * 1000;
      const date = TimeUtil.formatDate(self.date, "yyyy-MM-dd hh:mm:ss");
      const endDate = TimeUtil.formatDate(
        new Date(timestamp),
        "yyyy-MM-dd hh:mm:ss"
      );
      API.getRencentTrace(self.prop.id, date, endDate).then(
        res => {
          self.list = res;
          self.list.forEach(item => {
            item.alarmLocationName = item.alarmLocation.split("/")[0];
          });
          // console.log(self.list);
        },
        err => {}
      );
    },

    showSideDay(count) {
      const index = this.dateArr.findIndex(item => item === this.date);
      const newIndex = index + count;
      if (newIndex < 0 || newIndex >= this.dateArr.length) {
        return;
      }
      this.date = this.dateArr[newIndex];
      this.showDayData();
    },

    preDay() {
      // const timestamp = this.date.getTime() - 24 * 60 * 60 * 1000;
      // this.date = new Date(timestamp);
      // this.getRencentTrace();
      this.showSideDay(-1);
    },

    nextDay() {
      // const timestamp = this.date.getTime() + 24 * 60 * 60 * 1000;
      // this.date = new Date(timestamp);
      // this.getRencentTrace();
      this.showSideDay(1);
    },

    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.eventListener({
        type: "fullScreen",
        id: this.componentId
      });
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.eventListener({
        type: "fullScreenExit",
        id: this.componentId
      });
    }
  },
  watch: {
    prop: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      // this.getRencentTrace();
      this.getRecentMonthTrace();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  background-image: url("../../assets/image/detail-bg.png");
  background-size: 100% 100%;
  .panel-content {
    z-index: 1;
    padding-top: 6px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .trace-title {
      display: flex;
      padding: 0 24px;
      height: 36px;
      align-items: center;
      .people-name {
        flex: 1;
        text-align: left;
      }
      .date {
        color: #49a9ee;
        margin-left: 12px;
        margin-right: 24px;
        span {
          cursor: pointer;
          margin: 0 6px;
        }
      }
      button {
        font-size: 12px;
        margin-left: 12px;
        padding: 1px 6px;
      }
    }
    .trace-content {
      flex: 1;
      height: calc(100% - 72px);
      padding-bottom: 12px;
      ul {
        margin: 0 15px;
        li {
          display: flex;
          line-height: 30px;
          padding-left: 24px;
          padding-right: 6px;
          position: relative;
          text-align: left;
          // cursor: pointer;
          .item-number {
            width: 40%;
          }
          .item-trace {
            width: 60%;
          }
        }
        li:nth-child(odd) {
          background-color: rgba(256, 256, 256, 0.1);
        }
      }
    }
  }
}
.panel-container-fullscreen {
  .panel-content {
    padding-top: 18px;
    .trace-title {
      padding: 0 72px;
      height: 108px;
      .date {
        margin-left: 36px;
        margin-right: 72px;
        span {
          margin: 0 18px;
        }
      }
      button {
        font-size: 36px;
        margin-left: 36px;
        padding: 3px 18px;
      }
    }
    .trace-content {
      height: calc(100% - 216px);
      padding-bottom: 36px;
      ul {
        margin: 0 45px;
        li {
          line-height: 90px;
          padding-left: 72px;
          padding-right: 18px;
        }
      }
    }
  }
}
</style>