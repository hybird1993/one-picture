<template>
  <div class="panel-container">
    <div class="panel-title">告警信息</div>
    <div class="panel-content">
      <transition-group
        name="flip-list-alarm"
        tag="ul"
        @mousemove.native="mouseOverEvent"
        @mouseout.native="mouseOutEvent"
      >
        <li v-for="item of showList" :key="item.id" @click="showDetail(item)">
          <span class="alarm-index">{{item.index}}</span>
          <span class="alarm-title">{{item.content}}</span>
          <span class="alarm-status" :class="{'status-alarm': !item.isAlreadyDeal}">{{item.status}}</span>
        </li>
      </transition-group>
      
    </div>
    <div v-if="!isFullScreen" class="close-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="close-item">
      <img @click="exitFullScreen" src="../../assets/image/icon-fullscreen-exit.png" />
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "alarm-list",
  props: {
    updateTime: {
      type: Number
    }
  },
  data() {
    return {
      list: [],
      timer: null,
      time: 1000 * 7,
      isFullScreen: false,
      isDataGet: false,
      startIndex: 0,
      step: 4,
      showList: [],
      isMouseOver: false,
    };
  },
  mounted() {
    this.getAlarmList();
  },
  destroyed() {
    const self = this;
    if (self.timer) {
      clearInterval(self.timer);
    }
  },
  methods: {
    getAlarmList() {
      const self = this;
      API.getAlarmList().then(
        res => {
          self.list = res.data;
          self.list.forEach((item, index) => {
            item.index = index + 1;
            item["isAlreadyDeal"] = item.status === "已处理";
          });
          self.isDataGet = true;
          if (self.timer) {
            clearInterval(self.timer);
          }
          this.startIndex = 0;
          self.loop();
        },
        err => {}
      );
    },

    showDetail(item) {
      this.$emit("showAlarmDetail", item);
    },

    loop() {
      const self = this;
      if (self.timer) {
        clearInterval(self.timer);
      }
      self.timer = setInterval(() => {
        self.getShowList();
      }, self.time);
      self.getShowList();
    },

    getShowList() {
      if (this.isMouseOver) {
        return;
      }
      if (this.startIndex > this.list.length) {
        this.startIndex = 0;
      }
      const endIndex = this.startIndex + this.step;
      const arr = this.list.filter((item, index) => {
        return index >= this.startIndex && index < endIndex;
      })
      this.startIndex = endIndex;
      this.showList = arr;
    },

    mouseOverEvent() {
      this.isMouseOver = true;
    },
    mouseOutEvent() {
      this.isMouseOver = false;
    },

    fullScreen() {
      console.log(this)
      this.isFullScreen = true;
      this.$parent.fullScreen("alarmList");
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit("alarmList");
    }
  },
  watch: {
    updateTime: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      if (val) {
        this.getAlarmList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  margin: 0.5rem 0;
  overflow: hidden;
  ul {
    margin: 0 1.25rem;
    li {
      display: flex;
      font-size: 1rem;
      padding: 0.5rem;
      position: relative;
      text-align: left;
      cursor: pointer;
      min-height: 5rem;
      border-bottom: 0.1rem solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        display: inline-block;
        width: 1.75rem;
        margin-right: 1rem;
        padding-top: 0.5rem;
      }
      .alarm-title {
        flex: 1;
        line-height: 1.5rem;
      }
      .alarm-status {
        display: inline-block;
        width: 4rem;
        margin-left: 1rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        border-radius: 0.5rem;
        background-color: #91a22c;
      }
      .status-alarm {
        background-color: red;
      }
    }
  }
  // .flip-list-alarm-move {
  //   transition: transform 2s;
  // }

  .flip-list-alarm-enter-active {
    transition: all 2s;
  }

  .flip-list-alarm-leave-active {
    transition: all 1s;
  }

  .flip-list-alarm-leave {
    opacity: 1;
    visibility: visible;
  }

  .flip-list-alarm-enter-to {
    transition-delay: 1s;
    visibility: visible;
    opacity: 1;
  }

  .flip-list-alarm-leave-to {
    visibility: hidden;
    opacity: 0;
  }

  .flip-list-alarm-enter {
    visibility: hidden;
    opacity: 0;
   }
}

</style>