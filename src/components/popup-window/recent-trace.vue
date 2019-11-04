<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">近期行踪</div>
    <div class="panel-content">
      <div class="trace-title">
        <div class="people-name">{{prop.name}}</div>
        <div class="date">
          <span @click="preDay">&lt;</span>
          {{showDate}}
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
            <span class="item-trace">{{item.alarmLocation}}</span>
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
        name: ''
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
    };
  },
  computed: {
    showDate: function() {
      return this.date ? TimeUtil.formatDate(this.date, "yyyy-MM-dd") : "";
    }
  },
  mounted() {
    const nowDate = new Date();
    this.date = new Date(
      nowDate.getFullYear(),
      nowDate.getUTCMonth(),
      nowDate.getDate()
    );
    this.getRencentTrace();
  },
  methods: {
    showRecentTrace() {
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
        type: "hideRecentTrace",
      });
    },

    getRencentTrace() {
      const self = this;
      if (!self.date) {
        return;
      }
      const date = TimeUtil.formatDate(self.date, "yyyy-MM-dd hh:mm:ss");
      API.getRencentTrace(self.prop.id, date).then(
        res => {
          self.list = res;
          // console.log(self.list);
        },
        err => {}
      );
    },

    preDay() {
      const timestamp = this.date.getTime() - 24 * 60 * 60 * 1000;
      this.date = new Date(timestamp);
      this.getRencentTrace();
    },

    nextDay() {
      const timestamp = this.date.getTime() + 24 * 60 * 60 * 1000;
      this.date = new Date(timestamp);
      this.getRencentTrace();
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
        type: 'fullScreen',
        id: this.componentId
      });
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
       this.$parent.eventListener({
        type: 'fullScreenExit',
        id: this.componentId
      });
    },
  },
  watch: {
    prop: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.getRencentTrace();
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
            width: 30%;
          }
          .item-trace {
            width: 70%;
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