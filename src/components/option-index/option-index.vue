<template>
  <div class="panel-container">
    <div class="panel-title">分项指数</div>
    <div class="panel-content">
      <div class="chart-title">
        <div>
          <el-radio v-model="radio" label="1">社区级</el-radio>
          <el-radio v-model="radio" label="2">网格级</el-radio>
        </div>
        <div class="date">
          <span @click="preWeek">&lt;</span>
          {{year}}年&nbsp;{{week}}周
          <span @click="nextWeek">&gt;</span>
        </div>
      </div>
      <div v-if="radio === '1'" class="chart-container">
        <div id="indexbar" :style="{width: '340px', height: '230px'}"></div>
        <el-scrollbar class="chart-content">
          <ul>
            <li v-for="item of list" class="over-hide" :key="item.id">
              <span :class="{'checked': item.checked}"></span>
              {{item.title}}
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
const legend1 = require("../../assets/image/icon-legend-1.png");
const legend2 = require("../../assets/image/icon-legend-2.png");
const legend3 = require("../../assets/image/icon-legend-3.png");
const legend4 = require("../../assets/image/icon-legend-4.png");
const legend5 = require("../../assets/image/icon-legend-5.png");
const legend6 = require("../../assets/image/icon-legend-6.png");
const legend7 = require("../../assets/image/icon-legend-7.png");
const legend8 = require("../../assets/image/icon-legend-8.png");
import { API } from "../../request/api";
import { TimeUtil } from "../../utils/time-util";
export default {
  name: "option-index",
  data() {
    return {
      list: [],
      indexChart: null,
      radio: "1",
      year: null,
      week: null,
      weekList: []
    };
  },
  computed: {
    startDate() {
      return this.formatDate(this.weekList[this.week - 1].startDate);
    },
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
    this.getOptionIndex();
  },
  methods: {
    initChart() {
      const self = this;
      self.indexChart = self.$echarts.init(document.getElementById("indexbar"));
      self.indexChart.setOption(self.setChartOption());
    },
    getOptionIndex() {
      if (this.radio === "1") {
        // 社区级
        this.getCommunityOptionIndex();
      } else {
        // 网格级
        this.getGridOptionIndex();
      }
    },
    getGridOptionIndex() {
      API.getGridOptionIndex(this.startDate, this.endDate).then(
        res => {
          console.log(res);
        },
        err => {}
      );
    },
    getCommunityOptionIndex() {
      API.getCommunityOptionIndex(this.startDate, this.endDate).then(
        res => {
          console.log(res);
        },
        err => {}
      );
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
      // this.getOptionIndex();
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
      // this.getOptionIndex();
    },
    // 格式化时间
    formatDate(date) {
      return TimeUtil.formatDate(date, "yyyyMMdd");
    },
    setChartOption() {
      return {
        tooltip: {
          showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          trigger: "axis"
        },
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: "rgba(255, 255, 255, 0.65)"
        },
        legend: {
          orient: "vertical", //垂直显示
          y: "center", //延Y轴居中
          x: "left", //居右显示
          padding: [15, 0, 0, 0],
          itemGap: 5,
          itemWidth: 15,
          itemHeight: 15,
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "rgba(255, 255, 255, 0.65)"
          },
          data: [
            {
              name: "隐患排查",
              icon: "image://" + legend1,
              textStyle: {
                color: "#28a1f7"
              }
            },
            {
              name: "治安事件",
              icon: "image://" + legend2,
              textStyle: {
                color: "#7ac3ff"
              }
            },
            {
              name: "信访相关",
              icon: "image://" + legend3,
              textStyle: {
                color: "#ffb966"
              }
            },
            {
              name: "爱心帮扶",
              icon: "image://" + legend4,
              textStyle: {
                color: "#f14b30"
              }
            },
            {
              name: "矛盾纠纷",
              icon: "image://" + legend5,
              textStyle: {
                color: "#6cb91e"
              }
            },
            {
              name: "其它",
              icon: "image://" + legend8,
              textStyle: {
                color: "#7f58c3"
              }
            },
            {
              name: "弱电告警",
              icon: "image://" + legend6,
              textStyle: {
                color: "#25a59a"
              }
            },
            {
              name: "弱电故障",
              icon: "image://" + legend7,
              textStyle: {
                color: "#bdbdbd"
              }
            }
          ]
        },
        calculable: true,
        grid: {
          left: "80px",
          right: "2%",
          bottom: "1%",
          top: "10px",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              interval: 0, //横轴信息全部显示
              rotate: 20 //30度角倾斜显示
            },
            data: ["佛祖岭B区", "同心村", "棕黄村", "流芳社区", "大谭村"]
          }
          //	  boundaryGap : [0, 0]
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                color: ["rgba(255,255,255,0.2)"],
                width: 0.5,
                type: "solid"
              }
            }
          }
        ],
        series: [
          {
            name: "隐患排查",
            type: "bar",
            barWidth: 25,
            stack: "总量",
            itemStyle: { normal: { color: "#cd0400" } },
            data: [40, 15, 95, 75, 0]
          },
          {
            name: "治安事件",
            type: "bar",
            barWidth: 25,
            stack: "总量",
            itemStyle: { normal: { color: "#f38f00" } },
            data: [10, 20, 15, 10, 16]
          },
          {
            name: "信访相关",
            type: "bar",
            barWidth: 25,
            stack: "总量",
            itemStyle: { normal: { color: "#f1e000" } },
            data: [96, 91, 98, 77, 0]
          },
          {
            name: "爱心帮扶",
            type: "bar",
            barWidth: 25,
            stack: "总量",
            itemStyle: { normal: { color: "#5dc800" } },
            data: [96, 24, 14, 14, 0]
          },
          {
            name: "矛盾纠纷",
            type: "bar",
            barWidth: 25,
            stack: "总量",
            itemStyle: { normal: { color: "#4ce8de" } },
            data: [91, 25, 9, 95, 34]
          },
          {
            name: "其它",
            type: "bar",
            barWidth: 25,
            stack: "总量",
            itemStyle: { normal: { color: "#8b531b" } },
            data: [30, 30, 17, 3, 0]
          },
          {
            name: "弱电告警",
            type: "bar",
            barWidth: 25,
            stack: "总量",
            itemStyle: { normal: { color: "#126ae4" } },
            data: [30, 30, 17, 3, 0]
          },
          {
            name: "弱电故障",
            type: "bar",
            barWidth: 25,
            stack: "总量",
            itemStyle: { normal: { color: "#9b40d8" } },
            data: [30, 30, 17, 3, 0]
          }
        ],
        animation: false
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
}
</style>