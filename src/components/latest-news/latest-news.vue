<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">最新资讯</div>
    <div class="panel-content">
      <transition-group
        name="flip-list"
        tag="ul"
        @mousemove.native="mouseOverEvent"
        @mouseout.native="mouseOutEvent"
      >
        <li
          v-for="item of list"
          class="over-hide"
          :key="item.newsId"
          @click="showDetail(item)"
          :title="item.title"
          :class="{'li-odd': item.isOdd, 'li-last': item.isLast}"
        >{{item.title}}</li>
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
import { setInterval, clearInterval, setTimeout } from "timers";
export default {
  name: "latest-news",
  data() {
    return {
      list: [],
      timer: null,
      time: 3000,
      isFullScreen: false,
      isMouseOver: false,
    };
  },
  mounted() {
    this.getLatestNews();
  },
  destroyed() {
    const self = this;
    if (self.timer) {
      clearInterval(self.timer);
    }
  },
  methods: {
    getLatestNews() {
      const self = this;
      API.getLatestNews().then(
        res => {
          self.list = res.list;
          self.list.forEach((item, index) => {
            item.isOdd = index % 2;
            item.isLast = index === (self.list.length - 1);
          });
          self.loop();
        },
        err => {}
      );
    },
    showDetail(item) {
      this.$emit("showNewsDetail", item);
    },
    loop() {
      const self = this;
      if (self.timer) {
        clearInterval(self.timer);
      }
      self.timer = setInterval(() => {
        self.showList();
      }, self.time);
      self.showList();
    },

    showList() {
      const self = this;
      if (this.isMouseOver) {
        return;
      }
      const item = self.list.shift();
      setTimeout(() => {
         self.list.push(item);
      }, 1000)
    },

    mouseOverEvent() {
      this.isMouseOver = true;
    },
    mouseOutEvent() {
      this.isMouseOver = false;
    },
        
    fullScreen() {
      this.isFullScreen = true;
      this.$parent.fullScreen( 'latestNews');
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit( 'latestNews');
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  .panel-content {
    margin: 6px 0;
    overflow: hidden;
    ul {
      margin: 0 15px;
      li {
        height: 30px;
        line-height: 30px;
        padding-left: 21px;
        padding-right: 6px;
        position: relative;
        text-align: left;
        cursor: pointer;
      }
      li:before {
        content: "";
        position: absolute;
        top: 50%;
        margin-top: -3px;
        height: 6px;
        width: 6px;
        margin-left: -15px;
        display: block;
        border-radius: 50%;
        background: #01a5db;
      }
      .li-odd {
        background-color: rgba(256, 256, 256, 0.1);
      }
      li:hover {
        background-color: rgba(102, 179, 218, 0.6);
      }
      .li-last {
        margin-bottom: 24px;
      }
    }
  }
}

.panel-container-fullscreen {
  font-size: 36px;
  .panel-content {
    margin: 12px 0;
    ul {
      margin: 0 45px;
      li {
        height: 90px;
        line-height: 90px;
        padding-left: 63px;
        padding-right: 18px;
      }
      li:before {
        top: 50%;
        margin-top: -9px;
        height: 18px;
        width: 18px;
        margin-left: -45px;
        border-radius: 50%;
      }
      .li-last {
        margin-bottom: 72px;
      }
    }
  }
}

</style>