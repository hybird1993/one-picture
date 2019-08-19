<template>
  <div class="panel-container">
    <div class="panel-title">告警视图总览</div>
    <div id="alarmbar" :style="{width: '440px', height: '270px'}"></div>
  </div>
</template>

<script>
import {API} from '../../request/api';
export default {
  name: "alarm-overview",
  mounted() {
    this.drawChart(false);
  },
  methods: {
    drawChart(isanimation) {
      let indexchart = this.$echarts.init(document.getElementById("alarmbar"));
      indexchart.setOption(
        {
          title: {
            text: ""
          },
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "rgba(255, 255, 255, 0.65)",
            fontSize: 8
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },

          legend: {},

          grid: {
            left: "3%",
            right: "2%",
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
                  width: 0.5,
                  type: "solid"
                }
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
                  width: 0.5,
                  type: "solid"
                }
              },
              data: [
                "人卡不一致告警",
                "单元门尾随告警",
                "非防人员串联告警",
                "人卡不一致告警",
                "单元门尾随告警",
                "非防人员串联告警"
              ]
            }
          ],
          series: [
            {
              type: "bar",
              barWidth: 10,
              data: [2, 6, 2, 10, 6, 11],
              itemStyle: {
                normal: {
                  color: "#fac007"
                }
              }
            }
          ],

          animation: isanimation
        },
        true
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
</style>