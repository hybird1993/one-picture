<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">综治力量</div>
    <div class="panel-content">
      <div id="pieChart"></div>
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
import { Util } from "../../utils/util";
import { GeneralPowerChartConfig } from "../../utils/charts.config";
export default {
  name: "general-power",
  data() {
    return {
      powerChart: null,
      isFullScreen: false,
      timer: null,
    };
  },
  mounted() {
    this.initChart();
    this.getPowerStatistics();
    this.timer = setInterval(() => {
      this.getPowerStatistics();
    }, 1000 * 10);
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    initChart() {
      const self = this;
      // 绘制图表
      self.powerChart = self.$echarts.init(document.getElementById("pieChart"));
      self.powerChart.setOption(self.setChartOption());
      self.powerChart.on("click", function(params) {
        self.$emit("showPeopleList", {
          type: params.data.name,
          list: params.data.users
        });
      });
    },
    getPowerStatistics() {
      const self = this;
      API.getPowerStatistics().then(
        res => {
          const data = res.map(item => {
            return {
              name: item.groupName,
              value: item.onlineStat["编制"],
              onLine: item.onlineStat["在线"],
              users: item.users
            };
          });
          const total = data.reduce((pre, next) => {
            return pre + next.value;
          }, 0);
          self.powerChart.setOption({
            title: {
              text: total
            },
            series: {
              data: data,
            }
          });
        },
        err => {}
      );
    },
      
    fullScreen() {
      this.isFullScreen = true;
      this.$parent.fullScreen( 'generalPower');
      const self = this;
      setTimeout(() => {
        self.powerChart.resize();
        self.powerChart.setOption(self.setChartFontSize());
      }, 0)
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit( 'generalPower');
      const self = this;
      setTimeout(() => {
        self.powerChart.resize();
        self.powerChart.setOption(self.setChartFontSize());
      }, 0)
    },

    setChartOption(data = [], total = []) {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      const option = {
        title: {
          text: total,
          left: "center",
          top: "center",
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "#fff",
            fontSize: Math.round(24 * times),
          }
        },
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
          formatter: function(params, ticket, callback) {
            let str = "";
            str += params.data.name + "(" + params.percent + "%)" + "</br>";
            str += "编制：" + params.data.value + "</br>";
            str += "在线：" + params.data.onLine;
            return str;
          },
          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          }
        },
        legend: {
          show: false
        },
        calculable: true,
        series: 
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
                  fontSize: Math.round(11 * times),
                  fontWeight: "bolder"
                }
              }
            },
            color: GeneralPowerChartConfig,
            data: data
          },
     
        animation: false
      };
      return option;
    },

    setChartFontSize() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        title: {
          textStyle: {
            fontSize: Math.round(24 * times),
          }
        },
        tooltip: {
          textStyle: {
            fontSize: Math.round(12 * times)
          }
        },
        series: 
          {
            label: {
              normal: {
                textStyle: {
                  fontSize: Math.round(11 * times),
                }
              }
            },
          },
      };
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  #pieChart {
    margin-top: 20px;
    width: 250px;
    height: 250px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
.panel-container-fullscreen {
  #pieChart {
    margin-top: 60px;
    width: 750px;
    height: 750px;
  }
}
</style>