import {
  post,
  get
} from './http';
const API = {
  /**
   * 最新资讯
   * params {number} pn  页码
   * params {number} pageSize  每页条数
   */
  getLatestNews: (pn = 1, pageSize = 15) => get('/pscm/m/news/viewlist', {
    pn,
    pageSize
  }),

  /**
   * 人口数据
   */
  getPeopleInfo: () => get('/pscm/m/resident/statis/focal', {}),
  /**
   * 房屋数据
   */
  getHouseInfo: () => get('/pscm/m/resident/s/houseNum', {}),

  /**
   * 登录
   */
  login: (username, password) => post('/m/sysuser/login', {
    inputStr: username,
    password,
    codekey: 'MC4wNzc2OTcyNjM0NjA5ODA0OUNvZGUxNTEwMTIyNDAyOTY5',
    code: '28l',
    userType: '0'
  }),
}
export {
  API
};