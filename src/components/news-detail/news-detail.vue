<template>
  <div class="panel-container">
    <div class="panel-title">资讯详情</div>
    <el-scrollbar class="panel-content">
      <h2>{{detail.title}}</h2>
      <div>
        <span>时间：{{detail.publishTime}}</span>
        <span>点击量：{{detail.clicks}}</span>
        <span>作者：{{detail.author}}</span>
        <span>来源：{{detail.source}}</span>
      </div>
      <div class="news-content">
        <div v-html="detail.content"></div>
      </div>
    </el-scrollbar>
    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png"/>
    </div>
  </div>
</template>
<script>
export default {
  name: "news-detail",
  props: ["detail"],
  data() {
    return {};
  },
  mounted() {
    const self = this;
    console.log(self.detail);
  },
  methods: {
    close() {
      this.$emit('closeNewsDetail');
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

    padding-top: 20px;
    padding-bottom: 20px;
    h2 {
      margin: 5px 0 10px 0;
    }
    span {
      padding: 5px 20px;
    }
    .news-content {
      margin: 20px;
    }
  }
}
</style>