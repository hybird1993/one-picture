<template>
  <div class="panel-container">
    <div class="panel-title">最新资讯</div>
    <el-scrollbar class="panel-content">
      <ul>
        <li
          v-for="item of list"
          class="over-hide"
          :key="item.newsId"
          @click="showDetail(item)"
        >{{item.title}}</li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "latest-news",
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.getLatestNews();
  },
  methods: {
    getLatestNews() {
      const self = this;
      API.getLatestNews().then(
        res => {
          console.log(res);
          self.list = res.list;
        },
        err => {}
      );
    },
    showDetail(item) {
      this.$emit("showNewsDetail", item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";

.panel-content {
  margin: .5rem 0;
  ul {
    margin: 0 1.25rem;
    li {
      height: 2.5rem;
      line-height: 2.5rem;
      padding-left: 1.75rem;
      padding-right: .5rem;
      position: relative;
      text-align: left;
      cursor: pointer;
    }
    li:before {
      content: "";
      position: absolute;
      top: 50%;
      margin-top: -.25rem;
      height: .5rem;
      width: .5rem;
      margin-left: -1.25rem;
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
</style>