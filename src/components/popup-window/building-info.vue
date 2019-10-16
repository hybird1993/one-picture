<template>
  <div class="panel-container">
    <div class="panel-title"></div>
    <el-scrollbar class="panel-content">
      <h2>{{prop.title}}</h2>
      <div>

      </div>
      <div class="news-content">
        <div v-html="prop.content"></div>
      </div>
    </el-scrollbar>
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
    return {
      isFullScreen: false,
    };
  },
  mounted() {
  },
  methods: {
    close() {
       this.$parent.eventListener({
        type: 'close',
        id: this.componentId
      });
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.eventListener({
        type: 'fullScreen',
        id: this.componentId
      });
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
       this.$parent.eventListener({
        type: 'fullScreenExit',
        id: this.componentId
      });
    },
  },
  
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