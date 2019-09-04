<template>
  <div class="panel-container">
    <div class="panel-title">人口信息</div>
    <el-scrollbar class="panel-content">
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
          <div class="custom-btn btn-small">详细信息</div>
          <div class="custom-btn btn-small">显示轨迹</div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
const imgUrl = require("../../assets/image/p1.png");
import {API} from '../../request/api';
export default {
  name: "latest-news",
  data() {
    return {
      list: []
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
    this.getPeopleInfo();
  },
  methods: {
    getPeopleInfo() {
      API.getPeopleInfo().then(res => {

      }, err => {

      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  margin: 1rem;
  .item-person {
    display: flex;
    margin: 1.25rem 0;
    .item-person-left {
      margin-left: 1rem;
      margin-right: 1.75rem;
      img {
        width: 5rem;
        height: 5rem;
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
</style>