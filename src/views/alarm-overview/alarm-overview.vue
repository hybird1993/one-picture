<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">告警视图总览</div>
    <div id="alarmbar"></div>
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
import { Util } from "../../utils/util";
export default {
  name: "alarm-overview",
  data() {
    return {
      indexChart: null,
      isFullScreen: false,
      data: undefined,
      value: undefined,
    };
  },
  mounted() {
    this.initChart();
    this.getAlarmStatistics();
  },
  methods: {
    initChart() {
      this.indexChart = this.$echarts.init(document.getElementById("alarmbar"));
      this.indexChart.setOption(this.setChartOption());
    },
    getAlarmStatistics() {
      const self = this;
      API.getAlarmStatistics().then(
        res => {
          this.name = Object.keys(res);
          this.value = this.name.map(item => res[item]);
          this.indexChart.setOption({
            yAxis: { data: this.name },
            series: [{ data: this.value }]
          });
        },
        err => {}
      );
    },

    resetChart() {
      this.indexChart.dispose();
      this.initChart();
      this.indexChart.setOption({
        yAxis: { data: this.name },
        series: [{ data: this.value }]
      });
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.fullScreen("alarmOverview");
      setTimeout(() => {
        // this.indexChart.resize();
        // this.indexChart.setOption(this.setChartFontSize());
        this.resetChart();
      }, 0);
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit("alarmOverview");
      setTimeout(() => {
        // this.indexChart.resize();
        // this.indexChart.setOption(this.setChartFontSize());
        this.resetChart();
      }, 0);
    },

    setChartOption(name = [], value = []) {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      const option = {
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
        grid: {
          left: "1%",
          right: "7%",
          bottom: "14%",
          top: "8%",
           containLabel: true
        },
        toolbox: {
          show: false
        },
        // calculable: true,
        xAxis: {
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
        },
        yAxis: {
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
            fontSize: Math.round(11 * times)
          },
          data: name
        },
        series: [{
          type: "bar",
          barWidth: Math.round(12 * times),
          data: value,
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 1,
                  color: "rgba(18, 112, 172, 0.8)"
                },
                {
                  offset: 0,
                  color: "rgba(6, 46, 60, 0.8)"
                }
              ]),
              borderColor: "#1ebdde",
              borderWidth: Math.round(1 * times),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: Math.round(10 * times)
            }
          },

          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          }
        }]
      };
      return option;
    },

    setChartFontSize() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        tooltip: {
          textStyle: {
            fontSize: Math.round(12 * times)
          }
        },
        // grid: {
          // left: Math.round(100 * times),
        // },
        xAxis: {
          splitLine: {
            lineStyle: {
              width: Math.round(1 * times)
            }
          },
          axisLabel: {
            fontSize: Math.round(12 * times)
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              width: Math.round(1 * times)
            }
          },
          axisLabel: {
            fontSize: Math.round(11 * times)
          }
        },
        series: {
          barWidth: Math.round(12 * times),
          itemStyle: {
            normal: {
              borderWidth: Math.round(1 * times),
              shadowBlur: Math.round(10 * times)
            }
          },

          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          }
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  #alarmbar {
    width: 400px;
    height: 280px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}

.panel-container-fullscreen {
  #alarmbar {
    width: 1600px;
    height: 840px;
  }
}
</style>