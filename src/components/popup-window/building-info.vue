<template>
  <div class="panel-container">
    <div class="panel-title">楼栋信息</div>
    <div class="chart-title">
      <el-radio
        v-for="unit in unitList"
        :key="unit"
        v-model="selectUint"
        :label="unit"
        @change="showHouseList"
      >单元{{unit}}</el-radio>
    </div>
    <el-scrollbar class="panel-content">
      <table v-if="selectUint">
        <tbody>
          <tr v-for="(floor, index) in houseList" :key="'floor' + index">
            <td v-for="house in floor" :key="house.id" @click="showPeopleInfo(house)" :class="{'select-house': house.id === selectHouseId}">{{house.doorplate}}</td>
          </tr>
        </tbody>
      </table>
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
import { API } from "../../request/api";
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
      selectUint: null,
      unitList: [],
      buildingTileData: null,
      houseList: [],
      selectHouseId: null,
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
      API.getBuildingTile(this.prop).then(
        res => {
          console.log(res);
          this.buildingTileData = res;
          this.showData(res);
        },
        err => {}
      );
    },

    showData(data) {
      // const arr = Array.from(new Set(data.map(item => item.unitNumber))).sort((pre, next) => pre - next);
      this.unitList = Object.keys(data).sort((pre, next) => pre - next);
      this.selectUint = this.unitList[0];
      this.selectHouseId = null;
      this.showHouseList();
    },

    showHouseList() {
      console.log();
      this.houseList = Object.values(
        this.buildingTileData[this.selectUint]
      ).map(item => {
        return Object.values(item);
      });
      console.log(this.selectHouseId)
      console.log(this.houseList);
    },

    showPeopleInfo(item) {
      this.selectHouseId = item.id;
      this.$parent.eventListener({
        type: "peopleInfo",
        id: this.componentId,
        data: item.id,
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
  .chart-title {
    margin: 1rem;
  }
  .panel-content {
    z-index: 1;
    table {
      margin-bottom: 1rem;
      margin-left: 50%;
      transform: translateX(-50%);
      td {
        cursor: pointer;
        width: 9rem;
        height: 3rem;
        text-align: center;
        border: .2rem solid #eee;
      }
      .select-house {
        background-color: #1ebdde;
      }
    }
  }
}
</style>