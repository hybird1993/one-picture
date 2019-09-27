<template>
  <div class="panel-container">
    <div class="panel-title">{{prop.peopleType}}</div>
    <el-scrollbar class="panel-content">
      <ul v-if="prop.fromItem === 'people'" class="people-list">
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
      <ul v-if="prop.fromItem === 'power'" class="power-people-list">
        <li>
          <span class="item-name">姓名</span>
          <span class="item-grid">责任网格</span>
          <span class="item-phone">电话</span>
        </li>
        <li v-for="(item, index) of list" :key="index" :class="item.class" @click="showPeopleDetail(item)">
          <span class="item-name">{{item.realName}}</span>
          <span class="item-grid">{{item.gridNames}}</span>
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
    prop: {
      type: Object,
      default: {
        peopleType: "",
        peopleList: [],
        fromItem: ""
      }
    },
    componentId: {
      type: String
    }
  },
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    close() {
      this.$parent.eventListener({
        type: "close",
        id: this.componentId
      });
    },
    getPeopleList() {
      const self = this;
      API.getPeopleList(self.prop.peopleType).then(
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
          // console.log(self.list);
        },
        err => {}
      );
    },
    getGeneralPowerList() {
      this.list = this.prop.peopleList;
      this.list.forEach(item => {
        item.class = item.onLineState === 0 ? "li-offline" : "li-online";
      });
      // console.log(this.list);
    },
    getData() {
      if (this.prop.fromItem === "people") {
        this.getPeopleList();
      } else if (this.prop.fromItem === "power") {
        this.getGeneralPowerList();
      } else {
      }
    },
    showPeopleDetail(item) {
      this.$parent.eventListener({
        type: "peopleDetail",
        id: item.idCard,
      });
    },
  },
  watch: {
    prop: function(val, oldVal) {
      // console.log("new: %s, old: %s", val, oldVal);
      this.getData();
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
        padding-right: 0.5rem;
        position: relative;
        text-align: left;
      }
      .li-online {
        background-color: rgba(102, 179, 218, 0.6);
        &:before {
          background: #01a5db;
        }
      }
      .li-offline {
        &:before {
          background: #eee;
        }
      }
      li:nth-child(odd) {
        background-color: rgba(256, 256, 256, 0.1);
      }
    }
    .people-list {
      .item-name {
        width: 15%;
      }
      .item-address {
        width: 30%;
      }
      .item-grid {
        width: 30%;
      }
      .item-phone {
        width: 25%;
      }
    }
    .power-people-list {
      li {
        padding-left: 2.5rem;
        cursor: pointer;
        &:before {
          content: "";
          position: absolute;
          top: 1.25rem;
          margin-top: -0.35rem;
          height: 0.7rem;
          width: 0.7rem;
          margin-left: -1.35rem;
          display: block;
          border-radius: 50%;
        }
        .item-name {
          width: 25%;
          padding-left: 0.5rem;
        }
        .item-grid {
          width: 50%;
        }
        .item-phone {
          width: 25%;
        }
      }
    }
  }
}
</style>