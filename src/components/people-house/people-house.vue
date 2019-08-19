<template>
  <div class="panel-container">
    <div class="panel-title">人口与房屋</div>
    <div class="panel-content">
      <div class="chart-container">
        <div class="chart-item">
          <div id="peoplepie" :style="{width: '200px', height: '200px'}"></div>
          <div class="statistics-container">
            <div class="statistics-text">
              <img class="statistics-bg" src="../../assets/image/icon-text-bg.png" />
              <div class="statistics-title">重点人口</div>
              <div class="statistics-value">
                <span>137</span>人
              </div>
            </div>
            <div class="statistics-text">
              <img class="statistics-bg" src="../../assets/image/icon-text-bg.png" />
              <div class="statistics-title">实有人口</div>
              <div class="statistics-value">
                <span>137</span>人
              </div>
            </div>
          </div>
        </div>
        <div class="chart-item">
          <div id="housepie" :style="{width: '200px', height: '200px'}"></div>
          <div class="statistics-container">
            <div class="statistics-text">
              <img class="statistics-bg" src="../../assets/image/icon-text-bg.png" />
              <div class="statistics-title">实有房屋总数</div>
              <div class="statistics-value">
                <span>1376</span>间
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
  mounted() {
    const self = this;
    self.drawChart();
    setTimeout(() => {
      self.getPeopleInfo();
      self.getHouseInfo();
    }, 1000);
  },
  methods: {
    drawChart(isanimation) {
      const self = this;
      console.log(self.$echarts);
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = self.$echarts.init(document.getElementById("peoplepie"));
      let myChart2 = self.$echarts.init(document.getElementById("housepie"));
      myChart1.setOption(
        {
          title: {
            text: "586",
            x: "center",
            y: "center",
            textStyle: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: "rgba(255, 255, 255)"
            }
          },
          tooltip: {
            show: true,
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            show: false
          },
          calculable: true,
          series: [
            {
              name: "访问来源",
              type: "pie",
              center: ["50%", "50%"],
              radius: [30, 70],
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
                    fontSize: 8,
                    fontWeight: "bolder"
                  }
                }
              },
              data: [
                { value: 335, name: "直达" },
                { value: 679, name: "营销广告" },
                { value: 1548, name: "搜索引擎" }
              ]
            },
            {
              name: "访问来源",
              type: "pie",
              center: ["50%", "50%"],
              radius: [70, 100],
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
                    fontSize: 8,
                    fontWeight: "bolder"
                  }
                }
              },
              data: [
                { value: 1048, name: "百度" },
                { value: 147, name: "其他" }
              ]
            }
          ],
          animation: isanimation
        },
        true
      );

      myChart2.setOption({
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
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: false
        },
        calculable: true,
        series: [
          {
            type: "pie",
            clockWise: true,
            startAngle: 135,
            center: ["50%", "50%"],
            radius: [50, 80],

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
                  fontSize: 8,
                  fontWeight: "bolder"
                }
              }
            },
            data: [
              { value: 335, name: "直达" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ],
        animation: isanimation
      });
    },
    getPeopleInfo() {
      API.getPeopleInfo().then(
        res => {
          console.log(res);
        },
        err => {}
      );
    },
    getHouseInfo() {
      API.getHouseInfo().then(
        res => {
          console.log(res);
        },
        err => {}
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.chart-container {
  display: flex;
  margin: 10px 40px;
  .chart-item {
    .statistics-container {
      display: flex;
      justify-content: center;
      .statistics-text {
        position: relative;
        width: 110px;
        height: 55px;
        padding: 5px 10px;
        margin: 5px;
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
            color: #ffffff;
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>