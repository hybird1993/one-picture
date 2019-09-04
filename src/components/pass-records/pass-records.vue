<template>
  <div class="panel-container">
    <div class="panel-title">通行记录</div>
    <el-scrollbar class="panel-content">
      <div class="box-title">
        <span class="text">人卡不一抓拍留影信息</span>
      </div>
      <div class="box-content-top">
        <div v-for="item of list1" class="item-person-pic" :key="item.id">
          <img :src="item.picUrl" />
        </div>
      </div>
      <div class="box-title">
        <span class="text">9栋1单元304房人口信息</span>
      </div>
      <div class="box-content">
        <div v-for="item of list" class="item-person" :key="item.id">
          <div class="item-person-left">
            <img :src="item.picUrl" />
          </div>
          <div class="item-person-center">
            <div class="person-info">姓名：{{item.name}}</div>
            <div class="person-info">联系方式：{{item.phone}}</div>
            <div class="person-info">身份证号：{{item.idCard}}</div>
          </div>
          <div class="item-person-right">
            <div class="custom-btn btn-small">详细信息</div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
const imgUrl = require("../../assets/image/p1.png");
const imgUrl2 = require("../../assets/image/p3.png");
import {API} from '../../request/api';
export default {
  name: "pass-records",
  data() {
    return {
      list: [],
      list1: []
    };
  },
  mounted() {
    this.list = Array.from(new Array(10)).map((item, index) => {
      return {
        id: `news${index + 1}`,
        name: "杨雨",
        idCard: "3332545876685467544",
        phone: "13966688866",
        picUrl: imgUrl,
        labels: ["户籍人口", "重点青少年"]
      };
    });
    this.list1 = Array.from(new Array(5)).map((item, index) => {
      return {
        id: `news${index + 1}`,
        name: "杨雨",
        idCard: "3332545876685467544",
        phone: "13966688866",
        picUrl: imgUrl2,
        labels: ["户籍人口", "重点青少年"]
      };
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  padding: .5rem 0;
}
.box-title {
  border-bottom: .1rem solid rgba(30, 189, 222, 0.5);
  text-align: left;
  .text {
    display: inline-block;
    height: 100%;
    padding: 0px 1.25rem 0 1.75rem;
    background-color: rgba(30, 189, 222, 0.5);
    position: relative;
    height: 2rem;
    line-height: 2rem;
    &:after {
      content: "";
      position: absolute;
      right: -2rem;
      top: 0;
      width: 0;
      border-right: 2rem solid transparent;
      border-bottom: 2rem solid rgba(30, 189, 222, 0.5);
    }
  }
}
.box-content {
  padding: .5rem;
  .item-person {
    display: flex;
    margin: 1.25rem 0;
    .item-person-left {
      margin-left: 1rem;
      margin-right: 1.75rem;
      img {
        width: 5rem;
        height: 5rem;
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
          background-color: red;
          padding: .1rem;
          display: inline-block;
          margin: 0 .5rem;
        }
      }
    }
    .item-person-right {
      display: flex;
      margin-right: .5rem;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}

.box-content-top {
  overflow: hidden;
  height: 10rem;
  margin: .5rem;
  .item-person-pic {
    width: 7rem;
    height: 9rem;
    margin: .5rem;
    float: left;
    img {
      width: 100%;
      height: 100%;
      &:hover {
        transform: scale(1.1);
        transition: all 0.5s;
      }
    }
  }
}
</style>