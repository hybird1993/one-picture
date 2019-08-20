<template>
  <div class="panel-container">
    <div class="panel-title" @click="showMapSetting">指挥调度一张图</div>
    <div class="panel-content" v-if="isShowMapSetting">
      <div class="setting-container">
        <div
          class="setting-item"
          :class="{'setting-item-light': type === 'theme'}"
          @click="expandThemeSetting"
        >
          <img src="../../assets/image/bg-theme-setting.png" />
          <div>主题设置</div>
        </div>
        <div
          class="setting-item"
          :class="{'setting-item-light': type === 'window'}"
          @click="expandWindowSetting"
        >
          <img src="../../assets/image/window-setting.png" />
          <div>窗口设置</div>
        </div>
      </div>
      <ul v-if="type === 'window'">
        <li v-for="item of itemList" :key="item.id">
          <a :class="{'icon-checked': item.checked}" @click="changeItemStatus(item)">{{item.name}}</a>
        </li>
      </ul>
      <div v-if="type === 'theme'" class="theme-container">
        <div class="theme-list">
          <div
            v-for="theme of themeList"
            :key="theme.id"
            class="theme-item"
            @click="changeTheme(theme)"
          >
            <div v-if="theme.id === activedThemeId" class="actived-theme">
              <img src="../../assets/image/icon-checked-theme.png" />
            </div>
            <img :src="theme.imgUrl" />
            <div class="theme-name">{{theme.name}}</div>
          </div>
        </div>
        <div class="theme-params">
          <p>
            <span>参数设置</span>
          </p>
          <div class="param-list">
            <div class="param-item" v-for="(param, index) of paramList" :key="index">
              <template v-if="param.dataType === 'number'">
                <span class="param-name">{{param.desc}}：</span>
                <el-slider
                  v-model="param.value"
                  :min="param.min"
                  :max="param.max"
                  :show-tooltip="false"
                  class="slider"
                ></el-slider>
                <span id="plait_speed" class="range-value">{{param.value}}</span>
              </template>
              <template v-else-if="param.dataType === 'color'">
                <span class="param-name">{{param.desc}}：</span>
                <div class="color-list">
                  <div
                    class="bg-item"
                    v-for="item of param.bgcolor"
                    :key="item.id"
                    :style="{'background': item.bg}"
                    :class="{'used-bg': item.id === param.value}"
                    @click="useBg(item, param)"
                  ></div>
                </div>
              </template>
              <template v-else></template>
            </div>
          </div>
        </div>
        <div class="btn-container">
          <button class="default" @click="closeBox">取消</button>
          <button class="private" @click="saveAndStartTheme">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {THEME_CONFIG} from "../../utils/theme.config";
