<template>
  <div class="panel-container">
    <div class="panel-title">告警详情</div>
    <el-scrollbar class="panel-content">
      <ul>
        <li>
          <span class="item-title">发生时间：</span>
          <span class="item-content">{{detail.alarmTime}}</span>
        </li>
        <li>
          <span class="item-title">发生位置：</span>
          <span class="item-content">{{detail.alarmLocation}}</span>
        </li>
        <li>
          <span class="item-title">摄像头编号：</span>
          <span class="item-content">{{detail.deviceId}}</span>
        </li>
        <li>
          <span class="item-title">告警状态：</span>
          <span class="item-content alarm-status" @click="dealAlarm">{{detail.status}}</span>
        </li>
        <li>
          <span class="item-title">告警分类：</span>
          <span class="item-content">{{detail.alarmType}}</span>
        </li>
        <li>
          <span class="item-title">二级分类：</span>
          <span class="item-content">{{detail.alarmDesc}}</span>
        </li>
        <li>
          <span class="item-title">告警内容：</span>
          <span class="item-content">{{detail.content}}</span>
        </li>
        <li>
          <span class="item-title">告警人员：</span>
          <span class="item-content">{{detail.relationPerson}}</span>
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
  props: {
    prop: {
      type: Number,
    },
    componentId: {
      type: String,
    }
  },
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
      this.$parent.eventListener({
        type: 'close',
        id: this.componentId
      });
    },
    getAlarmDetail() {
      const self = this;
      API.getAlarmDetail(self.prop).then(
        res => {
          self.detail = res;
        },
        err => {}
      );
    },
    dealAlarm() {
      // auth-token实际也可不传
      this.$parent.eventListener({
        type: 'alarmDeal',
        url: `${process.env.VUE_APP_API}/s/routine/workPc.html?alertId=${this.prop}`
      });

    },
  },
  watch: {
    prop: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.getAlarmDetail();
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
    padding-top: 1rem;
    padding-bottom: 1rem;
    ul {
      margin: 0 1.25rem;
      li {
        display: flex;
        line-height: 2.5rem;
        padding-left: 2rem;
        padding-right: .5rem;
        position: relative;
        text-align: left;
        // cursor: pointer;
        .item-title {
          display: inline-block;
          min-width: 7.5rem;
          text-align: left;
        }
        .item-content {
          word-break: break-all;
        }
        .alarm-status {
          color:red;
          cursor: pointer;
        }
      }
      li:nth-child(odd) {
        background-color: rgba(256, 256, 256, 0.1);
      }
    }
  }
}
</style>