<template>
  <div class="panel-container">
    <div class="panel-title">综治力量</div>
    <div class="panel-content">
      <div id="pieChart" :style="{width: '440px', height: '250px'}"></div>
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "general-power",
  data() {
    return {
      powerChart: null
    };
  },
  mounted() {
    this.initChart();
    this.getPowerStatistics();
  },
  methods: {
    initChart() {
      const self = this;
      // 绘制图表
      self.powerChart = self.$echarts.init(document.getElementById("pieChart"));
    },
    getPowerStatistics() {
      const self = this;
      API.getPowerStatistics().then(
        res => {
          const data = res.map(item => {
            return {
              name: item.groupName,
              value: item.onlineStat["编制"]
            };
          });
          const total = data.reduce((pre, next) => {
            return pre + next.value;
          }, 0);
          self.powerChart.setOption(self.setChartOption(data, total));
        },
        err => {}
      );
    },
    setChartOption(data = [], total) {
      return {
        title: {
          text: total,
          x: "center",
          y: "center",
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "rgba(255, 255, 255)"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: "rgba(255, 255, 255, 0.65)"
        },
        legend: {
          show: false
          // orient: "vertical",
          // x: "left",
          // y: "center",
          // padding: [55, 0, 0, 0],
          // itemGap: 10,
          // itemWidth: 15,
          // itemHeight: 4,
          // textStyle: {
          //   // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          //   color: "rgba(255, 255, 255, 0.65)"
          // },
          // data: ["保安", "协警", "警察", "网格员", "自愿者"]
        },
        calculable: true,
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: ["20%", "90%"],
            center: ["50%", "50%"],
            roseType: "area",
            sort: "ascending", // for funnel
            startAngle: 0,
            //标签
            label: {
              normal: {
                show: true,
                position: "inside",
                textStyle: {
                  align: "center",
                  baseline: "middle",
                  fontFamily: "微软雅黑",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: "bolder"
                }
              }
            },
            color: ["#fac007", "#5551a8", "#1aa980", "#f86531", "#53c9ce"],
            data: data
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
  padding-top: 30px;
}
</style>