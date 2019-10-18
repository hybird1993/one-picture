import {
  post,
  get
} from './ajax';
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
   * 获取字典
   */
  getDict: () => get(`/pscm/m/dict/get/RESIDENT`, {
    time: new Date().getTime()
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
   * 告警信息
   * param {number} pageNum  页码
   * param {number} pageSize  每页条数
   */
  getAlarmList: (pageNum = 1, pageSize = 25) => get('/pscm/m/alarm/info/list', {
    pageNum,
    pageSize,
    alarmType: 'event,weak_elec',
    statusPriority: 'yes',
    bigScreen: 'yes'
  }),

  /**
   * 告警详情
   * param {number} id  告警id
   */
  getAlarmDetail: (id) => get(`/pscm/m/alarm/info/content/${id}`, {}),

  /**
   * 特殊人群
   * param {number} pageNum  页码
   * param {number} pageSize  每页条数
   */
  getSpecialPeopleList: (pageNum = 1, pageSize = 25) => get('/pscm/m/alarm/info/list', {
    pageNum,
    pageSize,
    alarmType: 'label_person',
    statusPriority: 'yes',
    bigScreen: 'yes'
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
   * 房屋详情
   * param {number} houseId 房屋id
   */
  getHouseDetail: (houseId) => get('/pscm/m/resident/s/house', {houseId}),

  /**
   * 房屋人口列表
   * param {number} id 居民基本信息id
   */
  getHousePicture: (id) => get(`/pscm/m/resident/base/picture/${id}`),

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
   * 人口列表
   * param {string} type 人员类型
   */
  getPeopleList: (type) => get('/pscm/m/resident/peopleInfoList', {type}),

  /**
   * 房屋列表
   * param {number} pid 人员id
   */
  getHouseList: (residentBaseId) => get(`/pscm/m/resident/houseinfolist/${residentBaseId}`, {}),

  /**
   * 人口基本信息
   * param {string | number} idno 身份证号
   */
  getPeopleDetail: (idNo) => get('/pscm/m/resident/base/baseInfo', {
    idNo
  }),

  /**
   * 人员家庭关系
   * param {number} pid 人员id
   */
  getRelationlists: (pid) => get(`/pscm/m/resident/relationlists/${pid}`, {
  }),

  /**
   * 车辆信息
   * param {string} residentBaseId 居民基本信息id
   */
  getCarInfo: (residentBaseId) => get('/pscm/m/resident/car/view', {
    residentBaseId
  }),

    /**
   * 近期行踪
   * param {string | number} idno 身份证号
   * param {string} startTime 开始时间
   */
  getRencentTrace: (idno, startTime) => get('/pscm/m/alarm/info/personal/trace', {
    idno,
    startTime
  }),

  /**
   * 网格级分项指数
   * param {string} startDate  开始日期  
   * param {string} startDate  结束日期  eg:20190807
   */
  getGridOptionIndex: (startDate, endDate) => get('/pscm/m/eval/gridRank', {
    startDate,
    endDate
  }),

  /**
   * 社区级分项指数
   * param {string} startDate  开始日期  
   * param {string} startDate  结束日期  eg:20190807
   */
  getCommunityOptionIndex: (startDate, endDate) => get('/pscm/m/eval/community', {
    startDate,
    endDate
  }),

  /**
   * 全局指数
   * param {string} startDate  结束日期  eg:20190807
   * param {number} amount 周数目 
   */
  getGlobalIndex: (endDate, amount = 12) => get('/pscm/m/eval/overallScore', {
    endDate,
    field: 'w',
    amount
  }),

  /**
   * 全局指数
   * param {string} startDate  结束日期  eg:20190807
   * param {number} amount 周数目 
   */
  getHouseElectricity: (houseId, queryTime) => get('/pscm/electricData/getElectricDataByHouseId', {
    houseId,
    queryTime,
  }),

  /**
   * 获取房屋现居住人口信息
   * param {number} houseId
   */
  getHousePeopleList: (houseId) => get('/pscm/m/resident/s/houseroh', {
    houseId,
  }),

  /**
   * 获取建筑房屋列表
   * param {number} buildId
   */
  getBuildingHouseList: (buildingId, pageNum = 1, pageSize = 10) => get('/pscm/m/resident/s/buildinghouses', {
    buildingId, 
    pageNum,
    pageSize,
  }),

  /**
   * 获取建筑平铺图
   * param {number} buildId
   */
  getBuildingTile: (buildingId) => get('/pscm/m/resident/s/buildingTile', {
    buildingId, 
  }),

  /**
   * 获取非重点人员轨迹
   * param {number} idNo 身份证号
   * param {string} startTime  yyyy-MM-dd HH:mm:ss
   * param {string} endTime  
   */
  getUnInportantPersonTrace: (idNo, startTime, endTime, pageSize = 10) => get('/pscm/m/resident/getHistoricalTrack', {
    idNo,
    startTime,
    endTime,
    pageSize,
  }),

  /** TODO
   * 模糊搜索人员
   */
  searchPeopleByKey: (key) => get('/pscm/m/resident/s/houseroh', {
    key,
  }),

  /**
   * 用户websocket连接(未使用)
   */
  getUserInfo: () => get('/pscm/m/sysuser/n/user', {
  })
};

export {
  API
};