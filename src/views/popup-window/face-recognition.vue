<template>
  <div class="panel-container">
    <div class="panel-title">人脸检索</div>
    <div class="panel-content">
      <div class="panel-box">
        <div class="img-upload">
          <img :src="imgUrl" />
          <input
            type="file"
            ref="file"
            class="filepath"
            @change="changepic"
            accept="image/jpg,image/jpeg,image/png,image/PNG"
          />
        </div>
        <div class="search-params">
          <div class="param-title">阈值</div>
          <div class="param-value">
            <input v-model="threshold" />
          </div>
          <div class="param-title">模式</div>
          <div class="param-value">
            <input value="列表" class="input-readonly" readonly="readonly" />
          </div>
          <button class="custom-btn btn-small" @click="searchFace">
            开始检索
          </button>
        </div>
      </div>
    </div>
    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png" />
    </div>
  </div>
</template>
<script>
import { API } from "../../request/api";
import { Util } from "../../utils/util";
import { TimeUtil } from "../../utils/time-util";
import defaultImg from "../../assets/image/icon-man.png";
export default {
  name: "face-recognition",
  props: {
    prop: {
      type: [Number, String]
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      threshold: 0.7,
      imgUrl: undefined,
      model: "list",
      searchImageData: undefined
    };
  },
  mounted() {
    this.imgUrl = defaultImg;
  },
  methods: {
    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },
    searchFace() {
      if (!this.threshold) {
        alert("请输入阈值");
        return;
      }
      if (this.threshold > 1.0) {
        alert("阈值最大值为1.00");
        return;
      }
      if (!this.searchImageData) {
        alert("请选择图片");
        return;
      }
      this.$parent.eventListener({
        type: "searchFace",
        id: this.componentId,
        data: {
          threshold: this.threshold,
          searchImageData: this.searchImageData,
          model: this.model,
          beginTime: this.getTodayStartTime(),
          endTime: this.getNowTime(),
        }
      });
      this.close();
    },
    getNowTime() {
      return TimeUtil.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
    },
    getTodayStartTime() {
      return TimeUtil.formatDate(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
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
    faceSearch() {
      API.faceSearch(
        this.searchImageData,
        this.threshold,
        "2019-12-02 00:00:00",
        "2019-12-02 13:57:05"
      ).then(
        res => {
          console.log(res);
        },
        err => {}
      );
    }
  },

  watch: {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  // background-image: url("../../assets/image/detail-bg.png");
  background-size: 100% 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .panel-content {
    .panel-box {
      display: flex;
      box-shadow: inset 0px 6px 77px 33px #03324d;
      border: solid 1px #8dd8f4;
      margin: 20px;
      padding: 20px;
      align-items: left;
      .img-upload {
        width: 115px;
        height: 150px;
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
      .search-params {
        margin-left: 20px;
        .param-title {
          color: #35c4e1;
          margin-bottom: 5px;
        }
        .param-value {
          margin-bottom: 10px;
          input {
            background-color: #068aa3;
            outline: none;
            border: none;
            height: 20px;
            padding: 2px 6px;
            color: white;
            font-size: 11px;
          }
          .input-readonly {
            background-color: #025665;
          }
        }
        button {
          color: white;
          margin-top: 10px;
          width: 120px;
        }
      }
    }
  }
}
</style>
