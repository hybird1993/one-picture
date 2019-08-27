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
          self.communityList = res.list;
          // self.filterCommunityList(true);
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
      const xData = self.list.map(item => item.orgName);
      const seriesData = new Array(8).fill({ data: [] });

      seriesData.forEach((item, index) => {
        item.data = self.list.map(_item => _item["items"][index]["score"]);
      });
      self.indexChart.setOption({
        xAxis: { data: xData },
        series: seriesData
      });
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
      this.getOptionIndex();
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
      this.getOptionIndex();
    },
    // 格式化时间
    formatDate(date) {
      return TimeUtil.formatDate(date, "yyyyMMdd");
    },
    setIndexChartOption() {
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
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",

            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210],
            smooth: true
          },
          {
            name: "联盟广告",
            type: "line",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310],
            smooth: true
          },
          {
            name: "视频广告",
            type: "line",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410],
            smooth: true
          },
          {
            name: "直接访问",
            type: "line",
            areaStyle: { normal: {} },
            data: [320, 332, 301, 334, 390, 330, 320],
            smooth: true
          },
          {
            name: "搜索引擎",
            type: "line",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            smooth: true
          }
        ]
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
    padding: 0 20px;
    height: 36px;
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