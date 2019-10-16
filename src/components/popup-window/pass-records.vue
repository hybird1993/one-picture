<template>
  <div class="panel-container">
    <div class="panel-title">通行记录</div>
    <el-scrollbar class="panel-content">
      <div class="box-title">
        <span class="text">人卡不一抓拍留影信息</span>
      </div>
      <div class="box-content-top">
        <div v-for="(item, index) of list1" class="item-person-pic" :key="index">
          <img :src="item" />
        </div>
      </div>
      <div class="box-title">
        <span class="text">{{room}}人口信息</span>
      </div>
      <div class="box-content">
        <div v-for="item of list" class="item-person" :key="item.id">
          <div class="item-person-left">
            <img :src="item.picUrl" />
          </div>
          <div class="item-person-center">
            <div class="person-info">姓名：{{item.name}}</div>
            <div class="person-info">联系方式：{{item.phone}}</div>
            <div class="person-info">身份证号：{{item.idCard}}</div>
          </div>
          <div class="item-person-right">
            <div class="custom-btn btn-small detail-btn" @click="showPeopleDetail(item)">详细信息</div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div v-if="!isFullScreen" class="fullscreen-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="fullscreen-item">
      <img @click="exitFullScreen" src="../../assets/image/icon-fullscreen-exit.png" />
    </div>
    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png" />
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "pass-records",
  props: {
    prop: {
      type: Object,
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      list: [],
      list1: [],
      room: '',
      isFullScreen: false,
    };
  },
  mounted() {
    this.showData();
  },
  methods: {
    showData() {
      const self = this;
      self.list1 = self.prop['captureImageUri'].map(item => {
        return process.env.VUE_APP_API + '/' + item;
      });
      self.getPeopleDetail(self.prop['identityCard']);
    },
    getPeopleDetail(id) {
      const self = this;
      API.getPeopleDetail(id).then(
        res => {
          if (res) {
            self.getHouseInfo(res.residentBaseId);
          } else {
            self.list = [];
          }
        },
        err => {
          self.list = [];
        }
      );
    },
    getHouseInfo(id) {
      const self = this;
      API.getHouseList(id).then(
        res => {
          if (res[0] && res[0]["houseInfo"]) {
            self.getHousePeopleList(res[0]["houseInfo"]['houseId']);
            self.room = res[0]["houseInfo"]['buildingInfo']['address'] + res[0]["houseInfo"]['doorplate'];
          } else {
          }
        },
        err => {
          self.list = [];
        }
      );
    },

    getHousePeopleList(id) {
      const self = this;
      API.getHousePeopleList(id).then(res => {
        self.list = res.map(item => {
          const person = item.residentBaseInfo;
          return {
            id: person.residentBaseId,
            name: person.name,
            idCard: person.idNo,
            phone: person.contact,
            picUrl: self.getPeopleIconUrl(person.residentBaseId),
          }
        });
      }, err => {
        self.list = [];
      })
    },

    getPeopleIconUrl(id) {
      return `${process.env.VUE_APP_API}/pscm/m/resident/base/picture/${id}`;
    },

    showPeopleDetail(item) {
      this.$parent.eventListener({
        type: "peopleDetail",
        id: item.idCard,
      });
    },

    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },
    
    fullScreen() {
      this.isFullScreen = true;
      this.$parent.eventListener({
        type: 'fullScreen',
        id: this.componentId
      });
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
       this.$parent.eventListener({
        type: 'fullScreenExit',
        id: this.componentId
      });
    },
  },
  watch: {
    prop: function(val, oldVal) {
      console.log("new: %s, old: %s", val, oldVal);
      if (oldVal && val.id !== oldVal.id) {
        this.showData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-container {
  background-image: url("../../assets/image/detail-bg.png");
  background-size: 100% 100%;
}
.panel-content {
  padding: 0.5rem 0;
}
.box-title {
  border-bottom: 0.1rem solid rgba(30, 189, 222, 0.5);
  text-align: left;
  .text {
    display: inline-block;
    height: 100%;
    padding: 0px 1.25rem 0 1.75rem;
    background-color: rgba(30, 189, 222, 0.5);
    position: relative;
    height: 2rem;
    line-height: 2rem;
    &:after {
      content: "";
      position: absolute;
      right: -2rem;
      top: 0;
      width: 0;
      border-right: 2rem solid transparent;
      border-bottom: 2rem solid rgba(30, 189, 222, 0.5);
    }
  }
}
.box-content {
  padding: 0.5rem;
  .item-person {
    display: flex;
    margin: 1.25rem 0;
    .item-person-left {
      margin-left: 1rem;
      margin-right: 1.75rem;
      img {
        width: 5rem;
        height: 5rem;
      }
    }
    .item-person-center {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .person-info {
        text-align: left;
      }
      .person-label {
        text-align: left;
        span {
          background-color: red;
          padding: 0.1rem;
          display: inline-block;
          margin: 0 0.5rem;
        }
      }
    }
    .item-person-right {
      display: flex;
      margin-right: 0.5rem;
      flex-direction: column;
      justify-content: space-around;
      .detail-btn {
        cursor: pointer;
      }
    }
  }
}

.box-content-top {
  overflow: hidden;
  min-height: 9.5rem;
  margin: 0.5rem;
  .item-person-pic {
    width: 8.5rem;
    height: 8.5rem;
    margin: 0.5rem;
    float: left;
    background: linear-gradient(to left, #1cb6d7,#1cb6d7) left top no-repeat,
    linear-gradient(to bottom, #1cb6d7, #1cb6d7) left top no-repeat,
    linear-gradient(to left, #1cb6d7, #1cb6d7) right top no-repeat,
    linear-gradient(to bottom, #1cb6d7, #1cb6d7) right top no-repeat,
    linear-gradient(to left, #1cb6d7, #1cb6d7) left bottom no-repeat,
    linear-gradient(to bottom, #1cb6d7, #1cb6d7) left bottom no-repeat,
    linear-gradient(to left, #1cb6d7, #1cb6d7) right bottom no-repeat,
    linear-gradient(to left, #1cb6d7, #1cb6d7) right bottom no-repeat;
    background-size: .25rem 2rem, 2rem .25rem, .25rem 2rem, 2rem .25rem;
    img {
      margin-top: .25rem;
      width: 8rem;
      height: 8rem;
    }
    &:hover {
      transform: scale(1.1);
      transition: all 0.5s;
    }
  }
}
</style>