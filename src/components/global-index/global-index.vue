<template>
  <div class="panel-container">
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
      avgCount: "2765.6",
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
    this.list = Array.from(new Array(20)).map((item, index) => {
      return {
        id: `news${index + 1}`,
        title: `佛祖岭B区${index + 1}`,
        checked: !!(index % 2)
      };
    });
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
      const seriesData = self.list.map(item => {
        return {
          name: item.orgName,
          data: item.scores,
          type: "line",
          areaStyle: {},
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
      this.$parent.fullScreen( 'globalIndex');
      setTimeout(() => {
        this.lineChart.resize();
        this.lineChart.setOption(this.setIndexChartOption());
      }, 0)
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit( 'globalIndex');
      setTimeout(() => {
        this.lineChart.resize();
        this.lineChart.setOption(this.setIndexChartOption());
      }, 0)
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
      // const fontsize = document.getElementsByTagName("html")[0].style.fontSize;
      // const times = parseInt(fontsize, 10) / 12;
      const times = Util.getFontSizeTimes();
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
        color: [
          "#28a1f7",
          "#7ac3ff",
          "#ffb966",
          "#f14b30",
          "#6cb91e",
          "#7f58c3",
          "#25a59a",
          "#bdbdbd"
        ],
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
          top:  Math.round(12 * times),
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
              color: "#fff",
              fontSize: Math.round(12 * times)
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#fff",
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
    padding: 1rem 2rem;
    height: 3.5rem;
    align-items: center;
    justify-content: space-between;
    .avg-count {
      text-align: left;
      margin: 1rem;
      span {
        display: inline-block;
      }
      .avg-count-label {
        color: #49a9ee;
      }
      .avg-count-num {
        width: 2rem;
        height: 2rem;
        background-color: rgba(230, 230, 230, 0.3);
        text-align: center;
        line-height: 2rem;
        border-radius: 0.5rem;
        margin: 0.2rem;
        &:last-child {
          background-color: #ff2400;
        }
      }
    }
    .date {
      color: #49a9ee;
      span {
        cursor: pointer;
        margin: 0 0.5rem;
      }
    }
  }
  .chart-container {
    display: flex;
    justify-content: center;
    padding-left: 1rem;
    #indexline {
      width: 29rem;
      height: 20rem;
    }
    .chart-content {
      height: 20rem;
      ul li {
        text-align: left;
        padding-right: 0.5rem;
        color: #1ebdde;
        margin: 0.2rem;
        cursor: pointer;
        span {
          display: inline-block;
          width: 0.5rem;
          height: 1rem;
          border-color: rgba(255, 255, 255, 0);
          border-style: solid;
          border-width: 0 0.25rem 0.25rem 0;
          transform: rotate(45deg);
          margin-right: 0.5rem;
          margin-left: 0.5rem;
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
        left: 8rem;
        color: green;
      }
      .praise-list {
        position: absolute;
        right: 2rem;
        color: red;
      }
    }
  }
}
</style>