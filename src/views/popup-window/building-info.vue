<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">楼栋信息</div>
    <div class="chart-title">
      <div class="building-name">{{buildingName}}</div>
      <div class="unit-radio-box">
        <div class="radio" v-for="unit in unitList" :key="unit">
          <input
            type="radio"
            :id="'unit'+ unit"
            :value="unit"
            v-model="selectUint"
            @change="showHouseList"
          />
          <label :for="'unit'+ unit">单元{{unit}}</label>
        </div>
      </div>
    </div>
    <el-scrollbar class="panel-content">
      <table v-if="selectUint">
        <tbody>
          <tr v-for="(floor, index) in houseList" :key="'floor' + index">
            <td
              v-for="house in floor"
              :key="house.id"
              @click="showPeopleInfo(house)"
              :class="{'select-house': house.id === selectHouseId}"
            >{{house.doorplate}}</td>
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
      type: Object
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      isFullScreen: false,
      selectUint: undefined,
      unitList: [],
      buildingTileData: undefined,
      houseList: [],
      selectHouseId: undefined,
      buildingName: undefined,
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
      this.buildingName = this.prop.district + '/' + this.prop.community + '/' + this.prop.buildno
      API.getBuildingTile(this.prop.id).then(
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
      this.houseList = Object.values(this.buildingTileData[this.selectUint])
        .reverse()
        .map(item => {
          return Object.values(item);
        });
      console.log(this.selectHouseId);
      console.log(this.houseList);
    },

    showPeopleInfo(item) {
      if (this.isFullScreen) {
        this.exitFullScreen();
      }
      this.selectHouseId = item.id;
      this.$parent.eventListener({
        type: "houseInfo",
        id: this.componentId,
        data: item.id
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
    z-index: 1;
    margin: 0 12px 12px 12px;
    font-size: 12px;
    .building-name {
      text-align: center;
      margin-bottom: 6px;
    }
    .unit-radio-box {
          display: flex;
    align-items: center;
    justify-content: center;
      .radio {
        display: flex;
        align-items: center;
        input {
          cursor: pointer;
        }
        label {
          cursor: pointer;
          margin-left: 4px;
          margin-right: 10px;
        }
      }
    }

  }
  .panel-content {
    z-index: 1;
    height: calc(100% - 72px);
    table {
      margin-bottom: 12px;
      margin-left: 50%;
      transform: translateX(-50%);
      td {
        cursor: pointer;
        width: 108px;
        height: 36px;
        text-align: center;
        border: 2px solid #eee;
      }
      .select-house {
        background-color: #1ebdde;
      }
    }
  }
}
.panel-container-fullscreen {
  .chart-title {
    margin: 0 36px 36px 36px;
    font-size: 36px;
    .building-name {
      margin-bottom: 18px;
    }
    .unit-radio-box {
      .radio {
        input {
          width: 39px;
          height: 39px;
        }
        label {
          margin-left: 12px;
          margin-right: 30px;
        }
      } 
    }
  
  }
  .panel-content {
    height: calc(100% - 216px);
    table {
      margin-bottom: 36px;
      td {
        width: 324px;
        height: 108px;
        border: 6px solid #eee;
      }
    }
  }
}
</style>