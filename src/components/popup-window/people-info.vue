<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">人口信息</div>
    <el-scrollbar class="panel-content">
      <div v-for="item of list" class="item-person" :key="item.id">
        <div class="item-person-left">
          <img :src="item.picUrl" />
          <div>{{item.name}}</div>
        </div>
        <div class="item-person-center">
          <div class="person-info">联系方式：{{item.phone}}</div>
          <div class="person-info">身份证号：{{item.idCard}}</div>
          <div class="person-label">
            <span v-for="label of item.labels" :key="label">{{label}}</span>
          </div>
        </div>
        <div class="item-person-right">
          <div class="custom-btn btn-small" @click="showPeopleDetail(item)">详细信息</div>
          <div class="custom-btn btn-small" @click="getUnInportantPersonTrace(item)">显示轨迹</div>
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
// const imgUrl = require("../../assets/image/p1.png");
import { API } from "../../request/api";
import { TimeUtil } from "../../utils/time-util";
export default {
  name: "latest-news",
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
      list: [],
      isFullScreen: false,
    };
  },
  mounted() {
    this.getHousePeopleList();
    // this.list = Array.from(new Array(10)).map((item, index) => {
    //   return {
    //     id: `news${index + 1}`,
    //     name: "杨雨",
    //     idCard: "3332545876685467544",
    //     phone: "13966688866",
    //     picUrl: imgUrl,
    //     labels: ["户籍人口", "重点青少年"]
    //   };
    // });
    // this.getPeopleInfo();
  },
  methods: {
    getHousePeopleList() {
      const self = this;
      API.getHousePeopleList(self.prop).then(
        res => {
          self.list = res.map(item => {
            const person = item.residentBaseInfo;
            let labels = [];
            labels.push(person.formerName);
            if (person.ethnicity && person.ethnicity !== '无') {
              labels = labels.concat(person.ethnicity.split(','));
            }
            return {
              id: person.residentBaseId,
              name: person.name,
              idCard: person.idNo,
              phone: person.contact,
              picUrl: self.getPeopleIconUrl(person.residentBaseId),
              // TODO 多个标签是怎么返回的
              labels: labels
            };
          });
        },
        err => {
          self.list = [];
        }
      );
    },

    getUnInportantPersonTrace(item) {
      const self = this;
      const startTime = TimeUtil.formatDate(new Date((new Date().getTime() - 30 * 24 * 60 *60 * 1000)), 'yyyy-MM-dd hh:mm:ss')
      const endTime = TimeUtil.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      API.getUnInportantPersonTrace(item.idCard, startTime, endTime).then(
        res => {
          if (res.data.length > 0) {
            this.$parent.eventListener({
              type: "unImportantPersonTrace",
              data: res.data,
            });
          }
        },
        err => {
      
        }
      );
    },

    getPeopleIconUrl(id) {
      return `${process.env.VUE_APP_API}/pscm/m/resident/base/picture/${id}`;
    },

    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },

    showPeopleDetail(item) {
      this.$parent.eventListener({
        type: "peopleDetail",
        id: item.idCard,
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
      this.getHousePeopleList();
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
    margin-right: 6px;
    .item-person {
      display: flex;
      margin: 15px 0;
      .item-person-left {
        margin-left: 12px;
        margin-right: 21px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
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
            padding: 1px;
            display: inline-block;
            margin: 0 6px;
          }
        }
      }
      .item-person-right {
        display: flex;
        margin-right: 6px;
        flex-direction: column;
        justify-content: space-around;
        .custom-btn {
          cursor: pointer;
        }
      }
    }
  }
}
.panel-container-fullscreen {
  .panel-content {
    margin-right: 18px;
    .item-person {
      margin: 45px 0;
      .item-person-left {
        margin-left: 36px;
        margin-right: 63px;
        img {
          width: 180px;
          height: 180px;
        }
      }
      .item-person-center {
        .person-label {
          span {
            padding: 3px;
            margin: 0 18px;
          }
        }
      }
      .item-person-right {
        margin-right: 18px;
      }
    }
  }
}
</style>