<template>
  <div
    class="panel-container"
    :style="style"
    ref="faceSearchContainer"
    id="faceSearchContainer"
    @mousemove="dragEvent"
    @mouseup="dragEnd"
    :class="{ 'panel-container-fullscreen': isFullScreen }"
  >
    <img src="../../assets/image/icon-box.png" class="item-box-bg" />
    <div class="panel-title" draggable="false" @mousedown="dragStart">
      人脸检索结果
    </div>
    <div class="panel-content">
      <div class="panel-box">
        <div class="search-box">
          <div class="img-upload">
            <img :src="imgUrl" />
            <input
              type="file"
              ref="file"
              class="filepath"
              @change="changepic"
              accept="image/jpg, image/jpeg, image/png, image/PNG"
            />
          </div>
          <div class="param-title">抓拍时间起</div>
          <div class="param-value">
            <!-- <input value="2017-10-12 10:00:08" type="datetime" /> -->
            <el-date-picker
              v-model="beginTime"
              type="datetime"
              :editable="false"
              :clearable="false"
              placeholder
            ></el-date-picker>
            <div class="icon-detetime">
              <img src="../../assets/image/icon-datetime.png" />
            </div>
          </div>
          <div class="param-title">抓拍时间止</div>
          <div class="param-value">
            <!-- <input value="2017-10-12 10:00:08" type="datetime" /> -->
            <el-date-picker
              v-model="endTime"
              type="datetime"
              :editable="false"
              :clearable="false"
              placeholder
            ></el-date-picker>
            <div class="icon-detetime">
              <img src="../../assets/image/icon-datetime.png" />
            </div>
          </div>
          <div class="param-title">阈值</div>
          <div class="param-value">
            <input v-model="threshold" class="threshold-input" />
          </div>
          <hr />
          <button class="custom-btn btn-small" @click="faceSearch">检索</button>
          <div class="deep-search">
            <input v-model="searchDay" />天
            <button class="custom-btn btn-small" @click="deepSearch">深度检索</button>
          </div>
        </div>
        <div class="result-box">
          <div class="pic-list" :style="{'height': scrollHeight}">
            <el-scrollbar style="width: 100%;height: 100%;">
              <div
                v-for="(item, index) in resultList"
                :key="index"
                class="result-item"
              >
                <div class="result-item-header">
                  <img src="../../assets/image/icon-pic.jpg" />
                  {{ item.captureTime }}
                </div>
                <div class="result-item-content">
                  <img :src="item.imageUrl" />
                </div>
                <div class="result-item-bottom">
                  <div>
                    <span>{{ item.location }}</span>
                    <span>({{ item.percent }})</span>
                  </div>
                  <div class="check-box">
                    <input
                      type="checkbox"
                      v-model="item.checked"
                      :value="index"
                    />
                    <span>是本人</span>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="result-bottom">
            <div class="operate-tips">
              * 请在抓拍图片下方确认是否本人，选择后点生成轨迹！
            </div>
            <button class="custom-btn btn-small" @click="createTrace">
              生成轨迹
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isFullScreen" class="fullscreen-item">
      <img
        @click.prevent="fullScreen"
        src="../../assets/image/icon-fullscreen.png"
      />
    </div>
    <div v-else class="fullscreen-item">
      <img
        @click.prevent="exitFullScreen"
        src="../../assets/image/icon-fullscreen-exit.png"
      />
    </div>
    <div class="close-item">
      <img @click.prevent="close" src="../../assets/image/icon-close.png" />
    </div>
    <div
      class="resize-item"
      ref="resizeRB"
      @mousedown="borderDragStart($event, 'resizeRB', false, true, true, false)"
    >
      <img src="../../assets/image/icon-resize.png" />
    </div>
    <div
      class="resizeL"
      ref="resizeL"
      @mousedown="borderDragStart($event, 'resizeL', false, false, false, true)"
    ></div>
    <div
      class="resizeT"
      ref="resizeT"
      @mousedown="borderDragStart($event, 'resizeT', true, false, false, false)"
    ></div>
    <div
      class="resizeR"
      ref="resizeR"
      @mousedown="borderDragStart($event, 'resizeR', false, true, false, false)"
    ></div>
    <div
      class="resizeB"
      ref="resizeB"
      @mousedown="borderDragStart($event, 'resizeB', false, false, true, false)"
    ></div>
    <div
      class="resizeLT"
      ref="resizeLT"
      @mousedown="borderDragStart($event, 'resizeLT', true, false, false, true)"
    ></div>
    <div
      class="resizeRT"
      ref="resizeRT"
      @mousedown="borderDragStart($event, 'resizeRT', true, true, false, false)"
    ></div>
    <div
      class="resizeLB"
      ref="resizeLB"
      @mousedown="borderDragStart($event, 'resizeLB', false, false, true, true)"
    ></div>
  </div>
