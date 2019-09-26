<template>
  <div class="panel-container">
    <div class="panel-title">特殊人群</div>
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
          <span class="alarm-status" :class="{'status-alarm': !item.isAlreadyDeal}">{{item.status}}</span>
        </li>
      </transition-group>
    </el-scrollbar>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "special-people",
  data() {
    return {
      list: [],
      timer: null,
      time: 3000
    };
  },
  mounted() {
    this.getSpecialPeopleList();
  },
  destroyed() {
    const self = this;
    if (self.timer) {
      clearInterval(self.timer);
    }
  },
  methods: {
    getSpecialPeopleList() {
      const self = this;
      API.getSpecialPeopleList().then(
        res => {
          // console.log(res);
          self.list = res.data;
          self.list.forEach(item => {
            item['isAlreadyDeal'] = item.status === '已处理';
          });
          self.timer = setInterval(() => {
            self.loop();
          }, self.time);
        },
        err => {}
      );
    },
    showDetail(item) {
      this.$emit("showSpecialPeople", item);
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
      // console.log(self.timer);
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
        background-color: #91a22c;
      }
      .status-alarm {
        background-color:red;
      }
    }
  }
}
</style>