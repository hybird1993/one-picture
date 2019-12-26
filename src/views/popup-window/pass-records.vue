<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">通行记录</div>
    <el-scrollbar class="panel-content">
      <div class="box-title" v-if="isShowPic">
        <span class="text">{{alarmTypeName}}</span>
      </div>
      <div class="box-content-top" v-if="isShowPic">
        <div v-for="(item, index) of list1" class="item-person-pic" :key="index">
          <img :src="item" />
        </div>
      </div>
      <div class="box-title" v-if="isShowList">
        <span class="text">{{room}}人口信息</span>
      </div>
      <div class="box-content" v-if="isShowList">
        <div v-for="item of list" class="item-person" :key="item.id">
          <div class="item-person-left">
            <img :src="item.picUrl" />
            <div>{{item.name}}</div>
          </div>
          <div class="item-person-center">
            <div class="person-info">联系方式：{{item.phone}}</div>
            <div class="person-info">身份证号：{{item.idCard}}</div>
            <div class="person-label">
              <span v-for="label of item.labels" :key="label">{{label}}</span>
            </div>
          </div>
          <div class="item-person-right">
            <div class="custom-btn btn-small" @click="showPeopleDetail(item)">详细信息</div>
            <div class="custom-btn btn-small" @click="getUnInportantPersonTrace(item)">显示轨迹</div>
          </div>
        </div>
      </div>
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
import { TimeUtil } from "../../utils/time-util";
export default {
  name: "pass-records",
  props: {
    prop: {
      type: Object
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      list: [],
      list1: [],
      room: "",
      isFullScreen: false,
      alarmTypeName: undefined,
      isShowPic: false,
      isShowList: false,
    };
  },
  mounted() {
    this.showData();
  },
  methods: {
    showData() {
      const self = this;
        self.alarmTypeName = '';
        self.isShowPic = false;
        self.isShowList = false;
      if (self.prop.alarmDesc === '人卡不一') {
        self.alarmTypeName = '人卡不一抓拍留影信息';
        self.isShowPic = true;
        self.isShowList = true;
      } else if (self.prop.alarmDesc === '高频率门禁尾随') {
        self.alarmTypeName = '高频率门禁尾随';
        self.isShowPic = true;
      } else if (self.prop.alarmDesc === '高频率陌生人尾随') {
        self.alarmTypeName = '高频率陌生人尾随';
        self.isShowPic = true;
      } else if (self.prop.alarmDesc === '非访人员串联(公共区域)' || self.prop.alarmDesc === '非访人员串联(串门)') {
        self.alarmTypeName = '非法人员串联告警';
        self.isShowPic = true;
        self.isShowList = true;
      } else {

      }
      self.list1 = self.prop["captureImageUri"].map(item => {
        return process.env.VUE_APP_API + "/" + item;
      });
      if (self.isShowList) {
        self.getPeopleDetail(self.prop["identityCard"]);
      }
    },
    getPeopleDetail(id) {
      const self = this;
      API.getPeopleDetail(id).then(
        res => {
          if (res) {
            self.getHouseInfo(res.residentBaseId);
          } else {
            self.list = [];
          }
        },
        err => {
          self.list = [];
        }
      );
    },
    getHouseInfo(id) {
      const self = this;
      API.getHouseList(id).then(
        res => {
          if (res[0] && res[0]["houseInfo"]) {
            self.getHousePeopleList(res[0]["houseInfo"]["houseId"]);
            self.room =
              res[0]["houseInfo"]["buildingInfo"]["address"] +
              res[0]["houseInfo"]["doorplate"];
          } else {
          }
        },
        err => {
          self.list = [];
        }
      );
    },

    getHousePeopleList(id) {
      const self = this;
      API.getHousePeopleList(id).then(
        res => {
          self.list = res.map(item => {
            const person = item.residentBaseInfo;
            let labels = [];
            labels.push(person.formerName);
            if (person.ethnicity && person.ethnicity !== "无") {
              labels = labels.concat(person.ethnicity.split(","));
            }
            return {
              id: person.residentBaseId,
              name: person.name,
              idCard: person.idNo,
              phone: person.contact,
              picUrl: self.getPeopleIconUrl(person.residentBaseId),
              labels: labels
            };
          });
        },
        err => {
          self.list = [];
        }
      );
    },

    getUnInportantPersonTrace(item) {
      const self = this;
      const startTime = TimeUtil.formatDate(
        new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
      const endTime = TimeUtil.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      API.getUnInportantPersonTrace(item.idCard, startTime, endTime).then(
        res => {
          if (res.data.length > 0) {
            if (this.isFullScreen) {
              this.exitFullScreen();
            }
            this.$parent.eventListener({
              type: "unImportantPersonTrace",
              data: res.data
            });
          }
        },
        err => {}
      );
    },

    getPeopleIconUrl(id) {
      return `${process.env.VUE_APP_API}/pscm/m/resident/base/picture/${id}`;
    },

    showPeopleDetail(item) {
      if (this.isFullScreen) {
        this.exitFullScreen();
      }
      this.$parent.eventListener({
        type: "peopleDetail",
        id: item.idCard
      });
    },

    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
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
      console.log("new: %s, old: %s", val, oldVal);
      if (oldVal && val.id !== oldVal.id) {
        this.showData();
      }
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
    padding: 6px 0;
    .box-title {
      border-bottom: 1px solid rgba(30, 189, 222, 0.5);
      text-align: left;
      .text {
        display: inline-block;
        height: 100%;
        padding: 0px 15px 0 21px;
        background-color: rgba(30, 189, 222, 0.5);
        position: relative;
        height: 24px;
        line-height: 24px;
        &:after {
          content: "";
          position: absolute;
          right: -24px;
          top: 0;
          width: 0;
          border-right: 24px solid transparent;
          border-bottom: 24px solid rgba(30, 189, 222, 0.5);
        }
      }
    }
    .box-content-top {
      overflow: hidden;
      min-height: 114px;
      margin: 6px;
      .item-person-pic {
        width: 102px;
        height: 102px;
        margin: 6px;
        float: left;
        background: linear-gradient(to left, #1cb6d7, #1cb6d7) left top
            no-repeat,
          linear-gradient(to bottom, #1cb6d7, #1cb6d7) left top no-repeat,
          linear-gradient(to left, #1cb6d7, #1cb6d7) right top no-repeat,
          linear-gradient(to bottom, #1cb6d7, #1cb6d7) right top no-repeat,
          linear-gradient(to left, #1cb6d7, #1cb6d7) left bottom no-repeat,
          linear-gradient(to bottom, #1cb6d7, #1cb6d7) left bottom no-repeat,
          linear-gradient(to left, #1cb6d7, #1cb6d7) right bottom no-repeat,
          linear-gradient(to left, #1cb6d7, #1cb6d7) right bottom no-repeat;
        background-size: 3px 24px, 24px 3px, 3px 24px, 24px 3px;
        img {
          margin-top: 3px;
          margin-left: 3px;
          width: 96px;
          height: 96px;
        }
        &:hover {
          transform: scale(1.1);
          transition: all 0.5s;
        }
      }
    }
    .box-content {
      padding: 6px;
      .item-person {
        display: flex;
        margin: 15px 0;
        .item-person-left {
          margin-left: 12px;
          margin-right: 21px;
          text-align: center;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
        }
        .item-person-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .person-info {
            text-align: left;
          }
          .person-label {
            text-align: left;
            span {
              background-color: #1ebdde;
              padding: 1px;
              display: inline-block;
              margin: 0 6px;
            }
          }
        }
        .item-person-right {
          display: flex;
          margin-right: 6px;
          flex-direction: column;
          justify-content: space-around;
          .detail-btn,
          .custom-btn {
            cursor: pointer;
          }
        }
      }
    }
  }
}

.panel-container-fullscreen {
  .panel-content {
    padding: 18px 0;
    .box-title {
      border-bottom: 3px solid rgba(30, 189, 222, 0.5);
      .text {
        padding: 0px 45px 0 63px;
        height: 72px;
        line-height: 72px;
        &:after {
          right: -72px;
          border-right: 72px solid transparent;
          border-bottom: 72px solid rgba(30, 189, 222, 0.5);
        }
      }
    }
    .box-content-top {
      min-height: 342px;
      margin: 18px;
      .item-person-pic {
        width: 306px;
        height: 306px;
        margin: 18px;
        background-size: 9px 72px, 72px 9px, 9px 72px, 72px 9px;
        img {
          margin-top: 9px;
          width: 288px;
          height: 288px;
        }
      }
    }
    .box-content {
      padding: 18px;
      .item-person {
        margin: 45px 0;
        .item-person-left {
          margin-left: 36px;
          margin-right: 63px;
          img {
            width: 180px;
            height: 180px;
          }
        }
        .item-person-center {
          .person-label {
            span {
              padding: 3px;
              margin: 0 18px;
            }
          }
        }
        .item-person-right {
          margin-right: 18px;
        }
      }
    }
  }
}
</style>