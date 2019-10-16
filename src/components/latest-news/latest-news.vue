<template>
  <div class="panel-container">
    <div class="panel-title">最新资讯</div>
    <el-scrollbar class="panel-content">
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
          :class="{'li-odd': item.isOdd}"
        >{{item.title}}</li>
      </transition-group>
    </el-scrollbar>
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
          });
          self.timer = setInterval(() => {
            self.loop();
          }, self.time);
        },
        err => {}
      );
    },
    showDetail(item) {
      this.$emit("showNewsDetail", item);
    },
    loop() {
      const self = this;
      const item = self.list.shift();
      setTimeout(() => {
        self.list.push(item);
      }, 1000);
    },
    mouseOverEvent() {
      const self = this;
      if (self.timer) {
        clearInterval(self.timer);
      }
    },
    mouseOutEvent() {
      const self = this;
      if (self.timer) {
        clearInterval(self.timer);
      }
      self.timer = setInterval(() => {
        self.loop();
      }, self.time);
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
.panel-content {
  margin: 0.5rem 0;
  ul {
    margin: 0 1.25rem;
    li {
      height: 2.5rem;
      line-height: 2.5rem;
      padding-left: 1.75rem;
      padding-right: 0.5rem;
      position: relative;
      text-align: left;
      cursor: pointer;
    }
    li:before {
      content: "";
      position: absolute;
      top: 50%;
      margin-top: -0.25rem;
      height: 0.5rem;
      width: 0.5rem;
      margin-left: -1.25rem;
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
  }
}
</style>