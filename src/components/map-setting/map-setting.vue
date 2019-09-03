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
import { THEME_CONFIG } from "../../utils/theme.config";
import {
  ThemeManager,
  StarSkyTheme,
  CloudsTheme,
  ShootingstarTheme,
  StarplaitTheme
} from "../../utils/theme_manager";
import { setTimeout } from "timers";
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
    const self = this;
    self.itemList = [
      { id: "latestNews", name: "最新资讯", checked: true },
      { id: "alarmOverview", name: "告警视图总览", checked: true },
      { id: "alarmList", name: "告警信息", checked: true },
      { id: "generalPower", name: "综治力量", checked: true },
      { id: "optionIndex", name: "分项指数", checked: true },
      { id: "specialPeople", name: "特殊人口", checked: true },
      { id: "peopleHouse", name: "人口与房屋", checked: true },
      { id: "globalIndex", name: "全局指数", checked: true }
    ];
    const cacheStyle = localStorage.getItem("cacheStyle");
    if (cacheStyle) {
      const itemMap =JSON.parse(cacheStyle);
      self.itemList.forEach(item => {
        item.checked = itemMap[item.id].isShow;
      });
    }
    self.themeList = [
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
    self.initTheme();
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
        const themeId = localStorage.getItem("themeId") || "default";
        this.changeTheme({ id: themeId });
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
      const themeId = localStorage.getItem("themeId");
      if (self.activedThemeId === themeId) {
        // 如果有缓存值
        const config = JSON.parse(localStorage.getItem("themeConfig"));
        self.paramList.forEach(item => {
          self.$set(item, "value", config[item.name]);
        });
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

      const themeId = self.activedThemeId;
      self.creatThemeDiv(themeId);
      localStorage.setItem("themeId", themeId);
      // TODO 待优化
      if (themeId === "default") {
        self.isShowMapSetting = false;
        return;
      }
      self.themeManager.setThemeName(themeId);
      const themeObj = self.themeManager.getThemeObj(themeId);
      themeObj.setDom(document.getElementById("themeBox")); //传递canvas dom
      const config = {};
      self.paramList.forEach(item => {
        config[item["name"]] = item["value"];
      });
      themeObj.setOption(config); //初始化主题参数默认
      themeObj.startAnimate();
      localStorage.setItem("themeConfig", JSON.stringify(config));
      self.isShowMapSetting = false;
    },
    initTheme() {
      const self = this;
      self.themeManager = new ThemeManager();
      self.themeManager.add("starsky", new StarSkyTheme());
      self.themeManager.add("clouds", new CloudsTheme());
      self.themeManager.add("starflash", new ShootingstarTheme());
      self.themeManager.add("starplait", new StarplaitTheme());
      console.log(self.themeManager);
      const themeId = localStorage.getItem("themeId");
      if (themeId && themeId !== "default") {
        self.activedThemeId = themeId;
        self.creatThemeDiv(themeId);
        self.themeManager.setThemeName(themeId);
        const themeObj = self.themeManager.getThemeObj(themeId);
        themeObj.setDom(document.getElementById("themeBox")); //传递canvas dom
        const config = JSON.parse(localStorage.getItem("themeConfig"));
        themeObj.setOption(config); //初始化主题参数默认
        themeObj.startAnimate();
      } else {
        self.activedThemeId = "default";
      }
    },
    useBg(item, param) {
      this.$set(param, "value", item.id);
    },
    creatThemeDiv(type) {
      if (type == "clouds") {
        document.getElementById("themeContainer").innerHTML =
          '<div id="themeBox" style="width: 100%;height: 100%;"><div id="dynamic-area1" class="dynamic-area1"></div></div>';
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
  width: 25rem;
  margin-left: 50%;
  transform: translateX(-50%);

  .setting-container {
    display: flex;
    justify-content: center;
    background-color: rgba(30, 31, 42, 0.9);
    box-shadow: 0px 1.5rem 1rem 0px rgba(0, 0, 0, 0.33);
    border-bottom: #327db3 .1rem solid;
    .setting-item {
      width: 7.5rem;
      height: 5rem;
      margin: 1rem 2rem;
      background: url("../../assets/image/bg-dark.png") no-repeat;
      background-size: 7.5rem 5rem;
      cursor: pointer;
      img {
        width: 1.5rem;
        height: 2,5rem;
        margin: .5rem;
      }
    }
    .setting-item-light {
      background-image: url("../../assets/image/bg-light.png");
    }
  }
  ul {
    color: #fff;
    width: 17rem;
    border-radius: 1rem;
    margin-left: 50%;
    background: #495077;
    margin-top: .5rem;
    li {
      cursor: pointer;
      a {
        display: block;
        list-style: none;
        width: 17rem;
        height: 3rem;
        padding-left: 4rem;
        color: #fff;
        line-height: 3rem;
        border-bottom: solid .1rem rgba(255, 255, 255, 0.5);
        text-align: left;
        text-decoration: none;
        background: url("../../assets/image/icon-unchecked.png") no-repeat;
        background-size: 1.25rem 1.25rem;
        background-position: 10% 50%;
      }
      .icon-checked {
        background: url("../../assets/image/icon-checked.png") no-repeat !important;
        background-size: 1.25rem 1.25rem !important;
        background-position: 10% 50% !important;
      }
    }
  }

  .theme-container {
    position: absolute;
    padding: 2rem;
    text-align: left;
    color: #fff;
    border-radius: 1rem;
    background-color: #1e1f2a;
    left: 12.5rem;
    transform: translate(-50%);
    .theme-list {
      display: flex;
      .theme-item {
        margin: .5rem;
        position: relative;
        .actived-theme {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          border: solid .25rem #01a5db;
          height: 7rem;
          width: 100%;
          img {
            width: 3.5rem;
            height: 3rem;
            margin-left: -.1rem;
            margin-top: -.1rem;
          }
        }
        img {
          width: 12rem;
          height: 7rem;
        }
        .theme-name {
          padding: 1rem;
          text-align: center;
        }
      }
    }
    .theme-params {
      p {
        height: 3rem;
        line-height: 3rem;
        margin: 0;
        span {
          display: inline-block;
          padding: 0 1.25rem;
          background: rgba(38, 41, 59, 0.5);
        }
      }
      .param-list {
        .param-item {
          display: flex;
          padding: 1rem 1.25rem;
          align-items: center;
          background: rgba(38, 41, 59, 0.5);
          .param-name {
            width: 9rem;
          }
          .slider {
            flex: 1;
          }
          .range-value {
            display: inline-block;
            height: 3rem;
            line-height: 3rem;
            width: 4rem;
            background-color: #323b4b;
            text-align: center;
            border-radius: 2rem;
            margin-left: 2rem;
          }
          .color-list {
            display: flex;
            .bg-item {
              width: 3.5rem;
              height: 3.5rem;
              border-radius: 50%;
              margin-right: 1rem;
            }
            .used-bg {
              border: solid .1rem #01a5db;
            }
          }
        }
      }
    }
    .btn-container {
      margin-top: 1.25rem;
      display: flex;
      button {
        width: 10rem;
        color: white;
        height: 3.5rem;
        border: none;
        border-radius: 4rem;
        background: #2d334b;
        margin-right: 2rem;
        font-size: 1rem;
      }
      .private {
        background: #01a5db;
      }
    }
  }
}
</style>