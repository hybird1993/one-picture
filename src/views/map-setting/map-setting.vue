<template>
  <div class="panel-container">
    <div class="panel-title" @click="showMapSetting">指挥调度一张图</div>
    <div class="panel-content" v-if="isShowMapSetting">
      <div class="setting-container">
        <div
          class="setting-item"
          :class="{ 'setting-item-light': type === 'theme' }"
          @click="expandWindowSetting('theme')"
        >
          <img src="../../assets/image/bg-theme-setting.png" />
          <div>主题设置</div>
        </div>
        <div
          class="setting-item"
          :class="{ 'setting-item-light': type === 'window' }"
          @click="expandWindowSetting('window')"
        >
          <img src="../../assets/image/window-setting.png" />
          <div>窗口设置</div>
        </div>
        <div
          class="setting-item"
          :class="{ 'setting-item-light': type === 'system' }"
          @click="expandWindowSetting('system')"
        >
          <img src="../../assets/image/system-setting.png" />
          <div>主页恢复设置</div>
        </div>
      </div>
      <ul v-if="type === 'window'">
        <li>
          <a
            :class="{
              'icon-checked': isAllChecked,
              'icon-part-checked': isPartChecked
            }"
            @click="changeAllItemStatus()"
            >全部</a
          >
        </li>
        <li v-for="item of itemList" :key="item.id">
          <a
            :class="{ 'icon-checked': item.checked }"
            @click="changeItemStatus(item)"
            >{{ item.name }}</a
          >
        </li>
      </ul>
      <div v-if="type === 'theme'" class="theme-container">
        <div class="theme-list">
          <div
            v-for="theme of themeList"
            :key="theme.id"
            class="theme-item"
            @click="changeTheme(theme.id)"
          >
            <div v-if="theme.id === activedThemeId" class="actived-theme">
              <img src="../../assets/image/icon-checked-theme.png" />
            </div>
            <img :src="theme.imgUrl" />
            <div class="theme-name">{{ theme.name }}</div>
          </div>
        </div>
        <div class="theme-params">
          <p>
            <span>参数设置</span>
          </p>
          <div class="param-list">
            <div
              class="param-item"
              v-for="(param, index) of paramList"
              :key="index"
            >
              <template v-if="param.dataType === 'number'">
                <span class="param-name">{{ param.desc }}：</span>
                <el-slider
                  v-model="param.value"
                  :min="param.min"
                  :max="param.max"
                  :show-tooltip="false"
                  class="slider"
                ></el-slider>
                <span id="plait_speed" class="range-value">
                  {{ param.value }}
                </span>
              </template>
              <template v-else-if="param.dataType === 'bg'">
                <span class="param-name">{{ param.desc }}：</span>
                <div class="color-list">
                  <div
                    class="bg-item"
                    v-for="(item, index) of param.options"
                    :key="index"
                    :style="{ background: item.bg }"
                    :class="{
                      'used-bg': item.bg === param.value,
                      'is-img': item.type === 'img'
                    }"
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
      <div class="system-setting" v-if="type === 'system'">
        <div class="home-setting">
          <el-switch v-model="value1" active-color="#13ce66"></el-switch>无操作
          <select v-model="num" @change="handleChange" :disabled="!value1">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
          分钟恢复主页
        </div>
        <div class="home-setting-ctrl">
          <el-switch v-model="value2" active-color="#13ce66"></el-switch
          >Ctrl+F12恢复首页
        </div>
        <div class="btn-container">
          <button class="default" @click="closeBox">取消</button>
          <button class="private" @click="saveSystemSetting">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import { THEME_CONFIG } from "../../config/theme.config";
