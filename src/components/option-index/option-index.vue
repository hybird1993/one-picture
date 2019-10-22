<template>
  <div class="panel-container">
    <div class="panel-title">分项指数</div>
    <div class="panel-content">
      <div class="chart-title">
        <div>
          <el-radio v-model="radio" label="1" @change="getOptionIndex">社区级</el-radio>
          <el-radio v-model="radio" label="2" @change="getOptionIndex">网格级</el-radio>
        </div>
        <div class="date">
          <span @click="preWeek">&lt;</span>
          {{year}}年&nbsp;{{week}}周
          <span @click="nextWeek">&gt;</span>
        </div>
      </div>
      <div v-show="radio === '1'" class="chart-container">
        <div id="indexbar"></div>
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
      <div v-show="radio === '2'" class="rank-container">
        <div id="rankbar"></div>
        <div class="rank-label">
          <div class="refueling-list">加油榜</div>
          <div class="praise-list">表扬榜</div>
        </div>
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
import { Util } from "../../utils/util";
export default {
  name: "option-index",
  data() {
    return {
      list: [],
      communityList: [],
      communityIds: null,
      gridList: [],
      indexChart: null,
      rankChart: null,
      radio: "1",
      year: null,
      week: null,
      weekList: [],
      isFullScreen: false,
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
      self.rankChart = self.$echarts.init(document.getElementById("rankbar"));
      self.indexChart.setOption(self.setIndexChartOption());
      self.rankChart.setOption(self.setRankChartOption());
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
      const self = this;
      API.getGridOptionIndex(self.startDate, self.endDate).then(
        res => {
          // console.log(res);
          self.showRankListChart(res);
        },
        err => {}
      );
    },
    getCommunityOptionIndex() {
      const self = this;
      API.getCommunityOptionIndex(self.startDate, self.endDate).then(
        res => {
          // console.log(res);
          self.communityList = res.list;
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

      self.showCommunityListChart();
    },
    showCommunityListChart() {
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
    showRankListChart(data) {
      const self = this;
      const yData1 = data.top.map(item => item.orgName.split("-")[1]);
      const yData2 = data.last.map(item => item.orgName.split("-")[1]);
      const seriesData1 = new Array(8).fill({ data: [] });
      const seriesData2 = new Array(8).fill({ data: [] });

      seriesData1.forEach((item, index) => {
        item.data = data.top.map(_item => _item["items"][index]["score"]);
      });
      seriesData2.forEach((item, index) => {
        item.data = data.last.map(_item => {
          return 0 - _item["items"][index]["score"];
        });
      });
      self.rankChart.setOption({
        yAxis: [{ data: yData1 }, { data: yData2 }],
        series: seriesData1.concat(seriesData2)
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

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.fullScreen( 'optionIndex');
      setTimeout(() => {
        this.indexChart.resize();
        this.rankChart.resize();
        this.indexChart.setOption(this.setIndexChartOption());
        this.rankChart.setOption(this.setRankChartOption());
      }, 0)
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit( 'optionIndex');
      setTimeout(() => {
        this.indexChart.resize();
        this.rankChart.resize();
        this.indexChart.setOption(this.setIndexChartOption());
        this.rankChart.setOption(this.setRankChartOption());
      }, 0)
    },

    // 格式化时间
    formatDate(date) {
      return TimeUtil.formatDate(date, "yyyyMMdd");
    },
    setIndexChartOption() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        tooltip: {
          showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          trigger: "axis",
          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          }
        },
        legend: {
          orient: "vertical", //垂直显示
          y: "center", //延Y轴居中
          x: "left", //居右显示
          padding: [Math.round(15 * times), 0, 0, 0],
          itemGap: Math.round(5 * times),
          itemWidth: Math.round(15 * times),
          itemHeight: Math.round(15 * times),
          data: [
            {
              name: "隐患排查",
              icon: "image://" + legend1,
              textStyle: {
                color: "#28a1f7",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "治安事件",
              icon: "image://" + legend2,
              textStyle: {
                color: "#7ac3ff",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "信访相关",
              icon: "image://" + legend3,
              textStyle: {
                color: "#ffb966",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "爱心帮扶",
              icon: "image://" + legend4,
              textStyle: {
                color: "#f14b30",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "矛盾纠纷",
              icon: "image://" + legend5,
              textStyle: {
                color: "#6cb91e",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "心理咨询",
              icon: "image://" + legend8,
              textStyle: {
                color: "#7f58c3",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "弱电告警",
              icon: "image://" + legend6,
              textStyle: {
                color: "#25a59a",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "弱电故障",
              icon: "image://" + legend7,
              textStyle: {
                color: "#bdbdbd",
                fontSize: Math.round(12 * times)
              }
            }
          ]
        },
        calculable: true,
        grid: {
          left: Math.round(80 * times),
          right: "2%",
          bottom: "1%",
          top: Math.round(10 * times),
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["佛祖岭B区", "同心村", "棕黄村", "流芳社区", "大谭村"],
            axisLabel: {
              interval: 0, //横轴信息全部显示
              rotate: 20, //30度角倾斜显示
              color: "#fff",
              fontSize: Math.round(12 * times)
            }
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
                width: Math.round(0.5 * times),
                type: "solid"
              }
            },
            axisLabel: {
              color: "#fff",
              fontSize: Math.round(12 * times)
            }
          }
        ],
        series: [
          {
            name: "隐患排查",
            type: "bar",
            barMaxWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#28a1f7" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "治安事件",
            type: "bar",
            barMaxWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#7ac3ff" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "信访相关",
            type: "bar",
            barMaxWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#ffb966" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "爱心帮扶",
            type: "bar",
            barMaxWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#f14b30" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "矛盾纠纷",
            type: "bar",
            barMaxWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#6cb91e" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "心理咨询",
            type: "bar",
            barMaxWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#7f58c3" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "弱电告警",
            type: "bar",
            barMaxWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#25a59a" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "弱电故障",
            type: "bar",
            barMaxWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#bdbdbd" } },
            data: [100, 100, 100, 100, 100]
          }
        ],
        animation: false
      };
    },
    setRankChartOption() {
      const fontsize = document.getElementsByTagName("html")[0].style.fontSize;
      const times = parseInt(fontsize, 10) / 12;
      return {
        tooltip: {
          showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          trigger: "axis",
          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          },
          formatter: function(params, ticket, callback) {
            // console.log(params);
            const obj = {};
            params.forEach(item => {
              if (!obj[item.axisIndex]) {
                obj[item.axisIndex] = { name: item.axisValueLabel, data: [] };
              }
              obj[item.axisIndex]["data"].push({
                seriesName: item.seriesName,
                value: item.value,
                marker: item.marker
              });
            });
            let str = '<div style="display: flex;padding:5px;">';
            Object.keys(obj).forEach(item => {
              str += '<div style="margin:5px;">' + obj[item].name + "</br>";
              obj[item].data.forEach(_item => {
                str +=
                  _item.marker +
                  _item.seriesName +
                  ":" +
                  Math.abs(_item.value) +
                  "</br>";
              });
              str += "</div>";
            });
            str += "</div>";
            // console.log(str);
            return str;
          }
        },
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: "rgba(255, 255, 255, 0.65)"
        },
        legend: {
          orient: "vertical", //垂直显示
          y: "center", //延Y轴居中
          x: "left", //居右显示
          padding: [Math.round(15 * times), 0, 0, 0],
          itemGap: Math.round(5 * times),
          itemWidth: Math.round(15 * times),
          itemHeight: Math.round(15 * times),
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "rgba(255, 255, 255, 0.65)"
          },
          data: [
            {
              name: "隐患排查",
              icon: "image://" + legend1,
              textStyle: {
                color: "#28a1f7",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "治安事件",
              icon: "image://" + legend2,
              textStyle: {
                color: "#7ac3ff",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "信访相关",
              icon: "image://" + legend3,
              textStyle: {
                color: "#ffb966",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "爱心帮扶",
              icon: "image://" + legend4,
              textStyle: {
                color: "#f14b30",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "矛盾纠纷",
              icon: "image://" + legend5,
              textStyle: {
                color: "#6cb91e",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "心理咨询",
              icon: "image://" + legend8,
              textStyle: {
                color: "#7f58c3",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "弱电告警",
              icon: "image://" + legend6,
              textStyle: {
                color: "#25a59a",
                fontSize: Math.round(12 * times)
              }
            },
            {
              name: "弱电故障",
              icon: "image://" + legend7,
              textStyle: {
                color: "#bdbdbd",
                fontSize: Math.round(12 * times)
              }
            }
          ]
        },
        calculable: true,
        grid: {
          left: Math.round(80 * times),
          right: "2%",
          bottom: "1%",
          top: Math.round(10 * times),
          containLabel: true
        },
        xAxis: [
          {
            type: "value",
            axisLabel: { show: false }
          }
          //	  boundaryGap : [0, 0]
        ],
        yAxis: [
          {
            type: "category",

            data: ["佛祖岭B区", "同心村", "棕黄村", "流芳社区", "大谭村"],
            axisLabel: {
              color: "#fff",
              fontSize: Math.round(10 * times),
              interval: 0, //横轴信息全部显示
              rotate: 20 //30度角倾斜显示,
            }
          },
          {
            type: "category",
            data: ["邬家山村", "大邱村", "湖口村", "汪田村", "九夫村"],
            axisLabel: {
              color: "#fff",
              fontSize: Math.round(10 * times),
              interval: 0, //横轴信息全部显示
              rotate: -20 //30度角倾斜显示
            }
          }
        ],
        series: [
          {
            name: "隐患排查",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#28a1f7" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "治安事件",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#7ac3ff" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "信访相关",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#ffb966" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "爱心帮扶",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#f14b30" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "矛盾纠纷",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#6cb91e" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "心理咨询",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#7f58c3" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "弱电告警",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#25a59a" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "弱电故障",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#bdbdbd" } },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: "隐患排查",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#28a1f7" } },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: [-100, -100, -100, -100, -100]
          },
          {
            name: "治安事件",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#7ac3ff" } },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: [-100, -100, -100, -100, -100]
          },
          {
            name: "信访相关",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#ffb966" } },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: [-100, -100, -100, -100, -100]
          },
          {
            name: "爱心帮扶",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#f14b30" } },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: [-100, -100, -100, -100, -100]
          },
          {
            name: "矛盾纠纷",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#6cb91e" } },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: [-100, -100, -100, -100, -100]
          },
          {
            name: "心理咨询",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#7f58c3" } },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: [-100, -100, -100, -100, -100]
          },
          {
            name: "弱电告警",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#25a59a" } },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: [-100, -100, -100, -100, -100]
          },
          {
            name: "弱电故障",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: { normal: { color: "#bdbdbd" } },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: [-100, -100, -100, -100, -100]
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
    padding: 0 2rem;
    height: 3rem;
    align-items: center;
    justify-content: space-between;
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
    padding-left: 1rem;
    justify-content: center;
    #indexbar {
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
    padding-left: 1rem;
    #rankbar {
      width: 36rem;
      height: 18rem;
      margin-left: 50%;
      transform: translateX(-50%);
    }
    .rank-label {
      display: flex;
      position: relative;
      .refueling-list {
        position: absolute;
        left: 9.5rem;
        margin-top: 0.5rem;
        color: green;
      }
      .praise-list {
        position: absolute;
        left: 30rem;
        margin-top: 0.5rem;
        color: red;
      }
    }
  }
}
</style>