<template>
  <div class="panel-container">
    <div class="panel-content">
 
         <iframe :src="prop.url"></iframe>
 
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
      default: {
        url: ''
      }
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
    background: #fff;
    iframe {
      width: 100%;
      height: 100%;
      margin-top: 1%;
    }
  }
}
</style>