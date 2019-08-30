<template>
  <div class="panel-container">
    <div class="panel-title">特殊人群</div>
    <el-scrollbar class="panel-content">
      <ul>
        <li v-for="(item, index) of list" :key="item.id" @click="showDetail(item)">
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
  name: "special-people",
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.getSpecialPeopleList();
  },
  methods: {
    getSpecialPeopleList() {
      const self = this;
      API.getSpecialPeopleList().then(
        res => {
          console.log(res);
          self.list = res.data;
        },
        err => {}
      );
    },
    showDetail(item) {
      this.$emit('showSpecialPeople', item);
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
    // li:before {
    //   content: "";
    //   position: absolute;
    //   top: 50%;
    //   margin-top: -3px;
    //   height: 6px;
    //   width: 6px;
    //   margin-left: -15px;
    //   display: block;
    //   border-radius: 50%;
    //   background: #01a5db;
    // }
    // li:nth-child(odd) {
    //   background-color: rgba(256, 256, 256, 0.1);
    // }
  }
}
</style>