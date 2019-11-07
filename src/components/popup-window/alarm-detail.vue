<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
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
            <span
              class="item-content alarm-status"
              :class="{'status-alarm': !detail.isAlreadyDeal}"
              @click="dealAlarm"
            >{{detail.status}}</span>
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

    <div v-if="!isFullScreen" class="fullscreen-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="fullscreen-item">
      <img @click="exitFullScreen" src="../../assets/image/icon-fullscreen-exit.png" />
    </div>
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
      type: Number
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      detail: {},
      isFullScreen: false
    };
  },
  mounted() {
    const self = this;
    this.getAlarmDetail();
  },
  methods: {
    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },
    getAlarmDetail() {
      const self = this;
      API.getAlarmDetail(self.prop).then(
        res => {
          self.detail = res;
          self.detail["isAlreadyDeal"] = self.detail.status === "已处理";
        },
        err => {}
      );
    },
    dealAlarm() {
      if (this.detail["isAlreadyDeal"]) {
        return;
      }
      // auth-token实际也可不传
      this.$parent.eventListener({
        type: "alarmDeal",
        url: `${process.env.VUE_APP_API}/s/routine/workPc.html?alertId=${this.prop}`
      });
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.eventListener({
        type: "fullScreen",
        id: this.componentId
      });
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.eventListener({
        type: "fullScreenExit",
        id: this.componentId
      });
    }
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
    padding-top: 12px;
    padding-bottom: 12px;
    ul {
      margin: 0 15px;
      li {
        display: flex;
        line-height: 30px;
        padding-left: 24px;
        padding-right: 6px;
        position: relative;
        text-align: left;
        // cursor: pointer;
        .item-title {
          display: inline-block;
          min-width: 90px;
          text-align: left;
        }
        .item-content {
          word-break: break-all;
        }
        .alarm-status {
          color: #91a22c;
        }
        .status-alarm {
          cursor: pointer;
          color: red;
        }
      }
      li:nth-child(odd) {
        background-color: rgba(256, 256, 256, 0.1);
      }
    }
  }
}
.panel-container-fullscreen {
  .panel-content {
    padding-top: 36px;
    padding-bottom: 36px;
    ul {
      margin: 0 45px;
      li {
        line-height: 90px;
        padding-left: 72px;
        padding-right: 18px;
        .item-title {
          min-width: 270px;
        }
      }
    }
  }
}
</style>