import { DEFALUT_THEME } from "../../config/config";
import {
  ISABLE_RESUME_HOME,
  RESUME_TIME,
  ISABLE_CTRL_RESUME_HOME
} from "../../config/config";
import StaticBg from "../../theme/staticBg/main";
import MeteorDrop from "../../theme/meteorDrop/main";
import StarPlait from "../../theme/starPlait/main";
import StarFly from "../../theme/starFly/main";
import { ThemeManager } from "../../theme/theme-manage";
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
      themeObj: null,
      paramList: [],
      isPartChecked: false,
      isAllChecked: false,
      value1: false,
      value2: false,
      num: 5,
      defalutTheme: DEFALUT_THEME
    };
  },
  mounted() {
    this.itemList = [
      { id: "latestNews", name: "最新资讯", checked: true },
      { id: "alarmOverview", name: "告警视图总览", checked: true },
      { id: "alarmList", name: "告警信息", checked: true },
      { id: "generalPower", name: "综治力量", checked: true },
      { id: "optionIndex", name: "分项指数", checked: true },
      { id: "specialPeople", name: "特殊人群", checked: true },
      { id: "peopleHouse", name: "人口与房屋", checked: true },
      { id: "globalIndex", name: "全局指数", checked: true }
    ];
    const cacheStyle = localStorage.getItem("cacheStyle");
    if (cacheStyle) {
      const itemMap = JSON.parse(cacheStyle);
      this.itemList.forEach(item => {
        item.checked = itemMap[item.id].isShow;
      });
    }
    this.setAllCheckedIconStatus();
    this.themeList = [
      "staticBg",
      "starFly",
      "meteorDrop",
      // "clouds",
      "starPlait",
    ].map(item => {
      const theme = THEME_CONFIG[item];
      return {
        id: theme.name,
        name: theme.desc,
        imgUrl: theme.descImg
      };
    });
    this.initTheme();
    this.initSystemSetting();
  },
  methods: {
    showMapSetting() {
      this.isShowMapSetting = !this.isShowMapSetting;
    },
    changeItemStatus(item) {
      item.checked = !item.checked;
      this.$emit("changeItemStatus", this.itemList);
      this.setAllCheckedIconStatus();
    },
    handleChange() {
      console.log(this.num);
    },
    initSystemSetting() {
      let homeSetting = localStorage.getItem("homeSetting");
      if (homeSetting) {
        homeSetting = JSON.parse(homeSetting);
        this.value1 = homeSetting.value1;
        this.value2 = homeSetting.value2;
        this.num = homeSetting.num;
      } else {
        this.value1 = ISABLE_RESUME_HOME;
        this.value2 = ISABLE_CTRL_RESUME_HOME;
        this.num = RESUME_TIME;
      }
    },
    saveSystemSetting() {
      const homeSetting = {
        value1: this.value1,
        value2: this.value2,
        num: this.num
      };
      localStorage.setItem("homeSetting", JSON.stringify(homeSetting));
      this.$parent.setHomeWindow();
      this.type = "";
    },
    setAllCheckedIconStatus() {
      this.isAllChecked = this.itemList.every(item => item.checked);
      const isAllUnChecked = this.itemList.every(item => !item.checked);
      this.isPartChecked = !this.isAllChecked && !isAllUnChecked;
    },
    changeAllItemStatus() {
      this.isAllChecked = !this.isAllChecked;
      this.itemList.forEach(item => {
        item.checked = this.isAllChecked;
      });
      this.$emit("changeItemStatus", this.itemList);
      this.setAllCheckedIconStatus();
    },
    expandWindowSetting(type) {
      if (this.type === type) {
        this.type = "";
      } else {
        this.type = type;
      }
      if (this.type === "theme") {
        const themeId = localStorage.getItem("themeId") || this.defalutTheme;
        this.changeTheme(themeId);
      }
    },
    changeTheme(themeId) {
      this.paramList = THEME_CONFIG[themeId]["config"];
      this.activedThemeId = themeId;
      const config =
        themeId === this.themeManager.getThemeName()
          ? this.themeObj.getConfig()
          : this.themeObj.getDefalutConfig();
      this.paramList.forEach(item => {
        this.$set(item, "value", config[item.name]);
      });
    },
    closeBox() {
      this.type = "";
    },
    saveAndStartTheme() {
      const themeId = this.activedThemeId;
      localStorage.setItem("themeId", themeId);
      this.themeManager.setThemeName(themeId);
      if (this.themeObj) {
        this.themeObj.clear();
      }
      this.themeObj = this.themeManager.getThemeObj(themeId);
      const config = {};
      this.paramList.forEach(item => {
        config[item["name"]] = item["value"];
      });
      this.themeObj.setOption(config);
      this.themeObj.draw();
      this.themeObj.startAnimate();
      localStorage.setItem("themeConfig", JSON.stringify(config));
      this.isShowMapSetting = false;
    },
    initTheme() {
      const dom = document.getElementById("themeBox");
      this.themeManager = new ThemeManager();
      this.themeManager.add("staticBg", new StaticBg(dom));
      // this.themeManager.add("clouds", new CloudsTheme(dom));
      this.themeManager.add("starFly", new StarFly(dom));
      this.themeManager.add("meteorDrop", new MeteorDrop(dom));
      this.themeManager.add("starPlait", new StarPlait(dom));
      const themeId = localStorage.getItem("themeId") || this.defalutTheme;
      this.activedThemeId = themeId;
      this.themeManager.setThemeName(themeId);
      this.themeObj = this.themeManager.getThemeObj(themeId);
      let config = {};
      if (localStorage.getItem("themeConfig")) {
        config = JSON.parse(localStorage.getItem("themeConfig"));
      } else {
        config = this.themeManager.getThemeObj(themeId).getDefalutConfig();
      }
      this.themeObj.setOption(config); //初始化主题参数默认
      this.themeObj.draw();
      this.themeObj.startAnimate();
    },
    useBg(item, param) {
      this.$set(param, "value", item.bg);
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
  width: 360px;
  margin-left: 50%;
  transform: translateX(-50%);

  .setting-container {
    display: flex;
    justify-content: center;
    background-color: rgba(30, 31, 42, 0.9);
    box-shadow: 0px 18px 12px 0px rgba(0, 0, 0, 0.33);
    border-bottom: #327db3 0.1rem solid;
    .setting-item {
      width: 90px;
      height: 60px;
      margin: 12px 12px;
      background: url("../../assets/image/bg-dark.png") no-repeat;
      background-size: 90px 60px;
      text-align: center;
      cursor: pointer;
      img {
        width: 20px;
        height: 20px;
        margin: 8px 6px 6px 6px;
      }
    }
    .setting-item-light {
      background-image: url("../../assets/image/bg-light.png");
    }
  }
  ul {
    color: #fff;
    width: 204px;
    border-radius: 12px;
    margin-left: 135px;
    background: #495077;
    margin-top: 6px;
    li {
      cursor: pointer;
      a {
        display: block;
        list-style: none;
        width: 204px;
        height: 36px;
        padding-left: 48px;
        color: #fff;
        line-height: 36px;
        border-bottom: solid 1px rgba(255, 255, 255, 0.5);
        text-align: left;
        text-decoration: none;
        background: url("../../assets/image/icon-unchecked.png") no-repeat;
        background-size: 15px 15px;
        background-position: 10% 50%;
      }
      .icon-checked {
        background: url("../../assets/image/icon-checked.png") no-repeat !important;
        background-size: 15px 15px !important;
        background-position: 10% 50% !important;
      }
      .icon-part-checked {
        background: url("../../assets/image/icon-part-checked.png") no-repeat !important;
        background-size: 15px 15px !important;
        background-position: 10% 50% !important;
      }
    }
  }

  .theme-container {
    position: absolute;
    padding: 24px;
    text-align: left;
    color: #fff;
    border-radius: 1rem;
    background-color: #1e1f2a;
    left: 150px;
    min-width: 500px;
    transform: translate(-50%);
    .theme-list {
      display: flex;
      .theme-item {
        margin: 6px;
        position: relative;
        cursor: pointer;
        .actived-theme {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          border: solid 3px #01a5db;
          height: 84px;
          width: 100%;
          img {
            width: 42px;
            height: 36px;
            margin-left: -1px;
            margin-top: -1px;
          }
        }
        img {
          width: 144px;
          height: 84px;
        }
        .theme-name {
          padding: 12px;
          text-align: center;
        }
      }
    }
    .theme-params {
      p {
        height: 36px;
        line-height: 36px;
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
          padding: 12px 15px;
          align-items: center;
          background: rgba(38, 41, 59, 0.5);
          .param-name {
            width: 108px;
          }
          .slider {
            flex: 1;
          }
          .range-value {
            display: inline-block;
            height: 36px;
            line-height: 36px;
            width: 48px;
            background-color: #323b4b;
            text-align: center;
            border-radius: 24px;
            margin-left: 24px;
          }
          .color-list {
            display: flex;
            .bg-item {
              width: 42px;
              height: 42px;
              border-radius: 50%;
              margin-right: 12px;
              cursor: pointer;
            }
            .used-bg {
              border: solid 0.1rem #01a5db;
            }
            .is-img {
              border-radius: 0;
              width: 60px;
              background-size: cover !important;
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
        height: 42px;
        border: none;
        border-radius: 48px;
        background: #2d334b;
        margin-right: 24px;
        font-size: 12px;
      }
      .private {
        background: #01a5db;
      }
    }
  }
  .system-setting {
    background-color: #1e1f2a;
    width: 300px;
    margin-left: 60px;

    .home-setting {
      padding: 18px;
      select {
        width: 40px;
        height: 24px;
      }
    }
    .home-setting-ctrl {
      padding: 0 18px 12px 18px;
    }
    .el-switch {
      margin-right: 5px;
      /deep/ .el-switch__core {
        width: 40px !important;
      }
    }
    .btn-container {
      margin-top: 6px;
      display: flex;
      padding-bottom: 12px;
      justify-content: space-around;
      button {
        width: 120px;
        color: white;
        height: 32px;
        border: none;
        border-radius: 6px;
        background: #2d334b;
        font-size: 12px;
      }
      .private {
        background: #01a5db;
      }
    }
  }
}
</style>
