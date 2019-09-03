<template>
  <div class="panel-container">
    <div class="panel-title">告警视图总览</div>
    <div id="alarmbar" :style="{width: '100%', height: '100%'}"></div>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "alarm-overview",
  data() {
    return {
      indexChart: null
    };
  },
  mounted() {
    this.initChart(false);
    this.getAlarmStatistics();
  },
  methods: {
    initChart(isanimation) {
      this.indexChart = this.$echarts.init(document.getElementById("alarmbar"));
    },
    getAlarmStatistics() {
      const self = this;
      API.getAlarmStatistics().then(
        res => {
          const name = Object.keys(res);
          const value = name.map(item => res[item]);
          this.indexChart.setOption(this.setChartOption(name, value));
        },
        err => {}
      );
    },
    setChartOption(name = [], value = []) {
      const fontsize = document.getElementsByTagName("html")[0].style.fontSize;
      const times = parseInt(fontsize, 10) / 12;
      return {
        title: {
          text: ""
        },
        textStyle: {
          color: "#fff",
          fontSize: Math.round(12 * times)
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          }
        },

        legend: {},

        grid: {
          left: "3%",
          right: "7%",
          bottom: "8%",
          containLabel: true
        },
        toolbox: {
          show: false
        },
        calculable: true,
        xAxis: [
          {
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                color: ["rgba(255,255,255,0.2)"],
                width: Math.round(1 * times),
                type: "solid"
              }
            },
            axisLabel: {
              color: "#fff",
              fontSize: Math.round(12 * times)
            }
            //	  boundaryGap : [0, 0]
          }
        ],
        yAxis: [
          {
            type: "category",
            splitLine: {
              show: true,
              lineStyle: {
                color: ["rgba(255,255,255,0.2)"],
                width: Math.round(1 * times),
                type: "solid"
              }
            },
            axisLabel: {
              color: "#fff",
              fontSize: Math.round(12 * times)
            },
            data: name
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: Math.round(12 * times),
            data: value,
            itemStyle: {
              normal: {
                color: "#fac007"
              }
            },
            textStyle: {
              color: "#fff",
              fontSize: Math.round(12 * times)
            }
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
</style>