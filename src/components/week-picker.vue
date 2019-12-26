<template>
  <div
    class="week-picker-box"
    :class="{ 'week-picker-box-large': isLarge }"
    ref="weekPickerRef"
  >
    <div class="week-picker-button pre-btn" @click="preWeek"></div>
    <div class="week-picker-date" @click="openWeekSelect">
      <span class="date-year" v-if="!isWeekSelect">
        {{ year }}
      </span>
      <select class="year-select" v-model="year" v-else @change="yearChange" @blur="blur">
        <option v-for="y of yearOption" :value="y" :key="y">{{ y }}</option>
      </select>
      <span>年</span>
      <span class="date-week" v-if="!isWeekSelect">
        {{ week }}
      </span>
      <select class="week-select" v-model="week" v-else @change="weekChange" @blur="blur">
        <option v-for="w of weekOption" :value="w" :key="w">{{ w }}</option>
      </select>
      <span>周</span>
    </div>
    <div class="week-picker-button next-btn" @click="nextWeek"></div>
  </div>
</template>

<script>
import { TimeUtil } from "../utils/time-util";
export default {
  name: "week-picker",
  props: {
    pick: {
      type: Boolean,
      default: true // 是否开启点击周选择功能
    },
    date: {
      type: [String, Number]
    },
    startDate: {
      type: [String, Number]
    }, // 可选最早日期
    endDate: {
      type: [String, Number]
    }, // 可选最晚日期
    size: {
      type: String,
      default: "small" // small  large
    }
  },
  data() {
    return {
      year: undefined,
      week: undefined,
      weekList: [],
      isWeekSelect: false,
      yearOption: [],
      yearLength: 20
    };
  },
  mounted() {
    this.getWeeks();
    this.weekChange();
    this.setYearOption();
  },
  computed: {
    isLarge: function() {
      return this.size === "large";
    },
    weekOption: function() {
      const list = [];
      for (let i = 0; i < this.weekList.length; i++) {
        list.push(i + 1);
      }
      return list;
    }
  },
  destroyed() {},
  watch: {
    date: function(val, oldVal) {}
  },
  methods: {
    // 获取对应日期所在周（默认当前所在周）
    getWeeks() {
      let date;
      if (this.date) {
        date = new Date(this.date);
      } else {
        date = new Date();
      }
      const obj = TimeUtil.getWeeksAndDayInYear(date.getFullYear(), date);
      this.year = obj.year;
      this.week = obj.index;
      this.weekList = obj.list;
    },
    // 上一周
    preWeek() {
      if (this.week === 1) {
        this.year--;
        const obj = TimeUtil.getWeeksAndDayInYear();
        this.week = obj.list.length;
        this.weekList = obj.list;
      } else {
        this.week--;
      }
      this.weekChange();
    },
    // 下一周
    nextWeek() {
      if (this.week === this.weekList.length) {
        this.year++;
        const obj = TimeUtil.getWeeksAndDayInYear();
        this.week = 1;
        this.weekList = obj.list;
      } else {
        this.week++;
      }
      this.weekChange();
    },
    // 周改变
    weekChange() {
      const params = {
        year: this.year,
        week: this.week,
        dateScope: this.weekList[this.week - 1]
      };
      this.$emit("change", params);
      setTimeout(() => {
        this.isWeekSelect = false;
      }, 10);
    },
    // 年改变
    yearChange() {
      const obj = TimeUtil.getWeeksAndDayInYear(this.year);
      this.weekList = obj.list;
      if (this.weekList.length < this.week) {
        // 周数不足跳转至第一周
        this.week = 1;
      }
      this.weekChange();
    },
    // 打开周选择
    openWeekSelect() {
      if (!this.pick) {
        return;
      }
      this.isWeekSelect = true;
    },
    setYearOption() {
      const year = new Date().getFullYear();
      // const year = 2200;
      for (let i = this.yearLength - 1; i >= 0; i--) {
        // for(let i = 240; i >= 0; i--) {
        this.yearOption.push(year - i);
      }
    },
    blur() {
      setTimeout(() => {
        this.isWeekSelect = false;
      }, 10);
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin arrow {
  content: "";
  position: absolute;
  display: inline-block;
  width: 8px;
  height: 1px;
  left: 8px;
  background-color: white;
}
@mixin arrow-large {
  content: "";
  position: absolute;
  display: inline-block;
  width: 28px;
  height: 4px;
  left: 20px;
  background-color: white;
}
$height: 20px;
$height-large: 60px;
.week-picker-box {
  color: white;
  position: relative;
  display: flex;
  height: $height;
  background-color: #068aa3;
  border-radius: 2px;
  .week-picker-button {
    background-color: #006071;
    border-radius: 2px;
    color: white;
    width: 22px;
    cursor: pointer;
    text-align: center;
    line-height: $height;
    height: $height;
    position: relative;
  }
  .next-btn::before {
    @include arrow;
    top: 7px;
    transform: rotate(35deg);
  }
  .next-btn::after {
    @include arrow;
    top: 12px;
    transform: rotate(-35deg);
  }
  .pre-btn::before {
    @include arrow;
    top: 12px;
    transform: rotate(35deg);
  }
  .pre-btn::after {
    @include arrow;
    top: 7px;
    transform: rotate(-35deg);
  }
  .week-picker-date {
    text-align: center;
    height: $height;
    line-height: $height;
    padding-right: 5px;
    cursor: pointer;
    .date-year {
      display: inline-block;
      text-align: center;
      width: 36px;
    }
    .date-week {
      display: inline-block;
      text-align: center;
      width: 22px;
    }
    select {
      outline: none;
      border: none;
      margin-right: 5px;
      height: $height;
      line-height: $height;
      font-size: 12px;
    }
    .year-select {
      width: 54px;
    }
    .week-select {
      width: 38px;
      margin-left: 5px;
    }
  }
}
.week-picker-box-large {
  height: $height-large;
  border-radius: 6px;
  .week-picker-button {
    border-radius: 6px;
    width: 66px;
    line-height: $height-large;
    height: $height-large;
  }
  .next-btn::before {
    @include arrow-large;
    top: 21px;
  }
  .next-btn::after {
    @include arrow-large;
    top: 36px;
  }
  .pre-btn::before {
    @include arrow-large;
    top: 36px;
  }
  .pre-btn::after {
    @include arrow-large;
    top: 21px;
  }
  .week-picker-date {
    height: $height-large;
    line-height: $height-large;
    padding-right: 15px;
    .date-year {
      width: 108px;
    }
    .date-week {
      width: 66px;
    }
    select {
      margin-right: 15px;
      font-size: 36px;
      line-height: $height-large;
      height: $height-large;
    }
    .year-select {
      width: 120px;
    }
    .week-select {
      width: 75px;
      margin-left: 15px;
    }
  }
}
</style>
