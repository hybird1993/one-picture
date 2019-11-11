<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">房屋用电情况</div>
    <div class="panel-content">
      <div class="electricity-count">
        <span class="electricity-count-label">累计总电量：</span>
        <span v-for="(num, index) of restNumbers" class="electricity-count-num" :key="index">{{num}}</span>
        <span class="electricity-count-last-num">
          <span>{{lastNumber}}</span>
        </span>
        <span class="electricity-count-unit">kw/h</span>
      </div>
      <div class="electricity-title">{{showDate}}分时电量</div>
      <div class="chart-container">
        <img class="icon-arrow" src="../../assets/image/icon-left-arrow.png" @click="preDay" />
        <div id="barChart" class="bar-chart"></div>
        <img class="icon-arrow" src="../../assets/image/icon-right-arrow.png" @click="nextDay" />
      </div>
    </div>
    <div v-if="!isFullScreen" class="fullscreen-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="fullscreen-item">
      <img @click="exitFullScreen" src="../../assets/image/icon-fullscreen-exit.png" />
    </div>
    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png" />
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
import { TimeUtil } from "../../utils/time-util";
import { Util } from "../../utils/util";
export default {
  name: "house-electricity",
  props: {
    prop: {
      type: [Number, String]
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      electricityCount: "",
      chart: null,
      date: null,
      isFullScreen: false
    };
  },
  computed: {
    showDate: function() {
      return this.date
        ? `${this.date.getFullYear()}年${this.date.getUTCMonth() +
            1}月${this.date.getDate()}日`
        : "";
    },
    lastNumber: function() {
      return this.electricityCount.substr(this.electricityCount.length - 1, 1);
    },
    restNumbers: function() {
      return this.electricityCount.slice(0, this.electricityCount.length - 1);
    }
  },
  mounted() {
    const self = this;
    // 基于准备好的dom，初始化echarts实例
    self.chart = self.$echarts.init(document.getElementById("barChart"));
    self.chart.setOption(self.setChartOption());
    self.setToday();
    self.getHouseElectricity();
  },
  methods: {
    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },

    setToday() {
      const nowDate = new Date();
      this.date = new Date(
        nowDate.getFullYear(),
        nowDate.getUTCMonth(),
        nowDate.getDate()
      );
    },

    preDay() {
      const timestamp = this.date.getTime() - 24 * 60 * 60 * 1000;
      this.date = new Date(timestamp);
      this.getHouseElectricity();
    },

    nextDay() {
      const timestamp = this.date.getTime() + 24 * 60 * 60 * 1000;
      this.date = new Date(timestamp);
      this.getHouseElectricity();
    },

    getHouseElectricity() {
      const self = this;
      const date = TimeUtil.formatDate(self.date, "yyyyMMdd");
      // API.getHouseElectricity(1039, '20190820').then(res => {
      API.getHouseElectricity(self.prop, date).then(
        res => {
          self.electricityCount = res.electricNum
            ? res.electricNum.toString()
            : "0";
          let xData = [],
            sData = [];
          if (res.electricCount) {
            xData = res.electricCount.map(item => item.countHour);
            sData = res.electricCount.map(item => item.electricNum);
          }
          self.chart.setOption({
            xAxis: { data: xData },
            series: { data: sData }
          });
        },
        err => {}
      );
    },

    setChartOption() {
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
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: "rgba(255, 255, 255, 0.65)",
          fontSize: Math.round(12 * times)
        },
        legend: {
          show: false
        },
        grid: {
          left: "3%",
          right: "2%",
          top: "5%",
          bottom: "5%",
          containLabel: true
        },
        calculable: true,
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0 //横轴信息全部显示
            // rotate: 40 //30度角倾斜显示
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: ["rgba(255,255,255,0.2)"],
              width: 0.5,
              type: "solid"
            }
          }
        },
        series: {
          type: "bar",
          data: [],
          barWidth: Math.round(8 * times),
          itemStyle: {
            normal: {
              barBorderRadius: Math.round(4 * times), // 柱条边线圆角
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: "#925dff"
                },
                {
                  offset: 0,
                  color: "#00baff"
                }
              ]),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: Math.round(10 * times)
            }
          }
        },
        animation: false
      };
    },

    setChartFontSize() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        tooltip: {
          textStyle: {
            fontSize: Math.round(12 * times)
          }
        },
        textStyle: {
          fontSize: Math.round(12 * times)
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              width: Math.round(0.5 * times)
            }
          }
        },
        series: {
          barWidth: Math.round(8 * times),
          itemStyle: {
            normal: {
              barBorderRadius: Math.round(4 * times), // 柱条边线圆角
              shadowBlur: Math.round(10 * times)
            }
          }
        }
      };
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.eventListener({
        type: "fullScreen",
        id: this.componentId
      });
      setTimeout(() => {
        this.chart.resize();
        this.chart.setOption(this.setChartFontSize());
      }, 0);
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.eventListener({
        type: "fullScreenExit",
        id: this.componentId
      });
      setTimeout(() => {
        this.chart.resize();
        this.chart.setOption(this.setChartFontSize());
      }, 0);
    }
  },
  watch: {
    prop: function(val, oldVal) {
      console.log("new: %s, old: %s", val, oldVal);
      this.setToday();
      this.getHouseElectricity();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  background-image: url("../../assets/image/detail-bg.png");
  background-size: 100% 100%;
  .electricity-count {
    text-align: left;
    margin: 12px;
    padding-left: 24px;
    span {
      display: inline-block;
    }
    .electricity-count-label {
      color: #49a9ee;
    }
    .electricity-count-num {
      width: 24px;
      height: 24px;
      background-color: rgba(230, 230, 230, 0.3);
      text-align: center;
      line-height: 24px;
      border-radius: 6px;
      margin: 2px;
    }
    .electricity-count-last-num {
      width: 24px;
      height: 24px;
      margin: 2px 6px 2px 2px;
      position: relative;
      span {
        width: 100%;
        height: 100%;
        line-height: 24px;
        background-color: #1ebdde;
        border-radius: 6px;
        text-align: center;
        animation: rotate 0.5s linear infinite;
      }
      &:before {
        content: "";
        height: 4px;
        width: 24px;
        background: #1ebdde;
        border-radius: 50%;
        position: absolute;
        opacity: 0.7;
        top: 30px;
        left: 0;
        animation: shadow 0.5s linear infinite;
      }
    }
    .electricity-count-unit {
      color: rgba(255, 255, 255, 0.65);
    }
  }
  .electricity-title {
    text-align: right;
    padding-right: 36px;
    color: #49a9ee;
  }
  .chart-container {
    position: relative;
    display: flex;
    align-items: center;
    .icon-arrow {
      width: 24px;
      height: 54px;
      margin: 0 12px;
      cursor: pointer;
    }
    .bar-chart {
      flex: 1;
      width: 312px;
      height: 192px;
    }
  }
}

.panel-container-fullscreen {
  .electricity-count {
    padding-left: 72px;
    margin: 36px;
    .electricity-count-num {
      width: 72px;
      height: 72px;
      line-height: 72px;
      border-radius: 18px;
      margin: 6px;
    }
    .electricity-count-last-num {
      width: 72px;
      height: 72px;
      margin: 6px 18px 6px 6px;
      span {
        line-height: 72px;
        border-radius: 18px;
      }
      &:before {
        content: "";
        height: 12px;
        width: 72px;
        top: 90px;
        animation: shadow 0.5s linear infinite;
      }
    }
  }
  .electricity-title {
    padding-right: 108px;
  }
  .chart-container {
    .icon-arrow {
      width: 72px;
      height: 162px;
      margin: 0 36px;
    }
    .bar-chart {
      width: 936px;
      height: 576px;
    }
  }
}

@keyframes rotate {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-10%);
  }
  50% {
    transform: translateY(-20%) scale(1.1, 0.9);
  }
  75% {
    ransform: translateY(-10%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes shadow {
  0%,
  100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.2);
  }
}
</style>