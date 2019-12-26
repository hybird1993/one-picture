<template>
  <div
    class="panel-container"
    :class="{ 'panel-container-fullscreen': isFullScreen }"
  >
    <div class="panel-title">告警信息</div>
    <div class="panel-content">
      <transition-group
        name="flip-list-alarm"
        tag="ul"
        style="height: 100%;"
        @mousemove.native="mouseOverEvent"
        @mouseout.native="mouseOutEvent"
        @mousewheel.native="mouseWheelEvent"
      >
        <li
          v-for="item of showList"
          :key="item.id"
          :title="item.content"
          @click="showDetail(item)"
        >
          <span class="alarm-index">{{ item.index }}</span>
          <span class="alarm-title">{{ item.content }}</span>
          <span
            class="alarm-status"
            :class="{ 'status-alarm': !item.isAlreadyDeal }"
            >{{ item.status }}</span
          >
        </li>
      </transition-group>
    </div>
    <div v-if="!isFullScreen" class="close-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="close-item">
      <img
        @click="exitFullScreen"
        src="../../assets/image/icon-fullscreen-exit.png"
      />
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
import { LOOP_TIME } from "../../config/config";
export default {
  name: "alarm-list",
  data() {
    return {
      list: [],
      timer: null,
      loopTimer: null,
      time: 1000 * 7,
      isFullScreen: false,
      isDataGet: false,
      startIndex: 0,
      step: 4,
      showList: [],
      isMouseOver: false,
      timestamp: null
    };
  },
  mounted() {
    this.getAlarmList(true);
  },
  destroyed() {
    const self = this;
    if (self.timer) {
      clearInterval(self.timer);
    }
    if (self.loopTimer) {
      clearTimeout(self.loopTimer);
    }
  },
  methods: {
    getAlarmList(isLoop = false) {
      const self = this;
      API.getAlarmList().then(
        res => {
          self.list = res.data;
          self.list.forEach((item, index) => {
            item.index = index + 1;
            item["isAlreadyDeal"] = item.status === "已处理";
          });
          self.isDataGet = true;
          if (isLoop) {
            if (self.timer) {
              clearInterval(self.timer);
            }
            self.startIndex = 0;
            self.loop();
          }
          self.loopTimer = setTimeout(() => {
            self.getAlarmList();
          }, LOOP_TIME);
        },
        err => {
          self.loopTimer = setTimeout(() => {
            self.getAlarmList();
          }, LOOP_TIME);
        }
      );
    },

    showDetail(item) {
      if (this.isFullScreen) {
        this.exitFullScreen();
      }
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
      if (this.timestamp && new Date().getTime() - this.timestamp < this.time) {
        return;
      }
      if (this.startIndex > this.list.length) {
        this.startIndex = 0;
      }
      const endIndex = this.startIndex + this.step;
      const arr = this.list.filter((item, index) => {
        return index >= this.startIndex && index < endIndex;
      });
      this.startIndex = endIndex;
      this.showList = arr;
    },

    mouseOverEvent() {
      this.isMouseOver = true;
    },
    mouseOutEvent() {
      this.isMouseOver = false;
    },

    mouseWheelEvent(e) {
      e = e || window.event;
      console.log(e);
      if (e.wheelDelta) {
        //判断浏览器IE，谷歌滑轮事件
        if (e.wheelDelta > 0) {
          //当滑轮向上滚动时
          // alert("滑轮向上滚动");
          this.prePage();
        }
        if (e.wheelDelta < 0) {
          //当滑轮向下滚动时
          // alert("滑轮向下滚动");
          this.nextPage();
        }
      } else if (e.detail) {
        //Firefox滑轮事件
        if (e.detail > 0) {
          //当滑轮向上滚动时
          // alert("滑轮向上滚动");
          this.prePage();
        }
        if (e.detail < 0) {
          //当滑轮向下滚动时
          // alert("滑轮向下滚动");
          this.nextPage();
        }
      }
    },

    prePage() {
      if (this.startIndex <= 0) {
        return;
      }
      const endIndex = this.startIndex;
      this.startIndex = this.startIndex - this.step;
      const arr = this.list.filter((item, index) => {
        return index >= this.startIndex && index < endIndex;
      });
      this.showList = arr;
      this.isMouseOver = true;
    },

    nextPage() {
      if (this.startIndex >= this.list.length) {
        return;
      }
      const endIndex = this.startIndex + this.step;
      const arr = this.list.filter((item, index) => {
        return index >= this.startIndex && index < endIndex;
      });
      if (endIndex <= this.list.length) {
        this.startIndex = endIndex;
      }
      this.showList = arr;
      this.isMouseOver = true;
    },

    fullScreen() {
      // console.log(this)
      const self = this;
      self.timestamp = new Date().getTime();
      self.isFullScreen = true;
      self.$parent.fullScreen("alarmList");
    },

    exitFullScreen() {
      const self = this;
      self.timestamp = new Date().getTime();
      self.isFullScreen = false;
      self.$parent.fullScreenExit("alarmList");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  overflow: hidden;
  ul {
    margin: 0 15px;
    li {
      display: flex;
      font-size: 12px;
      padding: 6px;
      position: relative;
      text-align: left;
      cursor: pointer;
      min-height: 60px;
      border-bottom: 1px solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        display: inline-block;
        width: 21px;
        margin-right: 12px;
        padding-top: 6px;
      }
      .alarm-title {
        flex: 1;
        // line-height: 1.5rem;
        line-height: 18px;
      }
      .alarm-status {
        display: inline-block;
        width: 48px;
        margin-left: 12px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 6px;
        background-color: #23ffb4;
      }
      .status-alarm {
        background-color: #05758f;
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

.panel-container-fullscreen {
  ul {
    margin: 0 45px;
    li {
      font-size: 36px;
      padding: 18px;
      min-height: 180px;
      border-bottom: 3px solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        width: 63px;
        margin-right: 36px;
        padding-top: 18px;
      }
      .alarm-title {
        line-height: 54px;
      }
      .alarm-status {
        width: 144px;
        margin-left: 36px;
        height: 72px;
        line-height: 72px;
        border-radius: 18px;
      }
    }
  }
}
</style>
