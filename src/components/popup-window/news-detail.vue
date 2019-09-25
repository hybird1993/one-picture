<template>
  <div class="panel-container">
    <div class="panel-title">资讯详情</div>
    <el-scrollbar class="panel-content">
      <h2>{{prop.title}}</h2>
      <div>
        <span>时间：{{prop.publishTime}}</span>
        <span>点击量：{{prop.clicks}}</span>
        <span>作者：{{prop.author}}</span>
        <span>来源：{{prop.source}}</span>
      </div>
      <div class="news-content">
        <div v-html="prop.content"></div>
      </div>
    </el-scrollbar>
    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png" />
    </div>
  </div>
</template>
<script>
export default {
  name: "news-detail",
  props: {
    prop: {
      type: Object,
      default: {}
    },
    componentId: {
      type: String
    },
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    close() {
       this.$parent.eventListener({
        type: 'close',
        id: this.componentId
      });
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

    padding-top: 2rem;
    padding-bottom: 2rem;
    h2 {
      margin: 0.5rem 0 10px 0;
    }
    span {
      padding: 0.5rem 2rem;
    }
    .news-content {
      margin: 2rem;
    }
  }
}
</style>