import {
  ThemeManager,
  StarSkyTheme,
  CloudsTheme,
  ShootingstarTheme,
  StarplaitTheme
} from "../../utils/theme_manager";
export default {
  name: "map-container",
  props: ["itemMap"],
  data() {
    return {
      type: "",
      isShowMapSetting: false,
      itemList: [],
      themeList: [],
      activedThemeId: "",
      usedBgId: "",
      themeManager: null,
      paramList: []
    };
  },
  mounted() {
    this.itemList = [
      { id: "latestNews", name: "最新资讯", checked: true },
      { id: "alarmOverview", name: "告警视图总览", checked: true },
      { id: "generalPower", name: "综治力量", checked: true },
      { id: "optionIndex", name: "分项指数", checked: true },
      { id: "houseElectricity", name: "房屋用电情况", checked: true },
      { id: "peopleHouse", name: "人口与房屋", checked: true },
      { id: "passRecords", name: "通行记录", checked: true },
      { id: "peopleInfo", name: "人口信息", checked: true }
    ];
    const cacheStyle = localStorage.getItem("cacheStyle");
    if (cacheStyle) {
      const itemMap = new Map(JSON.parse(cacheStyle));
      this.itemList.forEach(item => {
        item.checked = itemMap.get(item.id).display === "block";
      });
    }
    this.themeList = [
      "default",
      "starsky",
      "starflash",
      "clouds",
      "starplait"
    ].map(item => {
      const theme = THEME_CONFIG[item];
      return {
        id: theme.name,
        name: theme.desc,
        imgUrl: theme.descImg
      };
    });
    if (false) {
    } else {
      this.activedThemeId = "default";
    }
    this.initTheme();
  },
  methods: {
    showMapSetting() {
      this.isShowMapSetting = !this.isShowMapSetting;
    },
    changeItemStatus(item) {
      item.checked = !item.checked;
      this.$emit("changeItemStatus", this.itemList);
    },
    expandThemeSetting() {
      if (this.type === "theme") {
        this.type = "";
      } else {
        this.type = "theme";
      }
    },
    expandWindowSetting() {
      if (this.type === "window") {
        this.type = "";
      } else {
        this.type = "window";
      }
    },
    changeTheme(theme) {
      const self = this;
      self.activedThemeId = theme.id;
      const themeObj = self.themeManager.getThemeObj(self.activedThemeId); //取得所需的背景动画对象
      self.paramList = themeObj.getOptionsDefine() || [];
      if (false) {
        // 如果有缓存值
      } else {
        self.paramList.forEach(item => {
          self.$set(item, "value", item.default);
        });
      }
      console.log(this.paramList);
    },
    closeBox() {
      this.type = "";
    },
    saveAndStartTheme() {
      const self = this;
      console.log(self.activedThemeId);
      console.log(self.paramList);

      const type = self.activedThemeId;
      self.creatThemeDiv(type);
      self.themeManager.setThemeName(type);
      const themeObj = self.themeManager.getThemeObj(type);
      themeObj.setDom(document.getElementById("themeBox")); //传递canvas dom
      const config = {};
      self.paramList.forEach(item => {
        config[item["name"]] = item["value"];
      });
      themeObj.setOption(config); //初始化主题参数默认
      themeObj.startAnimate();
    },
    initTheme() {
      const self = this;
      self.themeManager = new ThemeManager();
      self.themeManager.add("starsky", new StarSkyTheme());
      self.themeManager.add("clouds", new CloudsTheme());
      self.themeManager.add("starflash", new ShootingstarTheme());
      self.themeManager.add("starplait", new StarplaitTheme());
      console.log(self.themeManager);
    },
    useBg(item, param) {
      this.$set(param, "value", item.id);
    },
    creatThemeDiv(type) {
      if (type == "clouds") {
        document.getElementById("themeContainer").innerHTML =
          '<div id="themeBox" style="width: 100%;height: 100%;"><div class="dynamic-area1"></div></div>';
      } else {
        document.getElementById("themeContainer").innerHTML =
          '<canvas id="themeBox" style="width: 100%;height: 100%;">Internet Explorer 8 Not Supported</canvas>';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-title {
  cursor: pointer;
}
.panel-content {
  width: 300px;
  margin-left: 50%;
  transform: translateX(-50%);

  .setting-container {
    display: flex;
    justify-content: center;
    background-color: rgba(30, 31, 42, 0.9);
    box-shadow: 0px 16px 10px 0px rgba(0, 0, 0, 0.33);
    border-bottom: #327db3 1.5px solid;
    .setting-item {
      width: 80px;
      height: 60px;
      font-size: 12px;
      margin: 10px 20px;
      background: url("../../assets/image/bg-dark.png") no-repeat;
      background-size: 80px 60px;
      cursor: pointer;
      img {
        width: 30px;
        height: 28px;
        margin: 5px;
      }
    }
    .setting-item-light {
      background-image: url("../../assets/image/bg-light.png");
    }
  }
  ul {
    color: #fff;
    width: 200px;
    border-radius: 10px;
    margin-left: 50%;
    background: #495077;
    margin-top: 5px;
    li {
      a {
        display: block;
        list-style: none;
        width: 200px;
        height: 35px;
        padding-left: 50px;
        color: #fff;
        line-height: 35px;
        border-bottom: solid 0.5px rgba(255, 255, 255, 0.5);
        text-align: left;
        text-decoration: none;
        font-size: 13px;
        background: url("../../assets/image/icon-unchecked.png") no-repeat;
        background-size: 15px 15px;
        background-position: 10% 50%;
      }
      .icon-checked {
        background: url("../../assets/image/icon-checked.png") no-repeat !important;
        background-size: 15px 15px !important;
        background-position: 10% 50% !important;
      }
    }
  }

  .theme-container {
    position: absolute;
    padding: 20px;
    text-align: left;
    color: #fff;
    border-radius: 10px;
    background-color: #1e1f2a;
    left: 150px;
    transform: translate(-50%);
    .theme-list {
      display: flex;
      .theme-item {
        margin: 5px;
        position: relative;
        .actived-theme {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          border: solid 3px #01a5db;
          height: 80px;
          width: 100%;
          img {
            width: 40px;
            height: 30px;
            margin-left: -1px;
            margin-top: -1px;
          }
        }
        img {
          width: 145px;
          height: 80px;
        }
        .theme-name {
          padding: 10px;
          text-align: center;
        }
      }
    }
    .theme-params {
      p {
        height: 30px;
        line-height: 30px;
        margin: 0;
        span {
          display: inline-block;
          padding: 0 15px;
          background: rgba(38, 41, 59, 0.5);
        }
      }
      .param-list {
        .param-item {
          display: flex;
          padding: 10px 15px;
          align-items: center;
          background: rgba(38, 41, 59, 0.5);
          .param-name {
            width: 100px;
          }
          .slider {
            flex: 1;
          }
          .range-value {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            width: 50px;
            background-color: #323b4b;
            text-align: center;
            border-radius: 20px;
            margin-left: 20px;
          }
          .color-list {
            display: flex;
            .bg-item {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
            }
            .used-bg {
              border: solid 1px #01a5db;
            }
          }
        }
      }
    }
    .btn-container {
      margin-top: 15px;
      display: flex;
      button {
        width: 120px;
        color: white;
        height: 40px;
        border: none;
        border-radius: 50px;
        background: #2d334b;
        margin-right: 20px;
      }
      .private {
        background: #01a5db;
      }
    }
  }
}
</style>