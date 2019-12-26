<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">人口与房屋</div>
    <div class="panel-content">
      <div class="chart-container">
        <div class="chart-item">
          <div id="peoplepie"></div>
          <div class="statistics-container">
            <div class="statistics-text">
              <img class="statistics-bg" src="../../assets/image/icon-text-bg.png" />
              <div class="statistics-title">重点人口</div>
              <div class="statistics-value">
                <span>{{keyPersonCount}}</span>人
              </div>
            </div>
            <div class="statistics-text">
              <img class="statistics-bg" src="../../assets/image/icon-text-bg.png" />
              <div class="statistics-title">实有人口</div>
              <div class="statistics-value">
                <span>{{personCount}}</span>人
              </div>
            </div>
          </div>
        </div>
        <div class="chart-item">
          <div id="housepie"></div>
          <div class="statistics-container">
            <div class="statistics-text">
              <img class="statistics-bg" src="../../assets/image/icon-text-bg.png" />
              <div class="statistics-title">实有房屋总数</div>
              <div class="statistics-value">
                <span>{{houseCount}}</span>间
              </div>
            </div>
          </div>
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
import { API } from "../../request/api";
import { setTimeout } from "timers";
import { Util } from "../../utils/util";
import { PeopleChartConfig, HouseChartConfig } from "../../config/charts.config";
export default {
  name: "people-house",
  data() {
    return {
      houseChart: null,
      peopleChart: null,
      houseCount: "",
      personCount: "",
      keyPersonCount: "",
      color1: PeopleChartConfig[0],
      color2: PeopleChartConfig[1],
      isFullScreen: false,
    };
  },
  mounted() {
    const self = this;
    self.initChart();
    self.getPeopleStatistics();
    self.getHouseStatistics();
  },
  methods: {
    initChart() {
      const self = this;
      // 基于准备好的dom，初始化echarts实例
      self.peopleChart = self.$echarts.init(
        document.getElementById("peoplepie")
      );
      self.peopleChart.on("click", function(params) {
        if (self.isFullScreen) {
          self.exitFullScreen();
        }
        self.$emit("showPeopleList", params.name);
      });
      self.houseChart = self.$echarts.init(document.getElementById("housepie"));
    },
    getPeopleStatistics() {
      const self = this;
      API.getPeopleStatistics().then(
        res => {
          // console.log(res);
          const color1 = [];
          const data1 = Object.keys(res.detail).map((item, index) => {
            color1.push(self.color1[index]);
            return {
              value: res.detail[item]["total"],
              name: item
            };
          });
          const data2 = [],
            color2 = [];
          data1.forEach((_item, index) => {
            const _arr = Object.keys(res.detail[_item["name"]])
              .filter(item => item !== "total")
              .map(item => {
                color2.push(self.color2[index]);
                return {
                  value: res.detail[_item["name"]][item],
                  name: item
                };
              });
            data2.push(..._arr);
          });
          self.keyPersonCount = res.focal;
          self.personCount = res.total;
          self.peopleChart.setOption(
            self.getPeopleChartOption(data1, data2, color1, color2)
          );
        },
        err => {}
      );
    },
    
    getHouseStatistics() {
      const self = this;
      API.getHouseStatistics().then(
        res => {
          const data = Object.keys(res)
            .filter(item => item !== "total")
            .map(item => {
              return {
                value: res[item],
                name: item
              };
            });
          self.houseChart.setOption(self.getHouseChartOption(data));
          self.houseCount = res.total;
        },
        err => {}
      );
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.fullScreen( 'peopleHouse');
      setTimeout(() => {
        this.peopleChart.resize();
        this.peopleChart.setOption(this.setPeopleChartFontSize());
        this.houseChart.resize();
        this.houseChart.setOption(this.setHouseChartFontSize());
      }, 0)
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit( 'peopleHouse');
      setTimeout(() => {
        this.peopleChart.resize();
        this.peopleChart.setOption(this.setPeopleChartFontSize());
        this.houseChart.resize();
        this.houseChart.setOption(this.setHouseChartFontSize());
      }, 0)
    },

    getHouseChartOption(data = []) {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        // title: {
        //   text: "34.6%",
        //   subtext: "商铺",
        //   x: "center",
        //   y: "50%",
        //   itemGap: 5,
        //   textStyle: {
        //     // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        //     color: "#fff"
        //   }
        // },
        tooltip: {
          show: true,
          formatter: "{b} : {c} ({d}%)",
          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          }
        },
        legend: {
          show: false
        },
        calculable: true,
        color: HouseChartConfig,
        series: [
          {
            type: "pie",
            clockWise: true,
            startAngle: 135,
            minAngle: 20,
            avoidLabelOverlap: true,
            center: ["45%", "50%"],
            radius: ["50%", "80%"],
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
                  fontWeight: "bolder",
                  fontSize: Math.round(11 * times),
                }
              }
              // emphasis: {
              //   show: true,
              //   position: "center",
              //   textStyle: {
              //     fontSize: 14,
              //     fontWeight: "bold"
              //   },
              //   formatter: "{b}:{d}%"
              // }
            },
            data: data
          }
        ],
        animation: false
      };
    },

    setHouseChartFontSize() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        tooltip: {
          textStyle: {
            fontSize: Math.round(12 * times)
          }
        },
        series: [
          {
            label: {
              normal: {
                textStyle: {
                  fontSize: Math.round(11 * times),
                }
              }
            },
          }
        ],
      };
    },

    formatter(params) {
      if (params.percent < 3) {
        return '...';
      } else {
        const count = parseInt(params.percent / 2, 10);
        if (count > params.name.length) {
          return params.name;
        } else {
          return params.name.slice(0, count - 1) + '...'
        }
      }
    },

    getPeopleChartOption(data1 = [], data2 = [], color1 = [], color2 = []) {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        title: {
          text: "人口分布",
          x: "center",
          y: "center",
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "#fff",
            fontSize: Math.round(14 * times)
          }
        },
        tooltip: {
          show: true,
          formatter: "{a} <br/>{b} : {c} ({d}%)",
          textStyle: {
            color: "#fff",
            fontSize: Math.round(12 * times)
          }
        },
        legend: {
          show: false
        },
        calculable: true,
        series: [
          {
            name: "人口分布",
            type: "pie",
            center: ["50%", "50%"],
            startAngle: 135,
            radius: ["30%", "65%"],
            color: color1,
            avoidLabelOverlap: true,
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
                  fontWeight: "bolder",
                  fontSize: Math.round(11 * times),
                },
                formatter: this.formatter,
              },
            },
            data: data1
          },
          {
            name: "人口分布",
            type: "pie",
            center: ["50%", "50%"],
            startAngle: 135,
            radius: ["65%", "100%"],
            color: color2,
            avoidLabelOverlap: true,
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
                  fontWeight: "bolder",
                  fontSize: Math.round(11 * times),
                },
                formatter: this.formatter,
              }
            },
            data: data2
          }
        ],
        animation: false
      };
    },

    setPeopleChartFontSize() {
      const times = Util.getFontSizeTimes(this.isFullScreen);
      return {
        title: {
          textStyle: {
            fontSize: Math.round(14 * times)
          }
        },
        tooltip: {
          textStyle: {
            fontSize: Math.round(12 * times)
          }
        },
        series: [
          {
            label: {
              normal: {
                textStyle: {
                  fontSize: Math.round(11 * times),
                }
              }
            },
          },
          {
            label: {
              normal: {
                textStyle: {
                  fontSize: Math.round(11 * times),
                }
              }
            },
          }
        ],
      };
    }

  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.chart-container {
  display: flex;
  justify-content: center;
  padding-left: 12px;
  .chart-item {
    margin-top: 12px;
    #peoplepie {
      width: 192px;
      height: 192px;
      margin-left: 50%;
      transform: translateX(-50%);
    }
    #housepie {
      width: 192px;
      height: 192px;
      margin-left: 50%;
      transform: translateX(-50%);
    }
    .statistics-container {
      display: flex;
      justify-content: center;
      .statistics-text {
        position: relative;
        width: 110px;
        height: 60px;
        padding: 6px 12px;
        margin-left: 12px;
        margin-bottom: 6px;
        margin-top: 6px;
        text-align: left;
        color: #49a9ee;
        .statistics-bg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        .statistics-title {
        }
        .statistics-value {
          span {
            display: inline-block;
            color: #ffffff;
            font-size: 24px;
            min-width: 60px;
            text-align: right;
            padding-right: 6px;
          }
        }
      }
    }
  }
}

.panel-container-fullscreen {
  .chart-container {
  padding-left: 36px;
  .chart-item {
    margin-top: 36px;
    #peoplepie {
      width: 576px;
      height: 576px;
    }
    #housepie {
      width: 576px;
      height: 576px;
    }
    .statistics-container {
      .statistics-text {
        width: 330px;
        height: 180px;
        padding: 18px 36px;
        margin-left: 36px;
        margin-bottom: 18px;
        margin-top: 18px;
        .statistics-value {
          span {
            font-size: 72px;
            min-width: 180px;
            padding-right: 18px;
          }
        }
      }
    }
  }
}
}
</style>