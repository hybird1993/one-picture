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
      this.$emit("showSpecialPeople", item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  margin: 0.5rem 0;
  ul {
    margin: 0 1.25rem;
    li {
      display: flex;
      font-size: 1rem;
      padding: 0.5rem;
      position: relative;
      text-align: left;
      cursor: pointer;
      min-height: 4rem;
      border-bottom: 0.1rem solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        display: inline-block;
        width: 1.75rem;
        margin-right: 1rem;
        padding-top: 0.5rem;
      }
      .alarm-title {
        flex: 1;
        line-height: 1.75rem;
      }
      .alarm-status {
        display: inline-block;
        width: 4rem;
        margin-left: 1rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        border-radius: 0.5rem;
        background-color: red;
      }
    }
  }
}
</style>