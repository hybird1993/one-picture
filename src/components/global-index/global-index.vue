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
        <div id="indexline" :style="{width: '340px', height: '230px'}"></div>
        <el-scrollbar class="chart-content">
          <ul>
            <li
              v-for="item of communityList"
              class="over-hide"
              :key="item.id"
              @click="changeItemStatus(item)"
            >
              <span :class="{'checked': item.checked}"></span>
              {{item.orgName}}
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
import { TimeUtil } from "../../utils/time-util";
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
      avgCount: "2765.6"
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
          console.log(res);
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
      console.log(self.xData);
   
      self.lineChart.setOption(self.setIndexChartOption(self.xData, seriesData), true)
      
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
    // 格式化时间
    formatDate(date) {
      return TimeUtil.formatDate(date, "yyyyMMdd");
    },
    setIndexChartOption(
      xData = [],
      seriesData = [
        {
          name: "",
          type: "line",
          areaStyle: {},
          data: [],
          smooth: true
        }
      ]
    ) {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: "rgba(255, 255, 255, 0.65)"
        },
        color: ['#28a1f7', '#7ac3ff', '#ffb966', '#f14b30', '#6cb91e', '#7f58c3', '#25a59a', '#bdbdbd'],
        grid: {
          top: "10px",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value"
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
    padding: 10px 20px;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    .avg-count {
      text-align: left;
      margin: 10px;
      span {
        display: inline-block;
      }
      .avg-count-label {
        color: #49a9ee;
      }
      .avg-count-num {
        width: 20px;
        height: 20px;
        background-color: rgba(230, 230, 230, 0.3);
        text-align: center;
        line-height: 20px;
        border-radius: 4px;
        margin: 2px;
        &:last-child {
          background-color: #ff2400;
        }
      }
    }
    .date {
      color: #49a9ee;
      span {
        cursor: pointer;
        margin: 0 5px;
      }
    }
  }
  .chart-container {
    display: flex;
    padding-left: 10px;
    .chart-content {
      height: 230px;
      ul li {
        text-align: left;
        padding-right: 7px;
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
          margin-right: 5px;
          margin-left: 5px;
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
        left: 100px;
        color: green;
      }
      .praise-list {
        position: absolute;
        right: 20px;
        color: red;
      }
    }
  }
}
</style>