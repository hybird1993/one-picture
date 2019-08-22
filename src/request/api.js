import {
  post,
  get
} from './http';
const API = {
  /**
   * 登录
   * param {string} username  用户名
   * param {string} password  密码
   */
  login: (username, password) => post('/m/sysuser/login', {
    inputStr: username,
    password,
    codekey: 'MC4wNzc2OTcyNjM0NjA5ODA0OUNvZGUxNTEwMTIyNDAyOTY5',
    code: '28l',
    userType: '0'
  }),

  /**
   * 最新资讯
   * param {number} pn  页码
   * param {number} pageSize  每页条数
   */
  getLatestNews: (pn = 1, pageSize = 15) => get('/pscm/m/news/viewlist', {
    pn,
    pageSize
  }),

  /**
   * 人口数据
   */
  getPeopleStatistics: () => get('/pscm/m/resident/statis/focal', {}),

  /**
   * 房屋数据
   */
  getHouseStatistics: () => get('/pscm/m/resident/s/houseNum', {}),

  /**
   * 综治力量
   */
  getPowerStatistics: () => get('/pscm/m/frontpage/power', {}),

  /**
   * 告警总览
   */
  getAlarmStatistics: () => get('/pscm/m/alarm/info/statistics/count', {
    timeCondition: 'thismonth',
    bigScreen: 'yes'
  }),

  /**
   * 人口信息
   */
  getPeopleInfo: () => get('/pscm/m/dict/get/RESIDENT', {}),

  /**
   * 网格级分项指数
   * param {string} startDate  开始日期  
   * param {string} startDate  结束日期  eg:20190807
   */
  getGridOptionIndex: (startDate, endDate) => get('/pscm/m/eval/gridRank', {startDate, endDate}),
  
  /**
   * 社区级分项指数
   * param {string} startDate  开始日期  
   * param {string} startDate  结束日期  eg:20190807
   */
  getCommunityOptionIndex: (startDate, endDate) => get('/pscm/m/eval/community', {startDate, endDate}),
}
export {
  API
};