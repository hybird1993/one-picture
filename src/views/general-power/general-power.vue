<template>
  <div
    class="panel-container"
    :class="{ 'panel-container-fullscreen': isFullScreen }"
  >
    <div class="panel-title panel-title-basic">综治力量</div>
    <div class="panel-content">
      <div id="pieChart"></div>
      <div class="circle-box">
        <div class="circle circle1"></div>
        <div class="circle circle2"></div>
        <div class="circle circle3"></div>
        <div class="circle circle4"></div>
        <div class="circle circle5"></div>
        <div class="circle circle6"></div>
        <div class="circle circle7"></div>
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
import { API } from "../../request/api";
import { Util } from "../../utils/util";
import { GeneralPowerChartConfig } from "../../config/charts.config";
import { LOOP_TIME } from "../../config/config";
export default {
  name: "general-power",
  data() {
    return {
      powerChart: null,
      isFullScreen: false,
      timer: null
      // circleList: []
    };
  },
  mounted() {
    // this.initCircle();
    this.getPowerStatistics(true);
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    initCircle() {
      this.circleList = new Array(7).fill({}).map((item, index) => {
        console.log(index);
        item = {
          width: `${120 + index * 20}px`,
          height: `${60 + index * 10}px`,
          borderRadius: `${120 + index * 20}px ${120 + index * 20}px 0 0`
        };
        console.log(item);
        return item;
      });
      console.log(this.circleList);
    },
    initChart(length) {
      const self = this;
      // 绘制图表
      self.powerChart = self.$echarts.init(document.getElementById("pieChart"));
      self.powerChart.setOption(self.setChartOption(length));
      self.powerChart.on("click", function(params) {
        if (self.isFullScreen) {
          self.exitFullScreen();
        }
        self.$emit("showPeopleList", {
          type: params.data.name,
          list: params.data.users
        });
      });
      self.powerChart.on("mouseover", function(params) {
        self.powerChart.dispatchAction({
          type: "downplay"
        });
      });
    },
    getPowerStatistics(bol) {
      const self = this;
      API.getPowerStatistics().then(
        res => {
          if (bol) {
            // 是否初始化表
            self.initChart(res.length);
          }
          const data = res
            .filter(item => item.onlineStat["编制"] > 0)
            .map(item => {
              // const data = res.map(item => {
              const _item = {
                name: item.groupName,
                value: item.onlineStat["编制"],
                onLine: item.onlineStat["在线"],
                users: item.users
              };
              return _item;
            });
          const total = data.reduce((pre, next) => {
            return pre + next.value;
          }, 0);
          const onlineArr = this.getOnlinePie(res, data);
          const series = [
            {
              data: data
            },
            ...onlineArr
          ];
          self.powerChart.setOption({
            title: {
              text: total
            },
            series
          });

          this.timer = setTimeout(() => {
            this.getPowerStatistics();
          }, LOOP_TIME);
        },
        err => {
          this.timer = setTimeout(() => {
            this.getPowerStatistics();
          }, LOOP_TIME);
        }
      );
    },

    getOnlinePie(res, data) {
      const maxOnlineNum = Math.max(...data.map(item => item.onLine));
      let arr = [];
      const precent =
        maxOnlineNum > 15 ? ((2 * 15) / maxOnlineNum).toFixed(2) : 2;
      res.forEach(item => {
        const radius = 40 + precent * item.onlineStat["在线"] + "%";
        const _data = data.map(_item => {
          return {
            name: _item.name,
            value: _item.value,
            onLine: _item.onLine,
            users: _item.users,
            itemStyle:
              _item.name === item.groupName ? { opacity: 1 } : { opacity: 0 }
          };
        });

        const obj = {
          radius: ["30%", radius],
          data: _data
        };
        arr.push(obj);
      });

      return arr;
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.fullScreen("generalPower");
      const self = this;
      setTimeout(() => {
        self.powerChart.resize();
        self.powerChart.setOption(self.setChartFontSize());
      }, 0);
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit("generalPower");
      const self = this;
      setTimeout(() => {
        self.powerChart.resize();
        self.powerChart.setOption(self.setChartFontSize());
      }, 0);
    },

    setChartOption(length = 0) {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      const option = {
        title: {
          text: 0,
          left: "center",
          top: "center",
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "#fff",
            fontSize: Math.round(24 * times)
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

        // polar: {},
        // angleAxis: {
        //   interval: 1,
        //   type: "category",
        //   data: [],
        //   z: 10,
        //   startAngle: 0,
        //   axisLine: {
        //     show: false,
        //     lineStyle: {
        //       color: "#0B4A6B",
        //       width: 1,
        //       type: "solid"
        //     }
        //   },
        //   axisLabel: {
        //     interval: 0,
        //     show: true,
        //     color: "#0B4A6B",
        //     margin: 8,
        //     fontSize: 16
        //   }
        // },
        // radiusAxis: {
        //   min: 80,
        //   max: 160,
        //   interval: 8,
        //   axisLine: {
        //     show: false,
        //     lineStyle: {
        //       color: "#0B3E5E",
        //       width: 1,
        //       type: "solid"
        //     }
        //   },
        //   axisLabel: {
        //     formatter: "{value} %",
        //     show: false,
        //     padding: [0, 0, 20, 0],
        //     color: "#0B3E5E",
        //     fontSize: 16
        //   },
        //   splitLine: {
        //     lineStyle: {
        //       // color: "#07385e",
        //       color: "rgba(210, 201, 201, 0.4)",
        //       width: 1,
        //       type: "dashed"
        //     }
        //   }
        // },

        legend: {
          show: false
        },
        calculable: true,
        series: [
          {
            name: "面积模式",
            type: "pie",
            // radius: ["20%", "90%"],
            zlevel: 1,
            radius: ["30%", "40%"],
            center: ["50%", "50%"],
            // roseType: "area",
            // roseType : 'radius',
            sort: "ascending", // for funnel
            startAngle: 0,
            //标签
            label: {
              show: true,
              // position: "inside",
              textStyle: {
                align: "center",
                baseline: "middle",
                fontFamily: "微软雅黑",
                color: "#fff",
                fontSize: Math.round(11 * times),
                fontWeight: "bolder"
              }
            },
            labelLine: {
              length: Math.round(35 * times),
              length2: Math.round(20 * times),
              lineStyle: {
                width: Math.round(1 * times)
              }
            },
            color: GeneralPowerChartConfig,
            data: []
          }
        ],
        animation: false
      };
      for (let i = 0; i < length; i++) {
        option.series.push({
          name: "面积模式",
          type: "pie",
          radius: ["30%", "40%"],
          center: ["50%", "50%"],
          sort: "ascending", // for funnel
          startAngle: 0,
          //标签
          label: {
            show: false
          },
          color: GeneralPowerChartConfig,
          data: []
        });
      }
      console.log("option----> ");
      console.log(option);
      return option;
    },

    setChartFontSize() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        title: {
          textStyle: {
            fontSize: Math.round(24 * times)
          }
        },
        tooltip: {
          textStyle: {
            fontSize: Math.round(12 * times)
          }
        },
        series: {
          label: {
            normal: {
              textStyle: {
                fontSize: Math.round(11 * times)
              }
            }
          },
          labelLine: {
            length: Math.round(35 * times),
            length2: Math.round(20 * times),
            lineStyle: {
              width: Math.round(1 * times)
            }
          }
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  position: relative;
  #pieChart {
    z-index: 1;
    width: 300px;
    height: 250px;
    margin-left: 50%;
    margin-top: 20px;
    transform: translateX(-50%);
  }
  .circle-box {
    position: absolute;
    width: 250px;
    height: 250px;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    .circle {
      position: absolute;
      left: 125px;
      top: 125px;
      transform: translate(-50%, -100%);
      border: dashed rgba(210, 201, 201, 0.4) 1px;
      border-bottom: none;
    }
    .circle1 {
      width: 120px;
      height: 60px;
      border-radius: 120px 120px 0 0;
    }
    .circle2 {
      width: 140px;
      height: 70px;
      border-radius: 140px 140px 0 0;
    }
    .circle3 {
      width: 160px;
      height: 80px;
      border-radius: 160px 160px 0 0;
    }
    .circle4 {
      width: 180px;
      height: 90px;
      border-radius: 180px 180px 0 0;
    }
    .circle5 {
      width: 200px;
      height: 100px;
      border-radius: 200px 200px 0 0;
    }
    .circle6 {
      width: 220px;
      height: 110px;
      border-radius: 220px 220px 0 0;
    }
    .circle7 {
      width: 240px;
      height: 120px;
      border-radius: 240px 240px 0 0;
    }
  }
}
.panel-container-fullscreen {
  position: relative;
  #pieChart {
    width: 900px;
    height: 750px;
    margin-top: 60px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .circle-box {
    width: 750px;
    height: 750px;
    left: 50%;
    top: 60px;
    transform: translateX(-50%);
    .circle {
      left: 375px;
      top: 375px;
      transform: translate(-50%, -100%);
      border: dashed rgba(210, 201, 201, 0.4) 3px;
      border-bottom: none;
    }
    .circle1 {
      width: 360px;
      height: 180px;
      border-radius: 360px 360px 0 0;
    }
    .circle2 {
      width: 420px;
      height: 210px;
      border-radius: 420px 420px 0 0;
    }
    .circle3 {
      width: 480px;
      height: 240px;
      border-radius: 480px 480px 0 0;
    }
    .circle4 {
      width: 540px;
      height: 270px;
      border-radius: 540px 540px 0 0;
    }
    .circle5 {
      width: 600px;
      height: 300px;
      border-radius: 600px 600px 0 0;
    }
    .circle6 {
      width: 660px;
      height: 330px;
      border-radius: 660px 660px 0 0;
    }
    .circle7 {
      width: 720px;
      height: 360px;
      border-radius: 720px 720px 0 0;
    }
  }
}
</style>
