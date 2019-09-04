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
        >{{item.title}}</li>
      </transition-group>
    </el-scrollbar>
  </div>
</template>

<script>
import { API } from "../../request/api";
import { setInterval, clearInterval } from "timers";
export default {
  name: "latest-news",
  data() {
    return {
      list: [],
      timer: null,
      time: 2000
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
          console.log(res);
          self.list = res.list;
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
      const item = this.list.shift();
      this.list.push(item);
    },
    mouseOverEvent() {
      const self = this;
      if (self.timer) {
        clearInterval(self.timer);
      }
      console.log(self.timer);
    },
    mouseOutEvent() {
      const self = this;
      if (self.timer) {
        clearInterval(self.timer);
      }
      self.timer = setInterval(() => {
        self.loop();
      }, self.time);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  margin: 0.5rem 0;
  ul {
    margin: 0 1.25rem;
    transition: 1s all;
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
    li:nth-child(odd) {
      background-color: rgba(256, 256, 256, 0.1);
    }
    li:hover {
      background-color: rgba(102, 179, 218, 0.6);
    }
  }
}
</style>