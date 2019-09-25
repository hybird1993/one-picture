<template>
  <div class="panel-container">
    <div class="panel-title">告警信息</div>
    <el-scrollbar class="panel-content">
      <transition-group
        name="flip-list"
        tag="ul"
        @mousemove.native="mouseOverEvent"
        @mouseout.native="mouseOutEvent"
      >
        <li v-for="(item, index) of list" :key="item.id" @click="showDetail(item)">
          <span class="alarm-index">{{index + 1}}</span>
          <span class="alarm-title">{{item.headline}}</span>
          <span class="alarm-status">{{item.status}}</span>
        </li>
      </transition-group>
    </el-scrollbar>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "alarm-list",
  props: {
    updateTime: {
      type: Number
    },
  },
  data() {
    return {
      list: [],
      timer: null,
      time: 3000
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
          self.timer = setInterval(() => {
            self.loop();
          }, self.time);
        },
        err => {}
      );
    },
    showDetail(item) {
      this.$emit("showAlarmDetail", item);
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
  ul {
    margin: 0 1.25rem;
    li {
      display: flex;
      font-size: 1rem;
      padding: 0.5rem;
      position: relative;
      text-align: left;
      cursor: pointer;
      min-height: 4rem;
      border-bottom: 0.1rem solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        display: inline-block;
        width: 1.75rem;
        margin-right: 1rem;
        padding-top: 0.5rem;
      }
      .alarm-title {
        flex: 1;
        line-height: 1.75rem;
      }
      .alarm-status {
        display: inline-block;
        width: 4rem;
        margin-left: 1rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        border-radius: 0.5rem;
        background-color: red;
      }
    }
  }
}
</style>