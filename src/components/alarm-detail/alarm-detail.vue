<template>
  <div class="panel-container">
    <div class="panel-title">告警详情</div>
    <el-scrollbar class="panel-content">
      <ul>
        <li>
          <span class="item-title">发生时间：</span>
          <span class="item.content">{{detail.alarmTime}}</span>
        </li>
        <li>
          <span class="item-title">发生位置：</span>
          <span class="item.content">{{detail.alarmLocation}}</span>
        </li>
        <li>
          <span class="item-title">摄像头编号：</span>
          <span class="item.content">{{detail.deviceId}}</span>
        </li>
        <li>
          <span class="item-title">告警状态：</span>
          <span class="item.content" style="color:red;">{{detail.status}}</span>
        </li>
        <li>
          <span class="item-title">告警分类：</span>
          <span class="item.content">{{detail.alarmType}}</span>
        </li>
        <li>
          <span class="item-title">二级分类：</span>
          <span class="item.content">{{detail.alarmDesc}}</span>
        </li>
        <li>
          <span class="item-title">告警内容：</span>
          <span class="item.content">{{detail.content}}</span>
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
  name: "alarm-detail",
  props: ["id"],
  data() {
    return {
      detail: {}
    };
  },
  mounted() {
    const self = this;
    this.getAlarmDetail();
  },
  methods: {
    close() {
      this.$emit("closeAlarmDetail");
    },
    getAlarmDetail() {
      const self = this;
      API.getAlarmDetail(this.id).then(
        res => {
          self.detail = res;
        },
        err => {}
      );
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
    padding-top: 20px;
    padding-bottom: 20px;
    ul {
      margin: 0 15px;
      li {
        font-size: 12px;
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        padding-right: 5px;
        position: relative;
        text-align: left;
        cursor: pointer;
        .item-title {
          display: inline-block;
          width: 100px;
          text-align: left;
        }
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
      li:nth-child(odd) {
        background-color: rgba(256, 256, 256, 0.1);
      }
      li:hover {
        background-color: rgba(102, 179, 218, 0.6);
      }
    }
  }
}
</style>