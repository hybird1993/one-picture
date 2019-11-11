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
      timestamp: null,
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
      if (this.timestamp && (new Date().getTime() - this.timestamp < this.time)) {
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
      this.timestamp = new Date().getTime();
      this.isFullScreen = true;
      this.$parent.fullScreen( 'specialPeople');
    },
    
    exitFullScreen() {
      this.timestamp = new Date().getTime();
      this.isFullScreen = false;
      this.$parent.fullScreenExit( 'specialPeople');
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/common.scss";
.panel-content {
  overflow: hidden;
  ul {
    margin: 0 15px;
    li {
      display: flex;
      font-size: 12px;
      padding: 6px;
      position: relative;
      text-align: left;
      cursor: pointer;
      min-height: 32px;
      border-bottom: 1px solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        display: inline-block;
        width: 21px;
        margin-right: 12px;
        padding-top: 6px;
      }
      .alarm-title {
        flex: 1;
        line-height: 21px;
      }
      .alarm-status {
        display: inline-block;
        width: 48px;
        margin-left: 12px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 6px;
        background-color: #23ffb4;
      }
      .status-alarm {
        background-color:#05758f;
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

.panel-container-fullscreen {
  ul {
    margin: 0 45px;
    li {
      font-size: 36px;
      padding: 18px;
      min-height: 96px;
      border-bottom: 3px solid rgba(50, 50, 50, 0.7);
      .alarm-index {
        width: 63px;
        margin-right: 36px;
        padding-top: 18px;
      }
      .alarm-title {
        line-height: 63px;
      }
      .alarm-status {
        width: 144px;
        margin-left: 36px;
        height: 72px;
        line-height: 72px;
        border-radius: 18px;
      }
    }
  }
}
</style>