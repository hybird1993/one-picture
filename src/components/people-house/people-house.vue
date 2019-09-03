<template>
  <div class="panel-container">
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
  </div>
</template>

<script>
import { API } from "../../request/api";
import { setTimeout } from "timers";
export default {
  name: "people-house",
  data() {
    return {
      houseChart: null,
      peopleChart: null,
      houseCount: "",
      personCount: "",
      keyPersonCount: "",
      color1: ["#fac007", "#6560c1", "#3793d9", "#20eeac"],
      color2: ["#f0a724", "#5551a8", "#256ca7", "#16a98a"]
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
      console.log(self.$echarts);
      // 基于准备好的dom，初始化echarts实例
      self.peopleChart = self.$echarts.init(
        document.getElementById("peoplepie")
      );
      self.peopleChart.on("click", function(params) {
        console.log(params);
        self.$emit("showPeopleList", params.name);
      });
      self.houseChart = self.$echarts.init(document.getElementById("housepie"));
    },
    getPeopleStatistics() {
      const self = this;
      API.getPeopleStatistics().then(
        res => {
          console.log(res);
          const color1 = [];
          const data1 = Object.keys(res.detail).map((item, index) => {
            color1.push(self.color1[index]);
            return {
              value: res.detail[item]["total"],
              name: item
            };
          });
          console.log(data1);
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
          console.log(data2);
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
    getHouseChartOption(data = []) {
      const fontsize = document.getElementsByTagName("html")[0].style.fontSize;
      const times = parseInt(fontsize, 10) / 12;
      return {
        // title: {
        //   text: "34.6%",
        //   subtext: "商铺",
        //   x: "center",
        //   y: "50%",
        //   itemGap: 5,
        //   textStyle: {
        //     // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        //     color: "rgba(255, 255, 255)"
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
        color: [
          "#f86531",
          "#fac007",
          "#3c9ce5",
          "#5551a8",
          "#5551a8",
          "#23ffb4"
        ],
        series: [
          {
            type: "pie",
            clockWise: true,
            startAngle: 135,
            minAngle: 20,
            center: ["50%", "50%"],
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
                  fontWeight: "bolder"
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
    getPeopleChartOption(data1 = [], data2 = [], color1 = [], color2 = []) {
      const fontsize = document.getElementsByTagName("html")[0].style.fontSize;
      const times = parseInt(fontsize, 10) / 12;
      return {
        title: {
          text: "人口分布",
          x: "center",
          y: "center",
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "rgba(255, 255, 255)",
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
            radius: ["30%", "70%"],
            color: color1,
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
                  fontWeight: "bolder"
                }
              }
            },
            data: data1
          },
          {
            name: "人口分布",
            type: "pie",
            center: ["50%", "50%"],
            startAngle: 135,
            radius: ["70%", "100%"],
            color: color2,
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
                  fontWeight: "bolder"
                }
              }
            },
            data: data2
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
.chart-container {
  display: flex;
  padding-left: 1rem;
  .chart-item {
    margin-top: .5rem;
    #peoplepie {
      margin-left: 1.5rem;
      width: 16rem;
      height: 16rem;
    }
    #housepie {
      width: 16rem;
      height: 16rem;
    }
    .statistics-container {
      display: flex;
      justify-content: center;
      .statistics-text {
        position: relative;
        width: 9.5rem;
        height: 5rem;
        padding: 0.5rem 1rem;
        margin-left: 1rem;
        margin-bottom: .5rem;
        margin-top: .5rem;
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
            font-size: 2rem;
            min-width: 5rem;
            text-align: right;
            padding-right: 0.5rem;
          }
        }
      }
    }
  }
}
</style>