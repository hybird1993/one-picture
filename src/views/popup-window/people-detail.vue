<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">人员详情</div>
    <div class="panel-content">
      <div class="chart-title">
        <input type="radio" id="person" value="1" v-model="radio" @change="getInfo" />
        <label for="person">个人信息</label>
        <input type="radio" id="house" value="2" v-model="radio" @change="getInfo" />
        <label for="house">家庭信息</label>
        <input type="radio" id="car" value="3" v-model="radio" @change="getInfo" />
        <label for="car">车辆信息</label>
      </div>

      <el-scrollbar class="info-content">
        <ul v-if="radio === '1'">
          <img :src="detail.icon" class="people-icon" />
          <li>
            <span class="item-title">姓名：</span>
            <span class="item.content">{{detail.name}}</span>
          </li>
          <li>
            <span class="item-title">曾用名：</span>
            <span class="item.content">{{detail.formerName}}</span>
          </li>
          <li>
            <span class="item-title">身份证号：</span>
            <span class="item.content">{{detail.idNo}}</span>
          </li>
          <li>
            <span class="item-title">出生日期：</span>
            <span class="item.content">{{detail.birthDate}}</span>
          </li>
          <li>
            <span class="item-title">性别：</span>
            <span class="item.content">{{detail.sexName}}</span>
          </li>
          <li>
            <span class="item-title">民族：</span>
            <span class="item.content">{{detail.ethnicityName}}</span>
          </li>
          <li>
            <span class="item-title">政治面貌：</span>
            <span class="item.content">{{detail.politicalStatusName}}</span>
          </li>
          <li>
            <span class="item-title">学历：</span>
            <span class="item.content">{{detail.educationalDegreeName}}</span>
          </li>
          <li>
            <span class="item-title">婚姻状况：</span>
            <span class="item.content">{{detail.maritalStatusName}}</span>
          </li>
          <li>
            <span class="item-title">籍贯：</span>
            <span class="item.content">{{detail.registeredResidenceName}}</span>
          </li>
          <li>
            <span class="item-title">职业类别：</span>
            <span class="item.content">{{detail.occupationCategoryName}}</span>
          </li>
          <li>
            <span class="item-title">职业：</span>
            <span class="item.content">{{detail.occupation}}</span>
          </li>
          <li>
            <span class="item-title">宗教信仰：</span>
            <span class="item.content">{{detail.religiousBeliefName}}</span>
          </li>
          <li>
            <span class="item-title">户籍地：</span>
            <span class="item.content">{{detail.registeredResidenceAddress}}</span>
          </li>
          <li>
            <span class="item-title">服务处所：</span>
            <span class="item.content">{{detail.employer}}</span>
          </li>
          <li>
            <span class="item-title">现住地：</span>
            <span class="item.content">{{detail.currentResidenceAddress}}</span>
          </li>
          <li>
            <span class="item-title">联系方式：</span>
            <span class="item.content">{{detail.contact}}</span>
          </li>
          <li>
            <span class="item-title">人员标签：</span>
            <span class="item.content" style="color: #1ebdde">{{detail.residentType}}</span>
          </li>
          <li>
            <span class="item-title">现住门（楼）详址：</span>
            <span class="item.content">{{detail.currentResidenceAddress}}</span>
          </li>
          <li>
            <span class="item-title">户籍门（楼）详址：</span>
            <span class="item.content">{{detail.registeredResidenceAddress}}</span>
          </li>
        </ul>
        <ul v-if="radio === '2'">
          <li v-for="(people, index) of relationlist" class="people-relation" :key="index">
            <div class="people-item">
              <div class="box-title">
                <span class="text">{{people.name}}</span>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>性别</td>
                    <td>{{people.sexName}}</td>
                    <td>民族</td>
                    <td>{{people.ethnicityName}}</td>
                  </tr>
                  <tr>
                    <td>身份证号</td>
                    <td>{{people.idNo}}</td>
                    <td>出生日期</td>
                    <td>{{people.birthDate}}</td>
                  </tr>
                  <tr>
                    <td>联系方式</td>
                    <td>{{people.contact}}</td>
                    <td>家庭关系</td>
                    <td>{{people.relationName}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        </ul>
        <ul v-if="radio === '3'">
          <li>
            <span class="car-number">车牌号</span>
            <span class="car-color">颜色</span>
            <span class="car-usage">用途</span>
          </li>
          <li v-for="car of carList" :key="car.carNo">
            <span class="car-number">{{car.carNo}}</span>
            <span class="car-color">{{car.carColor}}</span>
            <span class="car-usage">{{car.carUsage}}</span>
          </li>
        </ul>
      </el-scrollbar>
    </div>
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
  name: "people-detail",
  props: {
    prop: {
      type: [Number, String]
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      radio: "1",
      detail: {},
      residentBaseId: null,
      carList: [],
      dict: {},
      relationlist: [],
      isFullScreen: false
    };
  },
  mounted() {
    const self = this;
    self.getInfo();
    self.dict = self.$parent.$parent.dict; // TODO 待优化  改为vuex
  },
  methods: {
    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },
    getInfo() {
      if (this.radio === "1") {
        this.getPeopleDetail();
      } else if (this.radio === "2") {
        this.getFamilyInfo();
      } else if (this.radio === "3") {
        this.getCarInfo();
      } else {
      }
    },
    getPeopleDetail() {
      const self = this;
      API.getPeopleDetail(this.prop).then(
        res => {
          if (res) {
            try {
              const _res = Object.assign({}, res);
              _res["sexName"] = self.dict["性别"][_res.sex];
              _res["ethnicityName"] = self.dict["民族"][_res.ethnicity];
              _res["politicalStatusName"] =
                self.dict["政治面貌"][_res.politicalStatus];
              _res["educationalDegreeName"] =
                self.dict["学历"][_res.educationalDegree];
              _res["maritalStatusName"] =
                self.dict["婚姻状况"][_res.maritalStatus];
              _res["registeredResidenceName"] =
                self.dict["行政区划"][_res.registeredResidence];
              _res["religiousBeliefName"] =
                self.dict["宗教信仰"][_res.religiousBelief];
              _res["occupationCategoryName"] =
                self.dict["职业类别"][_res.occupationCategory];
              _res["icon"] = self.getPeopleIconUrl(_res.residentBaseId);
              self.detail = _res;
              self.residentBaseId = _res.residentBaseId;
              self.getHouseInfo();
            } catch (e) {
              console.log(e);
            }
          } else {
            self.detail = {};
          }
        },
        err => {
          self.detail = {};
        }
      );
    },
    getFamilyInfo() {
      const self = this;
      API.getRelationlists(self.prop).then(
        res => {
          if (res[0] && res[0]["familyRelationDtos"]) {
            try {
              self.relationlist = res[0]["familyRelationDtos"];
              self.relationlist.forEach(item => {
                item["sexName"] = self.dict["性别"][item.sex];
                item["relationName"] = self.dict["家庭关系"][item.relation];
                item["ethnicityName"] = self.dict["民族"][item.ethnicity];
              });
            } catch (e) {
              console.log(e);
            }
          }
        },
        err => {}
      );
    },

    getCarInfo() {
      const self = this;
      if (!self.residentBaseId) {
        return;
      }
      API.getCarInfo(self.residentBaseId).then(
        res => {
          self.carList = res.list;
        },
        err => {}
      );
    },

    getHouseInfo() {
      const self = this;
      if (!self.residentBaseId ) {
        return;
      }
      API.getHouseList(self.residentBaseId).then(
        res => {
          if (res[0] && res[0]["houseInfo"]) {
            this.$parent.eventListener({
              type: "house",
              id: this.componentId,
              data: res[0]["houseInfo"]
            });
          } else {
            this.$parent.eventListener({
              type: "house",
              id: this.componentId,
              data: null
            });
          }
        },
        err => {}
      );
    },

    getPeopleIconUrl(id) {
      return `${process.env.VUE_APP_API}/pscm/m/resident/base/picture/${id}`;
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
      this.radio = "1";
      this.residentBaseId = null;
      this.getInfo();
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
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .chart-title {
      z-index: 1;
      margin-bottom: 12px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      input {
        cursor: pointer;
        width: 12px;
        height: 12px;
      }
      label {
        cursor: pointer;
        margin-left: 4px;
        margin-right: 10px;
      }
    }
    .info-content {
      flex: 1;
      height: calc(100% - 72px);
      ul {
        margin: 0 15px;
        position: relative;
        .people-icon {
          width: 90px;
          height: 90px;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 1;
        }
        li {
          display: flex;
          line-height: 30px;
          padding-right: 6px;
          position: relative;
          text-align: left;
          .item-title {
            display: inline-block;
            min-width: 120px;
            text-align: left;
            margin-left: 15px;
          }
          .item-content {
            word-break: break-all;
          }
          .car-number {
            width: 25%;
            padding-left: 12px;
          }
          .car-color {
            width: 25%;
            padding-left: 12px;
          }
          .car-usage {
            width: 50%;
            padding-left: 12px;
          }
          .box-title {
            border-bottom: 1px solid rgba(30, 189, 222, 0.5);
            text-align: left;
            margin-bottom: 6px;
            .text {
              display: inline-block;
              height: 100%;
              padding: 0px 15px 0 24px;
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
          .people-item {
            width: 100%;
            padding-bottom: 6px;
            padding: 6px 0 6px 6px;
            table {
              width: 100%;
              td {
                padding-left: 12px;
                border: 1px solid rgba(255, 255, 255, 0.4);
              }
            }
          }
        }
        .li-dot {
          &:before {
            content: "";
            position: absolute;
            top: 15px;
            margin-top: -3px;
            height: 6px;
            width: 6px;
            margin-left: -15px;
            display: block;
            border-radius: 50%;
            background: #01a5db;
          }
        }
        li:nth-child(odd) {
          background-color: rgba(256, 256, 256, 0.1);
        }
        .people-relation:nth-child(n) {
          background-color: rgba(256, 256, 256, 0.1);
          margin-bottom: 10px;
        }
      }
    }
  }
}
.panel-container-fullscreen {
  .panel-content {
    padding-top: 36px;
    padding-bottom: 36px;
    .chart-title {
      margin-bottom: 36px;
      font-size: 36px;
      input {
        width: 39px;
        height: 39px;
      }
      label {
        margin-left: 12px;
        margin-right: 30px;
      }
    }
    .info-content {
      height: calc(100% - 216px);
      ul {
        margin: 0 45px;
        .people-icon {
          width: 270px;
          height: 270px;
        }
        li {
          line-height: 90px;
          padding-right: 18px;
          .item-title {
            min-width: 360px;
            margin-left: 45px;
          }
          .car-number {
            padding-left: 36px;
          }
          .car-color {
            padding-left: 36px;
          }
          .car-usage {
            padding-left: 36px;
          }
          .box-title {
            border-bottom: 3px solid rgba(30, 189, 222, 0.5);
            margin-bottom: 18px;
            .text {
              padding: 0px 45px 0 72px;
              height: 72px;
              line-height: 72px;
              &:after {
                right: -72px;
                border-right: 72px solid transparent;
                border-bottom: 72px solid rgba(30, 189, 222, 0.5);
              }
            }
          }
          .people-item {
            padding-bottom: 18px;
            padding: 18px 0 18px 18px;
            table {
              td {
                padding-left: 36px;
                border: 3px solid rgba(255, 255, 255, 0.4);
              }
            }
          }
        }
        .li-dot {
          &:before {
            top: 45px;
            margin-top: -9px;
            height: 18px;
            width: 18px;
            margin-left: -45px;
            border-radius: 50%;
          }
        }
        .people-relation:nth-child(n) {
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>