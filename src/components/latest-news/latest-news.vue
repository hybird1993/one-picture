<template>
  <div class="panel-container">
    <div class="panel-title">最新资讯</div>
    <el-scrollbar class="panel-content">
      <ul>
        <li v-for="item of list" class="over-hide" :key="item.id">{{item.title}}</li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import {API} from '../../request/api';
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
      API.getLatestNews().then(res => {
        console.log(res);
        self.list = res.list.map(item => {
          return {
            id: item.newsId,
            title: item.title,
          }
        })
      }, err => {

      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
ul {
  margin: 0 15px;
}
li {
  font-size: 12px;
  height: 25px;
  line-height: 25px;
  padding-left: 20px;
  padding-right: 5px;
  position: relative;
  text-align: left;
  cursor: pointer;
}
li:before {
  content: "";
  position: absolute;
  top: 50%;
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
.panel-content {
  margin: 5px 0;
}
</style>