const TimeUtil = {
  /**
   * 时间格式化
   * param {date} date 时间
   * param {string} fmt  要转化的格式  eg:yyyy-MM-dd HH:mm:ss
   * return {string} 
   */
  formatDate: (date, fmt) => {
    { //author: meizz   
      const o = {
        "M+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日   
        "h+": date.getHours(), //小时   
        "m+": date.getMinutes(), //分   
        "s+": date.getSeconds(), //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds() //毫秒   
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  },

  /**
   * 获取某一年的所有星期及某一天在第几周
   * param {number} year 年份  默认当年
   * param {date} date  日期   默认该年份的当天
   */
  getWeeksAndDayInYear: (year = new Date().getFullYear(), date = new Date()) => {
    const day = new Date(year, 0, 1).getDay(); // 该年第一天是周几
    const firstSunday = new Date(year, 0, (7 - day + 1)); // 该年第一个周日
    const list = [];
    const timeStamp = new Date(year, date.getMonth(), date.getDate()).getTime();
    let index = -1;
    list.push({
      startDate: new Date(year, 0, 1),
      endDate: firstSunday
    });
    if (new Date(year, 0, 1).getTime() <= timeStamp && timeStamp <= firstSunday.getTime()) {
      index = 1;
    }
    let catchTimeStamp = firstSunday.getTime(); // 上一个周末的时间戳
    for (let i = 2; i < 55; i++) { // 前后一天也个算一周则一年最多54周
      const startTimeStamp = catchTimeStamp + 24 * 60 * 60 * 1000;
      if (new Date(startTimeStamp).getFullYear() === year) {
        let endTimeStamp = startTimeStamp + 6 * 24 * 60 * 60 * 1000;
        if (new Date(endTimeStamp).getFullYear() > year) {
          endTimeStamp = new Date(year + 1, 0, 1).getTime() - 24 * 60 * 60 * 1000;
        }
        list.push({
          startDate: new Date(startTimeStamp),
          endDate: new Date(endTimeStamp)
        })
        if (startTimeStamp <= timeStamp && timeStamp <= endTimeStamp) {
          index = i;
        }
        catchTimeStamp = endTimeStamp;
      }
    }
    return {
      list,
      date,
      index,
      year,
    };
  },

  /**
   * 通过年份和第几周获取日期范围
   * param {number} year 年份   eg:2019
   * param {number} week 第几周  正数
   * return {object} {startDate, endDate} 
   */
  getDateRangeByWeek: (year, week) => {
    const day = new Date(year, 0, 1).getDay(); // 该年第一天是周几
    const firstSunday = new Date(year, 0, (7 - day + 1));
    const endDate = firstSunday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000;
    const startDate = endDate - 7 * 24 * 60 * 1000;
    if (new Date(startDate).getFullYear < year) {
      return {
        startDate: new Date(`${year}0101`),
        endDate: new Date(endDate)
      }
    } else if (new Date(startDate).getFullYear > year) {
      console.warning(`${year}年没有第${week}周`);
      return {
        startDate: '',
        endDate: ''
      }
    } else if (new Date(endDate).getFullYear > year) {
      let _end = new Date(year + 1, 0, 1);
      _end = _end.getTime() - 24 * 60 * 60 * 1000;
      return {
        startDate: new Date(startDate),
        endDate: new Date(_end)
      }
    } else {
      return {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    }
  },
}
export {
  TimeUtil
};