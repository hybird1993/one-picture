<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">全局指数</div>
    <div class="panel-content">
      <div class="chart-title">
        <div class="avg-count">
          <span class="avg-count-label">年度平均指数：</span>
          <span v-for="(num, index) of avgCount" class="avg-count-num" :key="index">{{num}}</span>
        </div>
        <div class="date">
          <span @click="preWeek">&lt;</span>
          {{year}}年&nbsp;{{week}}周
          <span @click="nextWeek">&gt;</span>
        </div>
      </div>
      <div class="chart-container">
        <div id="indexline"></div>
        <el-scrollbar class="chart-content">
          <ul>
            <li
              v-for="item of communityList"
              class="over-hide"
              :key="item.id"
              :title="item.orgName"
              @click="changeItemStatus(item)"
            >
              <span :class="{'checked': item.checked}"></span>
              {{item.orgName}}
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div v-if="!isFullScreen" class="close-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="close-item">
      <img @click="exitFullScreen" src="../../assets/image/icon-fullscreen-exit.png" />
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
import { TimeUtil } from "../../utils/time-util";
import { Util } from "../../utils/util";
import {
  GlobalIndexChartConfig,
  GlobalIndexChartAreaConfig
} from "../../utils/charts.config";
export default {
  name: "global-index",
  data() {
    return {
      list: [],
      communityList: [],
      communityIds: null,
      gridList: [],
      lineChart: null,
      xData: [],
      year: null,
      week: null,
      weekList: [],
      avgCount: "",
      isFullScreen: false,
      xData_: [],
      seriesData_: [
        {
          name: "",
          type: "line",
          areaStyle: {},
          data: [],
          smooth: true
        }
      ]
    };
  },
  computed: {
    endDate() {
      return this.formatDate(this.weekList[this.week - 1].endDate);
    }
  },
  mounted() {
    this.initChart();
    const obj = TimeUtil.getWeeksAndDayInYear();
    this.year = obj.year;
    this.week = obj.index;
    this.weekList = obj.list;
    this.getGlobalIndex();
  },
  methods: {
    initChart() {
      const self = this;
      self.lineChart = self.$echarts.init(document.getElementById("indexline"));
      self.lineChart.setOption(self.setIndexChartOption());
    },
    getGlobalIndex() {
      const self = this;
      API.getGlobalIndex(self.endDate).then(
        res => {
          self.xData = res.date;
          self.communityList = res.data;
          self.avgCount = res.avgScore.toString();
          self.filterCommunityList(true);
        },
        err => {}
      );
    },
    filterCommunityList(isRefresh = false) {
      const self = this;
      if (!self.communityIds) {
        // 默认展示前五条
        self.list = self.communityList.filter((item, index) => {
          return index < 5;
        });
        self.communityIds = self.list.map(item => item.orgId);
      } else {
        self.list = self.communityList.filter((item, index) => {
          return self.communityIds.includes(item.orgId);
        });
      }

      if (isRefresh) {
        self.communityList.forEach(item => {
          if (self.communityIds.includes(item.orgId)) {
            self.$set(item, "checked", true);
          }
        });
      }

      self.showGlobalIndexChart();
    },
    showGlobalIndexChart() {
      const self = this;
      const length = GlobalIndexChartAreaConfig[0].length;
      const times = Util.getFontSizeTimes(this.isFullScreen);
      const seriesData = self.list.map((item, index) => {
        const _index = index % length;
        return {
          name: item.orgName,
          data: item.scores,
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 3 * times // 0.1的线条是非常细的了
              }
            }
          },
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: GlobalIndexChartAreaConfig[0][_index]
                },
                {
                  offset: 1,
                  color: GlobalIndexChartAreaConfig[1][_index]
                }
              ])
            }
          },
          smooth: true
        };
      });
      self.lineChart.setOption(
        self.setIndexChartOption(self.xData, seriesData),
        true
      );
    },
    changeItemStatus(item) {
      this.$set(item, "checked", !item.checked);
      this.communityIds = this.communityList
        .filter(item => item.checked)
        .map(item => item.orgId);
      this.filterCommunityList();
    },
    preWeek() {
      if (this.week === 1) {
        this.year--;
        const obj = TimeUtil.getWeeksAndDayInYear();
        this.week = obj.list.length;
        this.weekList = obj.list;
      } else {
        this.week--;
      }
      this.getGlobalIndex();
    },
    nextWeek() {
      if (this.week === this.weekList.length) {
        this.year++;
        const obj = TimeUtil.getWeeksAndDayInYear();
        this.week = 1;
        this.weekList = obj.list;
      } else {
        this.week++;
      }
      this.getGlobalIndex();
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.fullScreen("globalIndex");
      setTimeout(() => {
        this.lineChart.resize();
        this.lineChart.setOption(this.setIndexChartOption());
      }, 0);
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit("globalIndex");
      setTimeout(() => {
        this.lineChart.resize();
        this.lineChart.setOption(this.setIndexChartOption());
      }, 0);
    },
    // 格式化时间
    formatDate(date) {
      return TimeUtil.formatDate(date, "yyyyMMdd");
    },

    setIndexChartOption(xData, seriesData) {
      if (!xData || !seriesData) {
        xData = this.xData_;
        seriesData = this.seriesData_;
      }
      this.xData_ = xData;
      this.seriesData_ = seriesData;
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          }
        },
        color: GlobalIndexChartConfig,
        // dataZoom: [
        //   {
        //       show: true,
        //       start: 30,
        //       end: 70,
        //       xAxisIndex: [0]
        //   },
        //   {
        //       type: 'inside',
        //       start: 30,
        //       end: 70,
        //       xAxisIndex: [0]
        //   }
        // ],
        grid: {
          top: Math.round(12 * times),
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xData,
            axisLabel: {
              color: "#1ebdde",
              fontSize: Math.round(12 * times)
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#1ebdde",
              fontSize: Math.round(12 * times)
            }
          }
        ],
        series: seriesData
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  z-index: 20;
  .chart-title {
    display: flex;
    padding: 12px 24px;
    height: 42px;
    align-items: center;
    justify-content: space-between;
    .avg-count {
      text-align: left;
      margin: 12px;
      span {
        display: inline-block;
      }
      .avg-count-label {
        color: #49a9ee;
      }
      .avg-count-num {
        width: 24px;
        height: 24px;
        background-color: rgba(230, 230, 230, 0.3);
        text-align: center;
        line-height: 24px;
        border-radius: 6px;
        margin: 2px;
        &:last-child {
          background-color: #1ebdde;
        }
      }
    }
    .date {
      color: #49a9ee;
      span {
        cursor: pointer;
        margin: 0 6px;
      }
    }
  }
  .chart-container {
    display: flex;
    justify-content: center;
    padding-left: 12px;
    #indexline {
      width: 360px;
      height: 240px;
    }
    .chart-content {
      height: 240px;
      ul li {
        text-align: left;
        padding-right: 6px;
        color: #1ebdde;
        margin: 2px;
        cursor: pointer;
        span {
          display: inline-block;
          width: 6px;
          height: 12px;
          border-color: rgba(255, 255, 255, 0);
          border-style: solid;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
          margin-right: 6px;
          margin-left: 6px;
        }
        .checked {
          border-color: rgba(117, 200, 43, 1);
        }
      }
    }
  }
  .rank-container {
    padding-left: 10px;
    .rank-label {
      display: flex;
      position: relative;
      .refueling-list {
        position: absolute;
        left: 96px;
        color: green;
      }
      .praise-list {
        position: absolute;
        right: 24px;
        color: red;
      }
    }
  }
}
.panel-container-fullscreen {
  .panel-content {
    .chart-title {
      padding: 36px 72px;
      height: 126px;
      .avg-count {
        margin: 108px;
        .avg-count-num {
          width: 72px;
          height: 72px;
          line-height: 72px;
          border-radius: 18px;
          margin: 6px;
        }
      }
      .date {
        span {
          margin: 0 18px;
        }
      }
    }
    .chart-container {
      padding-left: 36px;
      #indexline {
        width: 1080px;
        height: 720px;
      }
      .chart-content {
        height: 720px;
        ul li {
          padding-right: 18px;
          margin: 6px;
          span {
            width: 18px;
            height: 36px;
            border-width: 0 9px 9px 0;
            margin-right: 18px;
            margin-left: 18px;
          }
        }
      }
    }
    .rank-container {
      padding-left: 30px;
      .rank-label {
        .refueling-list {
          left: 288px;
        }
        .praise-list {
          right: 72px;
        }
      }
    }
  }
}
</style>