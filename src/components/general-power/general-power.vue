<template>
  <div class="panel-container">
    <div class="panel-title">综治力量</div>
    <div class="panel-content">
      <div id="pieChart" :style="{width: '440px', height: '250px'}"></div>
    </div>
  </div>
</template>

<script>
import {API} from '../../request/api';
export default {
  name: "general-power",
  mounted() {
    this.drawLine(false);
  },
  methods: {
    drawLine(isanimation) {
      const self = this;
      // 绘制图表
      let myChart = self.$echarts.init(document.getElementById("pieChart"));
      myChart.setOption({
        title: {
          text: "586",
          x: "45%",
          y: "45%",
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "rgba(255, 255, 255)",
             align:"center",
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          color: "rgba(255, 255, 255, 0.65)"
        },
        legend: {
          show: false
          // orient: "vertical",
          // x: "left",
          // y: "center",
          // padding: [55, 0, 0, 0],
          // itemGap: 10,
          // itemWidth: 15,
          // itemHeight: 4,
          // textStyle: {
          //   // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          //   color: "rgba(255, 255, 255, 0.65)"
          // },
          // data: ["保安", "协警", "警察", "网格员", "自愿者"]
        },
        calculable: true,
        series: [
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
                  fontSize: 11,
                  fontWeight: "bolder"
                }
              }
            },
            color: ["#fac007", "#5551a8", "#1aa980", "#f86531", "#53c9ce"],
            data: [
              { value: 15, name: "保安" },
              { value: 10, name: "协警" },
              { value: 25, name: "警察" },
              { value: 35, name: "网格员" },
              { value: 40, name: "自愿者" }
            ]
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
.panel-content {
  padding-top: 30px;
}
</style>