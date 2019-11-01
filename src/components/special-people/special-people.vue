<template>
  <div class="panel-container" :class="{'panel-container-fullscreen': isFullScreen}">
    <div class="panel-title">特殊人群</div>
    <div class="panel-content">
      <transition-group
        name="flip-list-alarm"
        tag="ul"
        @mousemove.native="mouseOverEvent"
        @mouseout.native="mouseOutEvent"
      >
        <li v-for="item of list" :key="item.id" :title="item.content" @click="showDetail(item)">
          <span class="alarm-index">{{item.index}}</span>
          <span class="alarm-title">{{item.content}}</span>
          <span class="alarm-status" :class="{'status-alarm': !item.isAlreadyDeal}">{{item.status}}</span>
        </li>
      </transition-group>
    </div>
    <div v-if="!isFullScreen" class="close-item">
      <img @click="fullScreen" src="../../assets/image/icon-fullscreen.png" />
    </div>
    <div v-else class="close-item">
      <img @click="exitFullScreen" src="../../assets/image/icon-fullscreen-exit.png" />
    </div>
  </div>
</template>

<script>
import { API } from "../../request/api";
export default {
  name: "special-people",
  data() {
    return {
      list: [],
      timer: null,
      time: 1000 * 4,
      isFullScreen: false,
      isMouseOver: false,
    };
  },
  mounted() {
    this.getSpecialPeopleList();
  },
  destroyed() {
    const self = this;
    if (self.timer) {
      clearInterval(self.timer);
    }
  },
  methods: {
    getSpecialPeopleList() {
      const self = this;
      API.getSpecialPeopleList().then(
        res => {
          // console.log(res);
          self.list = res.data;
          self.list.forEach((item, index) => {
            item.index = index + 1;
            item['isAlreadyDeal'] = item.status === '已处理';
          });
          self.loop();
        },
        err => {}
      );
    },

    showDetail(item) {
      this.$emit("showSpecialPeople", item);
    },

    loop() {
      const self = this;  
      if (self.timer) {
        clearInterval(self.timer);
      }    
      self.timer = setInterval(() => {
        self.showList();
      }, self.time);
    },

    showList() {
      const self = this;
      if (this.isMouseOver) {
        return;
      }
      const item = self.list.shift();
      setTimeout(() => {
         self.list.push(item);
      }, 1000)
    },

    mouseOverEvent() {
      this.isMouseOver = true;
    },
    mouseOutEvent() {
      this.isMouseOver = false;
    },

    fullScreen() {
      this.isFullScreen = true;
      this.$parent.fullScreen( 'specialPeople');
    },
    
    exitFullScreen() {
      this.isFullScreen = false;
      this.$parent.fullScreenExit( 'specialPeople');
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  margin: 0.5rem 0;
  overflow: hidden;
  ul {
    margin: 0 1.25rem;
    li {
      display: flex;
      font-size: 1rem;
      padding: 0.5rem;
      position: relative;
      text-align: left;
      cursor: pointer;
      min-height: 4rem;
      border-bottom: 0.1rem solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        display: inline-block;
        width: 1.75rem;
        margin-right: 1rem;
        padding-top: 0.5rem;
      }
      .alarm-title {
        flex: 1;
        line-height: 1.75rem;
      }
      .alarm-status {
        display: inline-block;
        width: 4rem;
        margin-left: 1rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        border-radius: 0.5rem;
        background-color: #91a22c;
      }
      .status-alarm {
        background-color:red;
      }
    }
  }

  .flip-list-alarm-move {
    transition: transform 2s;
  }

  .flip-list-alarm-leave-active {
    transition: all 2s;
  }

  .flip-list-alarm-leave {
    opacity: 1;
    visibility: visible;
  }

  .flip-list-alarm-leave-to {
    transform: translateX(-100%);
    visibility: hidden;
    opacity: 0;
  }

  .flip-list-alarm-enter-active {
    transition: all 2s;
  }

  .flip-list-alarm-enter {
    visibility: hidden;
    opacity: 0;
  }
  
  .flip-list-alarm-enter-to {
    visibility: visible;
    opacity: 1;
  }

}
</style>