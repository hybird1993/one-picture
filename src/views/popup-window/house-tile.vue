<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">户型图</div>
    <div class="chart-title">
      {{houseName}}
    </div>
    <div class="panel-content">
      <img :src="imgUrl" width="90%" height="90%"/>
    </div>
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
import { API } from "../../request/api";
const noHousePic = require("../../assets/image/icon-defalut-tile.png");
export default {
  name: "news-detail",
  props: {
    prop: {
      type: [Number, String]
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      isFullScreen: false,
      imgUrl: null,
      houseName: '',
      selectUint: null,
    };
  },
  mounted() {
    this.getBuildingTile();
  },
  methods: {
    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },

    getBuildingTile() {
      // API.getBuildingTile(this.prop).then(
      //   res => {
      //     console.log(res);
      //     this.buildingTileData = res;
      //     this.showData(res);
      //   },
      //   err => {}
      // );

      API.getHouseDetail(this.prop).then(res => {
        this.houseName = `${res.buildingInfo.buildingName} ${res.doorplate}`;
        this.imgUrl = res.drawingPath ? `data:image/jpg;base64,${res.drawingPath}` : noHousePic;
      });
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.eventListener({
        type: "fullScreen",
        id: this.componentId
      });
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.eventListener({
        type: "fullScreenExit",
        id: this.componentId
      });
    }
  },

  watch: {
    prop: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.getBuildingTile();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  background-image: url("../../assets/image/detail-bg.png");
  background-size: 100% 100%;
  text-align: center;
  .chart-title {
    z-index: 1;
    margin: 6px;
    font-size: 12px;
  }
  .panel-content {
    z-index: 1;
    img {
      width: 90%;
      height: 230px;
    }
  }
}
.panel-container-fullscreen {
  .chart-title {
    margin: 36px;
    font-size: 36px; 
  }
  .panel-content {
    img {
      height: 690px;
    }
  }
}
</style>