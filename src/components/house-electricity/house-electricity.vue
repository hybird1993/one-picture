<template>
  <div class="panel-container">
    <div class="panel-title">房屋用电情况</div>
    <div class="panel-content">
      <div class="electricity-count">
        <span class="electricity-count-label">累计总电量：</span>
        <span v-for="(num, index) of electricityCount" class="electricity-count-num" :key="index">{{num}}</span>
        <span class="electricity-count-unit">kw/h</span>
      </div>
      <div class="electricity-title">{{'2018年4月3日'}}分时电量</div>
      <div class="chart-container">
        <img class="icon-arrow" src="../../assets/image/icon-left-arrow.png" />
        <div id="barChart" class="bar-chart" :style="{width: '410px', height: '200px'}"></div>
        <img class="icon-arrow" src="../../assets/image/icon-right-arrow.png" />
      </div>
    </div>
  </div>
</template>

<script>
import {API} from '../../request/api';
export default {
  name: "house-electricity",
  data() {
    return {
      electricityCount: '2765.6'
    };
  },
  mounted() {
    this.drawLine(false);
  },
  methods: {
    drawLine(isanimation) {
      const self = this;
      // 基于准备好的dom，初始化echarts实例
      let myChart = self.$echarts.init(document.getElementById("barChart"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          trigger: "axis"
        },
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: "rgba(255, 255, 255, 0.65)"
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
        xAxis: [
          {
            type: "category",
            data: [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24"
            ],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0 //横轴信息全部显示
              // rotate: 40 //30度角倾斜显示
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                color: ["rgba(255,255,255,0.2)"],
                width: 0.5,
                type: "solid"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: [
              12.0,
              4.9,
              47.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              46.4,
              23.3,
              2.0,
              94.9,
              47.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ],
            barWidth: 8,
            itemStyle: {
              normal: {
                barBorderRadius: 4, // 柱条边线圆角
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
                shadowBlur: 10
              }
            }
          }
        ],

        animation: isanimation
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.electricity-count {
  text-align: left;
  padding-left: 30px;
  margin: 10px;
  span {
    display: inline-block;
  }
  .electricity-count-label {
    color: #49a9ee;
  }
  .electricity-count-num {
    width: 20px;
    height: 20px;
    background-color: rgba(230, 230, 230, 0.3);
    text-align: center;
    line-height: 20px;
    border-radius: 4px;
    margin: 2px;
    &:last-child {
      background-color: #ff2400;
    }
  }
  .electricity-count-unit {
    color: rgba(255, 255, 255, 0.65);
  }
}
.electricity-title {
  text-align: right;
  padding-right: 30px;
  color: #49a9ee;
}
.chart-container {
  position: relative;
  display: flex;
  align-items: center;
  .icon-arrow {
    width: 20px;
    height: 50px;
    margin: 0 5px;
    cursor: pointer;
  }
  .bar-chart {
    flex: 1;
  }
}
</style>