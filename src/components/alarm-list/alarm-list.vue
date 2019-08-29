<template>
  <div class="panel-container">
    <div class="panel-title">告警信息</div>
    <el-scrollbar class="panel-content">
      <ul>
        <li v-for="(item, index) of list" :key="item.id"  @click="showDetail(item)">
          <span class="alarm-index">{{index + 1}}</span>
          <span class="alarm-title">{{item.headline}}</span>
          <span class="alarm-status">{{item.status}}</span>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "alarm-list",
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.getAlarmList();
  },
  methods: {
    getAlarmList() {
      const self = this;
      API.getAlarmList().then(
        res => {
          console.log(res);
          self.list = res.data;
        },
        err => {}
      );
    },
    showDetail(item) {
      this.$emit('showAlarmDetail', item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  margin: 5px 0;
  ul {
    margin: 0 15px;
    li {
      display: flex;
      font-size: 12px;
      padding: 5px;
      position: relative;
      text-align: left;
      cursor: pointer;
      min-height: 48px;
      border-bottom: 1px solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        display: inline-block;
        width: 20px;
        margin-right: 10px;
      }
      .alarm-title {
        flex: 1;
            line-height: 20px;
      }
      .alarm-status {
        display: inline-block;
        width: 48px;
        margin-left: 10px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 5px;
        background-color: red;
      }
    }
  }
}
</style>