</template>
<script>
import { API } from "../../request/api";
import { Util } from "../../utils/util";
import { TimeUtil } from "../../utils/time-util";
export default {
  name: "face-search-result",
  props: {
    prop: {
      type: Object
    }
  },
  data() {
    return {
      img: null,
      model: "list",
      searchImageData: undefined,
      beginTime: undefined,
      endTime: undefined,
      imgUrl: undefined,
      threshold: undefined,
      isFullScreen: false,
      defalutStyle: {},
      style: {},
      startStyle: {},
      resultList: [],
      startX: 0,
      startY: 0,
      isMove: false,
      isResize: false,
      el: undefined,
      isLeft: undefined,
      isTop: undefined,
      lockX: undefined,
      lockY: undefined,
      dragItem: undefined,
      disX: 0,
      disY: 0,
      searchDay: 30,
    };
  },
  mounted() {
    this.defalutStyle = {
      width: `${730 * Util.getFontSizeTimes()}px`,
      height: `${500 * Util.getFontSizeTimes()}px`,
      left: `${600 * Util.getFontSizeTimes()}px`,
      top: `${200 * Util.getFontSizeTimes()}px`
    };
    this.el = this.$refs.faceSearchContainer;
    this.exitFullScreen();
  },
  watch: {
    prop: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.initData();
    }
  },
  computed: {
    scrollHeight: function() {
      let height;
      if (this.isFullScreen) {
        height = `${document.documentElement.clientHeight - 220}px`;
      } else {
        height = `${400 * Util.getFontSizeTimes()+ parseInt(this.style.height, 10) - parseInt(this.defalutStyle.height, 10)}px`;
      }
      console.log(height);
      return height;
    }
  },
  methods: {
    close() {
      this.resultList = [];
      this.$parent.faceSearchListener({
        type: "close",
        id: this.componentId
      });
    },
    initData() {
      this.searchImageData = this.prop.searchImageData;
      this.threshold = this.prop.threshold;
      this.beginTime = this.prop.beginTime;
      this.endTime = this.prop.endTime;
      this.imgUrl = Util.base64ToImg(this.prop.searchImageData);
      this.faceSearch();
    },
    createTrace() {
      const list = this.resultList.filter(item => item.checked);
      console.log(list);
      if (this.isFullScreen) {
        this.exitFullScreen();
      }
      this.$emit("windowEvent", { type: "showTrace", data: list });
    },
    changepic() {
      const inputDom = this.$refs.file;
      const file = inputDom.files[0];
      this.imgUrl = Util.getObjectURL(file); //转成可以在本地预览的格式
      let reader = new FileReader();
      let imgFile;
      // let that = this
      reader.readAsDataURL(file);
      reader.onload = e => {
        imgFile = e.target.result;
        let arr = imgFile.split(",");
        this.searchImageData = arr[1];
        // console.log(imgFile)
        // console.log(this.datas.faceBase64)
      };
    },
    deepSearch() {
      const bol = /^\+?[1-9][0-9]*$/.test(this.searchDay);
      if (!bol) {
        this.searchDay = 30;
      }
      this.endTime = new Date().getTime();
      this.beginTime = this.endTime - 1000 * 60 * 60 * 24 * this.searchDay;
      this.faceSearch(); 
    },
    faceSearch() {
      const beginTime = TimeUtil.formatDate(
        new Date(this.beginTime),
        "yyyy-MM-dd hh:mm:ss"
      );
      const endTime = TimeUtil.formatDate(
        new Date(this.endTime),
        "yyyy-MM-dd hh:mm:ss"
      );
      this.resultList = [];
      API.faceSearch(
        this.searchImageData,
        this.threshold,
        beginTime,
        endTime
      ).then(
        res => {
          console.log(res);
          this.showResult(res.data);
        },
        err => {}
      );
    },
    showResult(data) {
      if (data.length === 0) {
        alert("无数据");
      }
      this.resultList = data.map(item => {
        item.imageUrl = Util.getImgUrl(item.imageUrl);
        item.percent = (item.score * 100).toFixed(2) + "%";
        item.checked = false;
        return item;
      });
      console.log(this.resultList);
    },
    dragStart(event) {
      if (this.isFullScreen) {
        return;
      }
      // console.log(event);
      console.log("mousedown");
      this.isMove = true;
      this.startStyle = Object.assign({}, this.style);
      this.startX = event.clientX;
      this.startY = event.clientY;
    },

    borderDragStart(event, handle, isTop, isRight, isBottom, isLeft) {
      if (this.isFullScreen) {
        return;
      }
      this.isResize = true;
      this.isLeft = isLeft;
      this.isTop = isTop;
      this.isRight = isRight;
      this.isBottom = isBottom;
      this.dragItem = this.$refs[handle];
      this.disX = event.clientX - this.dragItem.offsetLeft;
      this.disY = event.clientY - this.dragItem.offsetTop;
      this.startStyle = Object.assign({}, this.style);
      this.startX = event.clientX;
      this.startY = event.clientY;
      console.log("----------");
      console.log(this.disX, this.disY);
    },

    dragEvent(event) {
      // console.log(this.isMove)
      if (this.isMove) {
        // console.log(event);
        let left =
          parseInt(this.startStyle.left, 10) + event.clientX - this.startX;
        let top =
          parseInt(this.startStyle.top, 10) + event.clientY - this.startY;
        // console.log(event.clientX - this.startX, event.clientY - this.startY);
        const maxL = document.documentElement.clientWidth - this.el.offsetWidth;
        const maxT =
          document.documentElement.clientHeight - this.el.offsetHeight;
        left <= 0 && (left = 0);
        top <= 0 && (top = 0);
        left >= maxL && (left = maxL);
        top >= maxT && (top = maxT);
        this.$set(this.style, "left", left + "px");
        this.$set(this.style, "top", top + "px");
      } else if (this.isResize) {
        console.log("resize");
        console.log(event);
        const moveX = event.clientX - this.startX;
        const moveY = event.clientY - this.startY;
        console.log(moveX, moveY);
        let width = this.el.offsetWidth,
          height = this.el.offsetHeight,
          left = this.el.offsetLeft,
          top = this.el.offsetTop;
        console.log(left, top, width, height);
        if (this.isRight) {
          width = width + moveX;
          if (width < parseInt(this.defalutStyle.width, 10)) {
            width = this.defalutStyle.width;
          }
          if (
            width >
            document.documentElement.clientWidth - this.el.offsetLeft
          ) {
            width = document.documentElement.clientWidth - this.el.offsetLeft;
          }
        }
        if (this.isLeft) {
          width = width - moveX;
          if (width < parseInt(this.defalutStyle.width, 10)) {
            width = this.defalutStyle.width;
          }
          if (width > this.el.offsetWidth + this.el.offsetLeft) {
            width = this.el.offsetWidth + this.el.offsetLeft;
          }
          left = this.el.offsetWidth + this.el.offsetLeft - width;
        }
        if (this.isTop) {
          height = height - moveY;
          if (height < parseInt(this.defalutStyle.height, 10)) {
            height = this.defalutStyle.height;
          }
          if (height > this.el.offsetHeight + this.el.offsetTop) {
            height = this.el.offsetHeight + this.el.offsetTop;
          }
          top = this.el.offsetHeight + this.el.offsetTop - height;
        }
        if (this.isBottom) {
          height = height + moveY;
          if (height < parseInt(this.defalutStyle.height, 10)) {
            height = this.defalutStyle.height;
          }
          if (
            height >
            document.documentElement.clientHeight - this.el.offsetTop
          ) {
            height = document.documentElement.clientHeight - this.el.offsetTop;
          }
        }
        console.log(left, top, width, height);
        this.$set(this.style, "left", left + "px");
        this.$set(this.style, "top", top + "px");
        this.$set(this.style, "width", width + "px");
        this.$set(this.style, "height", height + "px");
        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    },
    dragEnd(event) {
      // console.log("mouseup");
      this.isMove = false;
      this.isResize = false;
    },
    searchFace() {},
    fullScreen() {
      this.isFullScreen = true;
      this.style = Object.assign(
        {},
        {
          width: "100%",
          height: "100%",
          left: 0,
          top: 0
        }
      );
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.style = Object.assign({}, this.defalutStyle);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  user-select: none;
  background-image: url("../../assets/image/detail-bg.png");
  background-size: 100% 100%;
  position: absolute;
  z-index: 999;
  .item-box-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .resizeL,
  .resizeR,
  .resizeT,
  .resizeB {
    position: absolute;
    z-index: 99;
  }
  .resizeL,
  .resizeR {
    width: 5px;
    top: 5px;
  }
  .resizeL {
    left: 0;
    bottom: 5px;
    cursor: w-resize;
  }
  .resizeR {
    bottom: 15px;
    right: 0;
    cursor: e-resize;
  }
  .resizeT,
  .resizeB {
    height: 5px;
    left: 5px;
  }
  .resizeT {
    top: 0;
    right: 5px;
    cursor: n-resize;
  }
  .resizeB {
    bottom: 0;
    right: 15px;
    cursor: s-resize;
  }
  .resizeLT,
  .resizeRT,
  .resizeLB {
    position: absolute;
    width: 5px;
    height: 5px;
    z-index: 99;
  }
  .resizeLT {
    top: 0;
    left: 0;
    cursor: nw-resize;
  }
  .resizeRT {
    top: 0;
    right: 0;
    cursor: ne-resize;
  }
  .resizeLB {
    left: 0;
    bottom: 0;
    cursor: sw-resize;
  }
  .resize-item {
    position: absolute;
    bottom: 0px;
    right: 0;
    height: 15px;
    width: 15px;
    cursor: se-resize;
    z-index: 99;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .panel-title {
    margin: 0 5px;
    cursor: move;
  }
  .panel-content {
    display: flex;
    flex: 1;
    font-size: 12px;
    overflow: hidden;
    .panel-box {
      display: flex;
      flex: 1;
      box-shadow: inset 0px 6px 77px 33px #03324d;
      border: solid 1px #8dd8f4;
      margin: 0 15px 15px 15px;
      padding: 5px;
      align-items: left;
      .search-box {
        margin-right: 10px;
        .img-upload {
          width: 150px;
          height: 195px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          .filepath {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
        .param-title {
          color: #35c4e1;
          margin-top: 5px;
          margin-bottom: 5px;
        }
        .param-value {
          margin-bottom: 5px;
          position: relative;
          /deep/.el-input {
            height: 24px;
            font-size: 11px;
            width: 150px;
            input {
              height: 24px;
              line-height: 24px;
              font-size: 11px;
              width: 150px;
              padding-left: 5px;
              border-radius: 1px;
              outline: none;
              border: none;
              color: white;
              background-color: #068aa3;
            }
            .el-input__prefix {
              display: none;
            }
          }
          .threshold-input {
            background-color: #068aa3;
            outline: none;
            border: none;
            height: 24px;
            padding: 2px 6px;
            width: 150px;
            color: white;
            font-size: 11px;
          }
          .icon-detetime {
            position: absolute;
            right: 0;
            top: 0;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background-color: #025665;
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
        hr {
          margin-top: 9px;
        }
        button {
          color: white;
          width: 150px;
          margin-top: 3px;
        }
        .deep-search {
          margin-top: 5px;
          input {
            width: 26px;
            margin-right: 5px;
          }
          button {
            margin-left: 3px;
            width: 100px;
          }
        }
      }
      .result-box {
        flex: 1;
        position: relative;
        .pic-list {
          // height: calc(100% - 40px);
          height: 400px;
          overflow: hidden;
          .result-item {
            width: 165px;
            margin-right: 10px;
            margin-bottom: 10px;
            border: solid 1px #8dd8f4;
            float: left;
            .result-item-header {
              height: 24px;
              line-height: 24px;
              padding-left: 5px;
              background-image: linear-gradient(
                0deg,
                #000000 0%,
                rgba(0, 0, 0, 0.23) 38%,
                rgba(255, 255, 255, 0.26) 43%,
                rgba(255, 255, 255, 0.6) 100%
              );
              font-size: 10px;
              img {
                width: 20px;
                height: 16px;
                margin-bottom: 4px;
              }
            }
            .result-item-content {
              img {
                width: 110px;
                height: 150px;
                margin-left: 27.5px;
              }
            }

            .result-item-bottom {
              padding: 5px;
              .check-box {
                display: flex;
                padding-top: 5px;
                line-height: 14px;
                input {
                  cursor: pointer;
                  margin-right: 5px;
                }
              }
            }
          }
        }
        .result-bottom {
          height: 30px;
          position: absolute;
          bottom: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          background-color: #032841;
          z-index: 1;
          width: 100%;
          .operate-tips {
            font-size: 10px;
          }
          button {
            color: white;
          }
        }
      }
    }
  }
  /deep/.el-scrollbar__thumb {
    display: none;
  }
}
.panel-container-fullscreen {
  .chart-title {
    margin: 36px;
    font-size: 36px;
  }
  .panel-content {
    font-size: 18px;
    .panel-box {
      box-shadow: inset 0px 9px 115px 49px #03324d;
      border: solid 2px #8dd8f4;
      margin: 0 22px 22px 22px;
      padding: 7px;
      .search-box {
        margin-right: 15px;
        .img-upload {
          width: 225px;
          height: 290px;
        }
        .param-title {
          margin-bottom: 7px;
        }
        .param-value {
          margin-bottom: 7px;
          /deep/.el-input {
            height: 36px;

            font-size: 16px;
            width: 225px;
            input {
              height: 36px;
              font-size: 16px;
              width: 225px;
              padding-left: 7px;
              border-radius: 2px;
            }
          }
          .threshold-input {
            height: 36px;
            padding: 3px 9px;
            width: 225px;
            font-size: 16px;
          }
          .icon-detetime {
            position: absolute;
            right: 0;
            top: 0;
            width: 36px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background-color: #025665;
            img {
              width: 24px;
              height: 24px;
            }
          }
        }
        hr {
          margin-top: 15px;
        }
        button {
          width: 225px;
          margin-top: 7px;
          font-size: 24px;
          height: 60px;
          line-height: 60px;
        }
        .deep-search {
          margin-top: 15px;
          input {
            width: 39px;
            margin-right: 7px;
            font-size: 24px;
          }
          button {
            margin-left: 5px;
            width: 150px;
            font-size: 24px;
            height: 60px;
            line-height: 60px;
          }
        }
      }
      .result-box {
        .pic-list {
          height: calc(100% - 60px);
          .result-item {
            width: 247px;
            margin-right: 15px;
            margin-bottom: 15px;
            border: solid 2px #8dd8f4;
            .result-item-header {
              height: 36px;
              line-height: 36px;
              padding-left: 7px;
              font-size: 15px;
              img {
                width: 30px;
                height: 24px;
                margin-bottom: 6px;
              }
            }
            .result-item-content {
              img {
                width: 165px;
                height: 225px;
                margin-left: 40px;
              }
            }

            .result-item-bottom {
              padding: 7px;
              .check-box {
                padding-top: 7px;
                line-height: 21px;
                input {
                  margin-right: 7px;
                  width: 21px;
                  height: 21px;
                }
              }
            }
          }
        }
        .result-bottom {
          height: 60px;
          .operate-tips {
            font-size: 15px;
          }
          button {
            font-size: 24px;
            height: 60px;
            line-height: 60px;
          }
        }
      }
    }
  }
}
</style>
