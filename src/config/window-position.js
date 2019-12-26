let windowPositionMap = new Map();
/**
 * 8       9      1     对应文档位置   1-1   1-2  1-3  1-4
 * 7              2                   2-1   2-2  2-3  2-4
 * 6    5    4    3                   3-1   3-2  3-3  3-4
 */
// 录像回放   4（3-3）   告警联动摄像头录像回放
windowPositionMap.set("videoReview", 4);
// 告警详情   5（3-2）    告警信息包括：发生时间、发生位置、摄像头编号、告警状态、告警分类、二级分类、告警内容
windowPositionMap.set("alarmDetail", 5);
// 通行记录   4（3-3）    告警相关的通行人脸抓拍图片
windowPositionMap.set("passRecords", 4);
// 串联记录   4（3-3）    展示串联的非法上访人员信息列表
windowPositionMap.set("contactRecords", 4);
// 近期行踪   3（3-4）    重点人员近期行踪列表，可以显示或关闭地图上的行踪轨迹
windowPositionMap.set("recentTrace", 3);
// 告警视频   1（1-4）    推送告警联动视频   
windowPositionMap.set("pushAlarmVideo", 1);
// 人员详情   1（1-4）    展示实有人口详细信息、家庭关系、车辆信息
windowPositionMap.set("peopleDetail", 1);
// 重点人员详情   5（3-2）重点人员详细信息
windowPositionMap.set("importantPeopleDetail", 5);
// 人员信息   4（3-3）    展示房屋住户信息列表，包括实有人口标签信息（户籍、流动、境外）、特殊人群标签信息（与WEB端一致）、姓名、联系方式、身份证号；
windowPositionMap.set("peopleInfo", 4);
// 人员列表   2（2-4）    展示综治力量详细列表，综治力量的在线情况
windowPositionMap.set("powerPeopleList", 2);
// 重点人员列表   5（3-2）    展示各类型重点人口列表
windowPositionMap.set("importantPeopleList", 5);
// 房屋用电情况   2（2-4）    房屋当天用电情况
windowPositionMap.set("houseElectricity", 2);
// 楼栋详情   5（3-2）    展示楼栋房屋分户图
windowPositionMap.set("buildingInfo", 5);
// 户型图   3（3-4）    展示房屋户型图
windowPositionMap.set("houseTile", 3);

export function getWindowPosition(type) {
  return windowPositionMap.get(type);
}

export const DEFAULT_WINDOW_LIST = [
  // 默认展示模块
  {
    name: "latestNews",
    index: 8
  },
  {
    name: "alarmOverview",
    index: 7
  },
  {
    name: "alarmList",
    index: 6
  },
  {
    name: "optionIndex",
    index: 5
  },
  {
    name: "globalIndex",
    index: 4
  },
  {
    name: "peopleHouse",
    index: 3
  },
  {
    name: "specialPeople",
    index: 2
  },
  {
    name: "generalPower",
    index: 1
  }
];
