<template>
  <div class="panel-container">
    <div class="panel-title">人员详情</div>
    <div class="panel-content">
      <div>
        <el-radio v-model="radio" label="1" @change="getInfo">个人信息</el-radio>
        <el-radio v-model="radio" label="2" @change="getInfo">家庭信息</el-radio>
        <el-radio v-model="radio" label="3" @change="getInfo">车辆信息</el-radio>
      </div>
      <el-scrollbar>
        <!-- <ul>
          <li>
            <span class="item-title">发生时间：</span>
            <span class="item.content">{{detail.alarmTime}}</span>
          </li>
        </ul> -->
      </el-scrollbar>
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
    id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      radio: "1",
      detail: {},
    };
  },
  mounted() {
    const self = this;
    this.getInfo();
  },
  methods: {
    close() {
      this.$emit("closePeopleDetail");
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
      API.getPeopleDetail(this.id).then(
        res => {
          self.detail = res;
        },
        err => {}
      );
    },
    getFamilyInfo() {
      const self = this;
      API.getRelationlist(6312).then(res => {}, err => {});
    },
    getCarInfo() {
      const self = this;
      API.getCarInfo(this.id).then(res => {}, err => {});
    }
  },
  watch: {
    id: function(val, oldVal) {
      console.log("new: %s, old: %s", val, oldVal);
      this.radio = '1';
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
        .item-title {
          display: inline-block;
          min-width: 90px;
          text-align: left;
        }
        .item-content {
          word-break: break-all;
        }
      }
      li:before {
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
      li:nth-child(odd) {
        background-color: rgba(256, 256, 256, 0.1);
      }
    }
  }
}
</style>