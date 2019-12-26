<template>
  <div
    class="panel-container"
    :class="{ 'panel-container-fullscreen': isFullScreen }"
  >
    <div class="panel-title">人员信息</div>
    <el-scrollbar class="panel-content">
      <ul>
        <img :src="detail.icon" class="people-icon" />
        <li>
          <span class="item-title">姓名：</span>
          <span class="item.content">{{ detail.name }}</span>
        </li>
        <li>
          <span class="item-title">曾用名：</span>
          <span class="item.content">{{ detail.formerName }}</span>
        </li>
        <li>
          <span class="item-title">身份证号：</span>
          <span class="item.content">{{ detail.idNo }}</span>
        </li>
        <li>
          <span class="item-title">出生日期：</span>
          <span class="item.content">{{ detail.birthDate }}</span>
        </li>
        <li>
          <span class="item-title">性别：</span>
          <span class="item.content">{{ detail.sexName }}</span>
        </li>
        <li>
          <span class="item-title">民族：</span>
          <span class="item.content">{{ detail.ethnicityName }}</span>
        </li>
        <li>
          <span class="item-title">政治面貌：</span>
          <span class="item.content">{{ detail.politicalStatusName }}</span>
        </li>
        <li>
          <span class="item-title">学历：</span>
          <span class="item.content">{{ detail.educationalDegreeName }}</span>
        </li>
        <li>
          <span class="item-title">婚姻状况：</span>
          <span class="item.content">{{ detail.maritalStatusName }}</span>
        </li>
        <li>
          <span class="item-title">籍贯：</span>
          <span class="item.content">{{ detail.registeredResidenceName }}</span>
        </li>
        <li>
          <span class="item-title">职业类别：</span>
          <span class="item.content">{{ detail.occupationCategoryName }}</span>
        </li>
        <li>
          <span class="item-title">职业：</span>
          <span class="item.content">{{ detail.occupation }}</span>
        </li>
        <li>
          <span class="item-title">宗教信仰：</span>
          <span class="item.content">{{ detail.religiousBeliefName }}</span>
        </li>
        <li>
          <span class="item-title">户籍地：</span>
          <span class="item.content">{{
            detail.registeredResidenceAddress
          }}</span>
        </li>
        <li>
          <span class="item-title">服务处所：</span>
          <span class="item.content">{{ detail.employer }}</span>
        </li>
        <li>
          <span class="item-title">现住地：</span>
          <span class="item.content">{{ detail.currentResidenceAddress }}</span>
        </li>
        <li>
          <span class="item-title">联系方式：</span>
          <span class="item.content">{{ detail.contact }}</span>
        </li>
        <li>
          <span class="item-title">人员标签：</span>
          <span class="item.content" style="color: #1ebdde">{{
            detail.residentType
          }}</span>
        </li>
        <li>
          <span class="item-title">现住门（楼）详址：</span>
          <span class="item.content">{{ detail.currentResidenceAddress }}</span>
        </li>
        <li>
          <span class="item-title">户籍门（楼）详址：</span>
          <span class="item.content">{{
            detail.registeredResidenceAddress
          }}</span>
        </li>
      </ul>
    </el-scrollbar>
    <div v-if="!isFullScreen" class="fullscreen-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="fullscreen-item">
      <img
        @click="exitFullScreen"
        src="../../assets/image/icon-fullscreen-exit.png"
      />
    </div>
    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png" />
    </div>
  </div>
</template>
<script>
import { API } from "../../request/api";
export default {
  name: "important-people-detail",
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
      detail: {},
      dict: {},
      isFullScreen: false
    };
  },
  mounted() {
    const self = this;
    self.getPeopleDetail();
    self.dict = self.$parent.$parent.dict; // TODO 待优化  改为vuex
  },
  methods: {
    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },
    getPeopleDetail() {
      const self = this;
      API.getPeopleDetail(this.prop).then(
        res => {
          if (res) {
            try {
              const _res = Object.assign({}, res);
              _res["sexName"] = self.dict["性别"][_res.sex];
              _res["ethnicityName"] = self.dict["民族"][_res.ethnicity];
              _res["politicalStatusName"] =
                self.dict["政治面貌"][_res.politicalStatus];
              _res["educationalDegreeName"] =
                self.dict["学历"][_res.educationalDegree];
              _res["maritalStatusName"] =
                self.dict["婚姻状况"][_res.maritalStatus];
              _res["registeredResidenceName"] =
                self.dict["行政区划"][_res.registeredResidence];
              _res["religiousBeliefName"] =
                self.dict["宗教信仰"][_res.religiousBelief];
              _res["occupationCategoryName"] =
                self.dict["职业类别"][_res.occupationCategory];
              _res["icon"] = self.getPeopleIconUrl(_res.residentBaseId);
              self.detail = _res;
            } catch (e) {
              console.log(e);
            }
          } else {
            self.detail = {};
          }
        },
        err => {
          self.detail = {};
        }
      );
    },

    getPeopleIconUrl(id) {
      return `${process.env.VUE_APP_API}/pscm/m/resident/base/picture/${id}`;
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.eventListener({
        type: "fullScreen",
        id: this.componentId
      });
    },

    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.eventListener({
        type: "fullScreenExit",
        id: this.componentId
      });
    }
  },
  watch: {
    prop: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.getPeopleDetail();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  background-image: url("../../assets/image/detail-bg.png");
  background-size: 100% 100%;
  .panel-content {
    padding: 6px 0;
    ul {
      margin: 0 15px;
      position: relative;
      .people-icon {
        width: 90px;
        height: 90px;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
      }
      li {
        display: flex;
        line-height: 30px;
        padding-right: 6px;
        position: relative;
        text-align: left;
        .item-title {
          display: inline-block;
          min-width: 120px;
          text-align: left;
          margin-left: 15px;
        }
        .item-content {
          word-break: break-all;
        }
      }
      li:nth-child(odd) {
        background-color: rgba(256, 256, 256, 0.1);
      }
    }
  }
}
.panel-container-fullscreen {
  .panel-content {
    padding: 18px 0;
    ul {
      margin: 0 45px;
      .people-icon {
        width: 270px;
        height: 270px;
      }
      li {
        line-height: 90px;
        padding-right: 18px;
        .item-title {
          min-width: 360px;
          margin-left: 45px;
        }
      }
    }
  }
}
</style>
