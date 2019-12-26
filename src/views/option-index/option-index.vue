<template>
  <div
    class="panel-container"
    :class="{ 'panel-container-fullscreen': isFullScreen }"
  >
    <div class="panel-title">分项指数</div>
    <div class="panel-content">
      <div class="chart-title">
        <div class="type-radio">
          <input
            type="radio"
            id="community"
            value="1"
            v-model="radio"
            @change="getOptionIndex"
          />
          <label for="community">社区级</label>

          <input
            type="radio"
            id="grid"
            value="2"
            v-model="radio"
            @change="getOptionIndex"
          />
          <label for="grid">网格级</label>
        </div>
        <WeekPicker :date="date" :size="size" @change="weekChange"></WeekPicker>
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
              <span :class="{ checked: item.checked }"></span>
              {{ item.orgName }}
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
      <img
        @click="exitFullScreen"
        src="../../assets/image/icon-fullscreen-exit.png"
      />
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
import { OptionIndexChartConfig } from "../../config/charts.config";
import WeekPicker from "../../components/week-picker.vue";
const components = {
  WeekPicker
};
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
      isFullScreen: false,
      barColor: "color",
      legendColor: "color",
      date: new Date().getTime() - 1000 * 60 * 60 * 24 * 7,
      endDate: undefined,
      startDate: undefined,
      size: 'small',
    };
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
    weekChange(event) {
      console.log(event)
      if (event.dateScope && event.dateScope.endDate) {
        this.endDate = this.formatDate(event.dateScope.endDate);
        this.startDate = this.formatDate(event.dateScope.startDate);
        this.getOptionIndex();
      }
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
        // 默认展示前六条
        self.list = self.communityList.filter((item, index) => {
          return index < 6;
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
      // 修改数据用以测试
      // self.list.map((item, index) => {
      //   item.items.forEach((_item, _index) => {
      //     console.log(index, _index)
      //     _item.score = _item.score - index - _index;
      //   })
      // })
      const xData = self.list.map(item => item.orgName);
      let seriesData = [];
      for (let i = 0; i < 8; i++) {
        const data = self.list.map(_item => _item["items"][i]["score"]);
        seriesData.push({ data });
      }
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
      this.$parent.fullScreen("optionIndex");
      this.size = 'large';
      setTimeout(() => {
        this.indexChart.resize();
        this.rankChart.resize();
        // this.indexChart.setOption(this.setIndexChartOption());
        this.indexChart.setOption(this.setIndexChartFontSize());
        // this.rankChart.setOption(this.setRankChartOption());
        this.rankChart.setOption(this.setRankChartFontSize());
      }, 0);
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit("optionIndex");
      this.size = 'small';
      setTimeout(() => {
        this.indexChart.resize();
        this.rankChart.resize();
        // this.indexChart.setOption(this.setIndexChartOption());
        this.indexChart.setOption(this.setIndexChartFontSize());
        // this.rankChart.setOption(this.setRankChartOption());
        this.rankChart.setOption(this.setRankChartFontSize());
      }, 0);
    },

    // 格式化时间
    formatDate(date) {
      return TimeUtil.formatDate(date, "yyyyMMdd");
    },

    getLenged(times = 1) {
      return [
        {
          name: "隐患排查",
          icon: "image://" + legend1,
          textStyle: {
            color: OptionIndexChartConfig.troublesShooting[this.legendColor],
            fontSize: Math.round(12 * times)
          }
        },
        {
          name: "治安事件",
          icon: "image://" + legend2,
          textStyle: {
            color: OptionIndexChartConfig.publicOrder[this.legendColor],
            fontSize: Math.round(12 * times)
          }
        },
        {
          name: "信访相关",
          icon: "image://" + legend3,
          textStyle: {
            color: OptionIndexChartConfig.letterAndVisit[this.legendColor],
            fontSize: Math.round(12 * times)
          }
        },
        {
          name: "爱心帮扶",
          icon: "image://" + legend4,
          textStyle: {
            color: OptionIndexChartConfig.loveHelp[this.legendColor],
            fontSize: Math.round(12 * times)
          }
        },
        {
          name: "矛盾纠纷",
          icon: "image://" + legend5,
          textStyle: {
            color: OptionIndexChartConfig.conflict[this.legendColor],
            fontSize: Math.round(12 * times)
          }
        },
        {
          name: "心理咨询",
          icon: "image://" + legend6,
          textStyle: {
            color:
              OptionIndexChartConfig.psychologicalCounseling[this.legendColor],
            fontSize: Math.round(12 * times)
          }
        },
        {
          name: "弱电告警",
          icon: "image://" + legend7,
          textStyle: {
            color: OptionIndexChartConfig.weakElectrictyAlarm[this.legendColor],
            fontSize: Math.round(12 * times)
          }
        },
        {
          name: "弱电故障",
          icon: "image://" + legend8,
          textStyle: {
            color:
              OptionIndexChartConfig.weakElectrictyTrouble[this.legendColor],
            fontSize: Math.round(12 * times)
          }
        }
      ];
    },

    // 社区级
    setIndexChartOption() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      const option = {
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
            let str = `<div>${params[0]["axisValueLabel"]}</div>`;
            params.reverse().forEach(item => {
              str += `<div>${item.marker}${item.seriesName}: ${item.value}</div>`;
            });
            return str;
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
          data: this.getLenged(times)
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
            data: [],
            axisLabel: {
              interval: 0, //横轴信息全部显示
              rotate: 20, //30度角倾斜显示
              // color: "#fff",
              color: "#1ebdde",
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
              // color: "#fff",
              color: "#1ebdde",
              fontSize: Math.round(12 * times)
            }
          }
        ],
        series: [
          {
            name: "隐患排查",
            type: "bar",
            barMaxWidth: Math.round(20 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.troublesShooting[this.barColor]
              }
            },
            data: []
          },
          {
            name: "治安事件",
            type: "bar",
            barMaxWidth: Math.round(20 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.publicOrder[this.barColor]
              }
            },
            data: []
          },
          {
            name: "信访相关",
            type: "bar",
            barMaxWidth: Math.round(20 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.letterAndVisit[this.barColor]
              }
            },
            data: []
          },
          {
            name: "爱心帮扶",
            type: "bar",
            barMaxWidth: Math.round(20 * times),
            stack: "总量",
            itemStyle: {
              normal: { color: OptionIndexChartConfig.loveHelp[this.barColor] }
            },
            data: []
          },
          {
            name: "矛盾纠纷",
            type: "bar",
            barMaxWidth: Math.round(20 * times),
            stack: "总量",
            itemStyle: {
              normal: { color: OptionIndexChartConfig.conflict[this.barColor] }
            },
            data: []
          },
          {
            name: "心理咨询",
            type: "bar",
            barMaxWidth: Math.round(20 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color:
                  OptionIndexChartConfig.psychologicalCounseling[this.barColor]
              }
            },
            data: []
          },
          {
            name: "弱电告警",
            type: "bar",
            barMaxWidth: Math.round(20 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.weakElectrictyAlarm[this.barColor]
              }
            },
            data: []
          },
          {
            name: "弱电故障",
            type: "bar",
            barMaxWidth: Math.round(20 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color:
                  OptionIndexChartConfig.weakElectrictyTrouble[this.barColor]
              }
            },
            data: []
          }
        ]
      };
      option.series = option.series.reverse();
      return option;
    },

    // 社区级图表字体大小改变
    setIndexChartFontSize() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        tooltip: {
          textStyle: {
            fontSize: Math.round(12 * times)
          }
        },
        legend: {
          padding: [Math.round(15 * times), 0, 0, 0],
          itemGap: Math.round(5 * times),
          itemWidth: Math.round(15 * times),
          itemHeight: Math.round(15 * times),
          data: this.getLenged(times)
        },
        grid: {
          left: Math.round(80 * times),
          top: Math.round(10 * times)
        },
        xAxis: [
          {
            axisLabel: {
              fontSize: Math.round(12 * times)
            }
          }
        ],
        yAxis: [
          {
            splitLine: {
              lineStyle: {
                width: Math.round(0.5 * times)
              }
            },
            axisLabel: {
              fontSize: Math.round(12 * times)
            }
          }
        ],
        series: [
          {
            barMaxWidth: Math.round(25 * times)
          },
          {
            barMaxWidth: Math.round(25 * times)
          },
          {
            barMaxWidth: Math.round(25 * times)
          },
          {
            barMaxWidth: Math.round(25 * times)
          },
          {
            barMaxWidth: Math.round(25 * times)
          },
          {
            barMaxWidth: Math.round(25 * times)
          },
          {
            barMaxWidth: Math.round(25 * times)
          },
          {
            barMaxWidth: Math.round(25 * times)
          }
        ]
      };
    },

    // 网格级
    setRankChartOption() {
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
        //  backgroundColor: '#49a9ee',
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
          data: this.getLenged(times)
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

            data: [],
            axisLabel: {
              // color: "#fff",
              color: "#1ebdde",
              fontSize: Math.round(10 * times),
              interval: 0, //横轴信息全部显示
              rotate: 20 //30度角倾斜显示,
            }
          },
          {
            type: "category",
            data: [],
            axisLabel: {
              // color: "#fff",
              color: "#1ebdde",
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
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.troublesShooting[this.barColor]
              }
            },
            data: []
          },
          {
            name: "治安事件",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.publicOrder[this.barColor]
              }
            },
            data: []
          },
          {
            name: "信访相关",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.letterAndVisit[this.barColor]
              }
            },
            data: []
          },
          {
            name: "爱心帮扶",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: { color: OptionIndexChartConfig.loveHelp[this.barColor] }
            },
            data: []
          },
          {
            name: "矛盾纠纷",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: { color: OptionIndexChartConfig.conflict[this.barColor] }
            },
            data: []
          },
          {
            name: "心理咨询",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color:
                  OptionIndexChartConfig.psychologicalCounseling[this.barColor]
              }
            },
            data: []
          },
          {
            name: "弱电告警",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.weakElectrictyAlarm[this.barColor]
              }
            },
            data: []
          },
          {
            name: "弱电故障",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color:
                  OptionIndexChartConfig.weakElectrictyTrouble[this.barColor]
              }
            },
            data: []
          },
          {
            name: "隐患排查",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.troublesShooting[this.barColor]
              }
            },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: []
          },
          {
            name: "治安事件",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.publicOrder[this.barColor]
              }
            },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: []
          },
          {
            name: "信访相关",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.letterAndVisit[this.barColor]
              }
            },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: []
          },
          {
            name: "爱心帮扶",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: { color: OptionIndexChartConfig.loveHelp[this.barColor] }
            },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: []
          },
          {
            name: "矛盾纠纷",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: { color: OptionIndexChartConfig.conflict[this.barColor] }
            },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: []
          },
          {
            name: "心理咨询",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color:
                  OptionIndexChartConfig.psychologicalCounseling[this.barColor]
              }
            },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: []
          },
          {
            name: "弱电告警",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color: OptionIndexChartConfig.weakElectrictyAlarm[this.barColor]
              }
            },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: []
          },
          {
            name: "弱电故障",
            type: "bar",
            barWidth: Math.round(25 * times),
            stack: "总量",
            itemStyle: {
              normal: {
                color:
                  OptionIndexChartConfig.weakElectrictyTrouble[this.barColor]
              }
            },
            yAxisIndex: "1",
            label: {
              normal: {
                show: false,
                position: "left"
              }
            },
            data: []
          }
        ]
      };
    },

    // 社区级图表字体大小改变
    setRankChartFontSize() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        tooltip: {
          textStyle: {
            fontSize: Math.round(12 * times)
          }
        },
        legend: {
          padding: [Math.round(15 * times), 0, 0, 0],
          itemGap: Math.round(5 * times),
          itemWidth: Math.round(15 * times),
          itemHeight: Math.round(15 * times),
          data: this.getLenged(times)
        },
        grid: {
          left: Math.round(80 * times),
          top: Math.round(10 * times)
        },
        yAxis: [
          {
            axisLabel: {
              fontSize: Math.round(10 * times)
            }
          },
          {
            axisLabel: {
              fontSize: Math.round(10 * times)
            }
          }
        ],
        series: [
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          },
          {
            barWidth: Math.round(25 * times)
          }
        ],
        animation: false
      };
    }
  },
  components: components,
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  z-index: 20;
  .chart-title {
    display: flex;
    padding: 0 24px;
    height: 36px;
    align-items: center;
    justify-content: space-between;
    .type-radio {
      display: flex;
      align-items: center;
      input {
        cursor: pointer;
        width: 12px;
        height: 12px;
      }
      label {
        cursor: pointer;
        margin-left: 4px;
        margin-right: 10px;
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
    padding-left: 12px;
    justify-content: center;
    #indexbar {
      width: 330px;
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
    padding-left: 12px;
    #rankbar {
      width: 432px;
      height: 216px;
      margin-left: 50%;
      transform: translateX(-50%);
    }
    .rank-label {
      display: flex;
      position: relative;
      .refueling-list {
        position: absolute;
        left: 120px;
        margin-top: 6px;
        color: green;
      }
      .praise-list {
        position: absolute;
        left: 400px;
        margin-top: 6px;
        color: red;
      }
    }
  }
}
.panel-container-fullscreen {
  .panel-content {
    .chart-title {
      padding: 0 72px;
      height: 108px;
      .type-radio {
        input {
          width: 39px;
          height: 39px;
        }
        label {
          margin-left: 12px;
          margin-right: 30px;
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
      #indexbar {
        width: 1000px;
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
      padding-left: 36px;
      #rankbar {
        width: 1296px;
        height: 648px;
      }
      .rank-label {
        .refueling-list {
          left: 360px;
          margin-top: 18px;
        }
        .praise-list {
          left: 1200px;
          margin-top: 18px;
        }
      }
    }
  }
}
</style>
