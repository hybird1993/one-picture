<template>
  <div class="panel-container">
    <div class="panel-title">{{peopleType}}</div>
    <el-scrollbar class="panel-content">
      <ul v-if="fromItem === 'people'">
        <li>
          <span class="item-name">姓名</span>
          <span class="item-address">现住址</span>
          <span class="item-grid">所属网格</span>
          <span class="item-phone">电话</span>
        </li>
        <li v-for="(item, index) of list" :key="index" :class="{'li-dot': !item.noDot}">
          <span class="item-name">{{item.name}}</span>
          <span class="item-address">{{item.address}}</span>
          <span class="item-grid">{{item.grid}}</span>
          <span class="item-phone">{{item.contact}}</span>
        </li>
      </ul>
      <ul v-if="fromItem === 'generalPower'">
        <li>
          <span class="item-name">姓名</span>
          <span class="item-grid-large">责任网格</span>
          <span class="item-phone">电话</span>
        </li>
        <li v-for="(item, index) of list" :key="index" :class="{'li-online': !item.onLineState}">
          <span class="item-name">{{item.realName}}</span>
          <span class="item-grid-large">{{item.gridNames}}</span>
          <span class="item-phone">{{item.mobilephone}}</span>
        </li>
      </ul>
    </el-scrollbar>

    <div class="close-item">
      <img @click="close" src="../../assets/image/icon-close.png" />
    </div>
  </div>
</template>
<script>
import { API } from "../../request/api";
export default {
  name: "people-list",
  props: {
    peopleType: {
      type: String
    },
    fromItem: {
      type: String
    },
    peopleList: {
      type: Array
    }
  },
  data() {
    return {
      list: []
    };
  },
  mounted() {
    if (this.fromItem === "people") {
      this.getPeopleList();
    } else {
      this.getGeneralPowerList();
    }
  },
  methods: {
    close() {
      this.$emit("closePeopleList");
    },
    getPeopleList() {
      const self = this;
      API.getPeopleList(self.peopleType).then(
        res => {
          self.list = res.forEach(item => {
            item.address =
              item.houseInfos && item.houseInfos[0]
                ? item.houseInfos[0]["houseAddress"]
                : "";
            item.grid =
              item.houseInfos && item.houseInfos[0]
                ? item.houseInfos[0]["gridName"]
                : "";
          });
          const _list = [];
          res.forEach(item => {
            if (item.houseInfos) {
              item.houseInfos.forEach((house, index) => {
                let _item = Object.assign({}, item, {
                  address: house.houseAddress,
                  grid: house.gridName
                });
                if (index > 0) {
                  _item = Object.assign(_item, {
                    name: "",
                    contact: "",
                    noDot: true
                  });
                }
                _list.push(_item);
              });
            } else {
              _list.push(item);
            }
          });
          self.list = _list;
          console.log(self.list);
        },
        err => {}
      );
    },
    getGeneralPowerList() {
      this.list = this.peopleList;
    }
  },
  watch: {
    peopleType: function(val, oldVal) {
      console.log("new: %s, old: %s", val, oldVal);
      if (this.fromItem === "people") {
        this.getPeopleList();
      } else {
        this.getGeneralPowerList();
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
  .panel-content {
    z-index: 1;
    padding-top: 1rem;
    padding-bottom: 1rem;
    ul {
      margin: 0 1.25rem;
      li {
        display: flex;
        line-height: 2.5rem;
        padding-left: 2rem;
        padding-right: .5rem;
        position: relative;
        text-align: left;
        // cursor: pointer;
        .item-name {
          width: 15%;
        }
        .item-address {
          width: 30%;
        }
        .item-grid {
          width: 30%;
        }
        .item-grid-large {
          width: 60%;
        }
        .item-phone {
          width: 25%;
        }
      }
      .li-online {
        background-color: rgba(102, 179, 218, 0.6);
      }
      li:nth-child(odd) {
        background-color: rgba(256, 256, 256, 0.1);
      }
    }
  }
}
</style>