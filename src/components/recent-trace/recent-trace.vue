<template>
  <div class="panel-container">
    <div class="panel-title">近期行踪</div>
    <el-scrollbar class="panel-content">
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

    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png" />
    </div>
  </div>
</template>
<script>
import { API } from "../../request/api";
export default {
  name: "recent-trace",
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.getRencentTrace();
  },
  methods: {
    close() {
      this.$emit("closeRecentTrace");
    },
    getRencentTrace() {
      const self = this;
      API.getRencentTrace(self.id).then(
        res => {
          self.list = res;
          console.log(self.list);
        },
        err => {}
      );
    }
  },
  watch: {
    id: function(val, oldVal) {
      console.log("new: %s, old: %s", val, oldVal);
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
    padding-top: 10px;
    padding-bottom: 10px;
    ul {
      margin: 0 15px;
      li {
        display: flex;
        font-size: 12px;
        line-height: 30px;
        padding-left: 20px;
        padding-right: 5px;
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
</style>