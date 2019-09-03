<template>
  <div class="panel-container">
    <div class="panel-title">综治力量</div>
    <div class="panel-content">
      <div id="pieChart" :style="{width: '100%', height: '100%'}"></div>
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "general-power",
  data() {
    return {
      powerChart: null
    };
  },
  mounted() {
    this.initChart();
    this.getPowerStatistics();
  },
  methods: {
    initChart() {
      const self = this;
      // 绘制图表
      self.powerChart = self.$echarts.init(document.getElementById("pieChart"));
      self.powerChart.on("click", function(params) {
        console.log(params);
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
          self.powerChart.setOption(self.setChartOption(data, total));
        },
        err => {}
      );
    },
    setChartOption(data = [], total) {
      const fontsize = document.getElementsByTagName("html")[0].style.fontSize;
      const times = parseInt(fontsize, 10) / 12;
      return {
        title: {
          text: total,
          x: "center",
          y: "center",
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "rgba(255, 255, 255)",
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
                 fontSize: Math.round(12 * times),
                  fontWeight: "bolder"
                }
              }
            },
            color: ["#fac007", "#5551a8", "#1aa980", "#f86531", "#53c9ce"],
            data: data
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
.panel-content {
  padding-top: 30px;
}
</style>