/**
 * //=================================================================
 * //========================地图核心操作类=============================
 * //=================================================================
 * //=================================================================
 */

// ==============地图基础数据图层
var map = null; // 地图容器
var baseLayer = null; // 底图
var bussLayer = null; // 业务图层
var gridLayer = null; // 网格

// ==============业务事件模块使用的地图图层
var importantLayer = null; // 重点人员
var cameraLayer = null; // 摄像头-视频监控
var dymLayer = null;//人脸识别单元门图层
var dmLayer = null;//人脸识别大门图层
var otherIotLayer = null;//其他物联网感知设备
var energyLayer = null; // 警力
var alarmLayer = null; // 告警事件

// ==============综治力量模块使用的地图图层
var policeLayer = null; // 警察
var auxiliaryPoliceLayer = null; // 协警
var gridManLayer = null; // 网格员
var policeCarLayer = null; // 警车
var policeKioskLayer = null; // 警营亭
var securityStaffLayer = null; // 保安
var volunteerLayer = null; // 志愿者

// ==============特殊人群模块使用的地图图层
var routeLayer = null; // 特殊人群行踪轨迹图层

// ==============以图搜图
var blackLayer = null; // 以图搜图行踪轨迹图层

// ==============搜索框气泡
var locateLayer = null;

var blackIds = [];

var SPJK_DM = ["MJ-003","MJ-004","RLSB-01","RLSB-02","RLSB-07","RLSB-08","RLSB-09","RLSB-10","RLSB-11","RLSB-12"];

var highlightMarker = null;//高亮的图标

$(function () {

  $("input,button").on("click", function (e) {
    e.stopPropagation();
  });

  //========================================地图初始化===========================
  // 初始化地图容器
  map = L.map('viewDiv', {
    // center: [30.430076485018596, 114.41137433052064], // 公司
    center: [30.44326443351204, 114.43944445432024], // 佛祖岭
    // zoom: 18,
    zoom: 14,
    maxBounds: [[29.9666558418404279, 113.7004008688582957], [31.3612494982628114, 115.0808047302495396]],
    zoomControl: false
  });

  // 添加基础影像图层
  baseLayer = L.tileLayer.arcgis(TOMCAT_URL + 'map/佛祖岭谷歌电子/_alllayers/{z}/{y}/{x}.png', {
    maxZoom: 21,
    minZoom: 13
  });

  bussLayer = L.supermap.tiledMapLayer(SUPERMAP_URL + "iserver/services/map-NewOneMap/rest/maps/一张图", {
    zIndex: 2,
    transparent: true,
    maxZoom: 24,
    minZoom: 13
  }).addTo(map);

  // 网格图层
  gridLayer = L.featureGroup();

  // 综治力量图层
  policeLayer = L.featureGroup();
  auxiliaryPoliceLayer = L.featureGroup();
  gridManLayer = L.featureGroup();
  policeCarLayer = L.featureGroup();
  policeKioskLayer = L.featureGroup();
  securityStaffLayer = L.featureGroup();
  volunteerLayer = L.featureGroup();

  // 业务事件图层
  importantLayer = L.featureGroup();
  cameraLayer = L.featureGroup();//视频监控摄像头
  dymLayer = L.featureGroup();//人脸识别单元门图层
  dmLayer = L.featureGroup();//人脸识别大门图层
  otherIotLayer = L.featureGroup();//其他物联网感知设备



  map.addLayer(cameraLayer);
  energyLayer = L.featureGroup();
  alarmLayer = L.featureGroup();

  // 特殊人群图层
  routeLayer = L.featureGroup();

  // 以图搜图
  blackLayer = L.featureGroup();

  locateLayer = L.featureGroup();
  map.addLayer(locateLayer);

  // 获取token值并写入当前的cookie中
  var auth_token = getQueryString("auth-token");
  if (auth_token != null && auth_token != undefined && auth_token != "") {
    document.cookie = "auth-token=" + auth_token + ";Path=/";
  }

  // 获取是否显示调度人员
  var dispatch = getQueryString("dispatch");
  if (dispatch != null && dispatch == "false") {
    $(".menuText").html("居民/房屋");
    $(".dropdown-menu li:eq(0)").hide();
    $(".faceRecognition button:eq(1)").hide();
  }

  $(".callContent").on("click", function () {
    $(this).hide();
  });

  // 地图初始化数据
  initLayer("camera");
  initLayer("grid");

  $('.dropdown-toggle').dropdown();

  //========================================end===================================

  //=====================================地图事件=============================
  // 图层点击自动查询
  map.on("click", function (e) {
    identifyBuilding(e);
  });
  map.on("zoom", function () {
    if (map.getZoom() > 19) {
      $(".popIcon.alarm").css({
        "background-image": "url(images/alarm2.png)",
        "width": "48px",
        "height": "48px",
        "background-size": "48px 48px"
      });
      $(".popIcon.alarm .num").css({
        "height": "24px",
        "font-size": "14px"
      });
    } else {
      $(".popIcon.alarm").css({
        "background-image": "url(images/alarm.png)",
        "width": "36px",
        "height": "36px",
        "background-size": "36px 36px"
      });
      $(".popIcon.alarm .num").css({
        "height": "20px",
        "font-size": "12px"
      })
    }
  });
  //========================================end===============================

  //=====================================地图底图切换==========================
  $("#mapType .map").on("click", function () {
    map.removeLayer(baseLayer);
    baseLayer = L.tileLayer(TOMCAT_URL + 'map/佛祖岭谷歌电子/_alllayers/{z}/{y}/{x}.png', {
      maxZoom: 21,
      minZoom: 13
    }).addTo(map);
    map.addLayer(baseLayer);
    $("#mapType .mapTypeCard").removeClass("active");
    $(this).addClass("active");
  });

  $("#mapType .satelite").on("click", function () {
    map.removeLayer(baseLayer);
    baseLayer = L.tileLayer(TOMCAT_URL + 'map/佛祖岭谷歌卫星/_alllayers/{z}/{y}/{x}.png', {
      maxZoom: 21,
      minZoom: 13
    }).addTo(map);
    map.addLayer(baseLayer);
    $("#mapType .mapTypeCard").removeClass("active");
    $(this).addClass("active");
  });
  //=====================================end==========================

  //=======================================基础地图图层控制=======================
  $("input,button").on("click", function (e) {
    e.stopPropagation();
  });

  $(".title").on("click", function (e) {
    $(".subtitle").slideUp();
    $(this).next().slideDown();
    e.stopPropagation();
  });

  // 网格图层
  $("#grid").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(gridLayer);
      if (gridLayer.getLayers().length > 0) {
        map.flyToBounds(gridLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(gridLayer);
    }
  });
  $("#baseMap").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(baseLayer);
    } else {
      map.removeLayer(baseLayer);
    }
  });
  $("#bussMap").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(bussLayer);
    } else {
      map.removeLayer(bussLayer);
    }
  });

  //==========================================end=========================

  //=====================================特殊人群======================
  // 行径路线
  $("#route").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(routeLayer);
      if (routeLayer.getLayers().length > 0) {
        map.flyToBounds(routeLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(routeLayer);
    }
  });
  //=============================================end======================================


  //===========================================综治力量===================================
  // 警察
  $("#police").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(policeLayer);
      if (policeLayer.getLayers().length > 0) {
        map.flyToBounds(policeLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(policeLayer);
    }
  });
  // 协警
  $("#auxiliaryPolice").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(auxiliaryPoliceLayer);
      if (auxiliaryPoliceLayer.getLayers().length > 0) {
        map.flyToBounds(auxiliaryPoliceLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(auxiliaryPoliceLayer);
    }
  });
  // 网格员
  $("#gridMan").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(gridManLayer);
      if (gridManLayer.getLayers().length > 0) {
        map.flyToBounds(gridManLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(gridManLayer);
    }
  });
  // 警车
  $("#policeCar").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(policeCarLayer);
      if (policeCarLayer.getLayers().length > 0) {
        map.flyToBounds(policeCarLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(policeCarLayer);
    }
  });
  //警营亭
  $("#policeKiosk").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(policeKioskLayer);
      if (policeKioskLayer.getLayers().length > 0) {
        map.flyToBounds(policeKioskLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(policeKioskLayer);
    }
  });
  // 保安
  $("#securityStaff").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(securityStaffLayer);
      if (securityStaffLayer.getLayers().length > 0) {
        map.flyToBounds(securityStaffLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(securityStaffLayer);
    }
  });
  // 志愿者
  $("#volunteer").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(volunteerLayer);
      if (volunteerLayer.getLayers().length > 0) {
        map.flyToBounds(volunteerLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(volunteerLayer);
    }
  });
  //======================================end======================

  //================================业务事件==============
  // 重点人员
  $("#important").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(importantLayer);
      if (importantLayer.getLayers().length > 0) {
        map.flyToBounds(importantLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(importantLayer);
    }
  });
  // 摄像头-视频监控
  $("#spjkCamera").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(cameraLayer);
      if (cameraLayer.getLayers().length > 0) {
        map.flyToBounds(cameraLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(cameraLayer);
    }
  });
  // 人脸识别大门
  $("#spjkDm").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(dmLayer);
      if (dmLayer.getLayers().length > 0) {
        map.flyToBounds(dmLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(dmLayer);
    }
  });
   // 人脸识别单元门
   $("#spkjDym").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(dymLayer);
      if (dymLayer.getLayers().length > 0) {
        map.flyToBounds(dymLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(dymLayer);
    }
  });
  // 其他物联网设备
  $("#otherIot").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(otherIotLayer);
      if (otherIotLayer.getLayers().length > 0) {
        map.flyToBounds(otherIotLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(otherIotLayer);
    }
  });
  // 警力
  $("#energy").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(energyLayer);
      if (energyLayer.getLayers().length > 0) {
        map.flyToBounds(energyLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(energyLayer);
    }
  });
  // 告警事件
  $("#alarm").on("click", function () {
    if ($(this).prop("checked")) {
      map.addLayer(alarmLayer);
      if (alarmLayer.getLayers().length > 0) {
        map.flyToBounds(alarmLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
      }
    } else {
      map.removeLayer(alarmLayer);
    }
  });
  //================================end======================

  //====================下拉选择框查询======================
  $(".searchDiv .dropdown-menu a").on("click", function () {
    $(".searchDiv .menuText").html($(this).html());
  });


  // 即时搜索
  // $("#searchText").on("input propertychange", function () {
  //     if ($(this).val().trim() != "") {
  //         $(".clearSearch").show();
  //     } else {
  //         $(".clearSearch").hide();
  //     }
  //     keySearch();
  // });

  // 输入完成搜索
  var flag = true;
  $('#searchText').on('compositionstart', function () {
    flag = false;
  });
  $('#searchText').on('compositionend', function () {
    flag = true;
  });
  $('#searchText').on('input', function () {
    var _this = this;
    setTimeout(function () {
      if (flag) {
        flag = false;
        if ($(_this).val().trim() != "") {
          $(".clearSearch").show();
        } else {
          $(".clearSearch").hide();
        }
        setTimeout(function () {
          flag = true;
        }, 100);
        keySearch();
      }
    }, 100)
  });

  // 聚焦
  $("#searchText").on("focus", function () {
    $(".searchContent").show();
  });

});

/**
 * 初始化图层
 * @param layerType 图层类型 required
 * @param data 附带的数据 optional
 */
function initLayer(layerType, data) {

  // 如果接受的是json字符串将其转换为json对象
  if (data != "" && typeof(data) === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      ;
    }
  }
  if (layerType === "camera") {
    var param = new SuperMap.QueryBySQLParameters({
      queryParams: {
        name: "佛祖岭摄像头@device",
        attributeFilter: "1=1"
      }
    });
    L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
      var result = serviceResult.result;
      if (result.totalCount == 0) {
        return false;
      }
      var record = result.recordsets[0].features.features;
      record.forEach(function (feature) {

        if (feature.properties.TYPE === "车行道闸") {
          var icon = L.divIcon({
            html: "<div class='popIcon cxdz'></div>"
          });
          var marker = L.marker([feature.properties.LAT, feature.properties.LON], {icon: icon})
            .bindPopup(getPopupTemplate("车行道闸信息", "<P>编号：" + feature.properties.NO + "</P>"
              + "<P>名称：" + feature.properties.NAME + "</P>"
              + "<P>地址：" + feature.properties.ADDRESS + "</P>"
              + "<P>类别：" + feature.properties.TYPE + "</P>"
              + "<p style='display: none'>" + feature.properties.BRAND + "</p>"), {className: "popTable"});
              otherIotLayer.addLayer(marker);
        } else if (feature.properties.TYPE === "感烟火灾探测器") {
          var icon = L.divIcon({
            html: "<div class='popIcon gyhztcq'></div>"
          });
          var marker = L.marker([feature.properties.LAT, feature.properties.LON], {icon: icon})
            .bindPopup(getPopupTemplate("感烟火灾探测器信息", "<P>编号：" + feature.properties.NO + "</P>"
              + "<P>名称：" + feature.properties.NAME + "</P>"
              + "<P>地址：" + feature.properties.ADDRESS + "</P>"
              + "<P>类别：" + feature.properties.TYPE + "</P>"
              + "<p style='display: none'>" + feature.properties.BRAND + "</p>"), {className: "popTable"});
              otherIotLayer.addLayer(marker);
        } else if (feature.properties.TYPE === "可视对讲门禁" || feature.properties.TYPE === "人脸识别门禁") {
          var icon = L.divIcon({
            html: "<div class='popIcon mj'></div>"
          });
          var marker = L.marker([feature.properties.LAT, feature.properties.LON], {icon: icon})
            .bindPopup(getPopupTemplate("门禁信息", "<P>编号：" + feature.properties.NO + "</P>"
              + "<P>名称：" + feature.properties.NAME + "</P>"
              + "<P>地址：" + feature.properties.ADDRESS + "</P>"
              + "<P>类别：" + feature.properties.TYPE + "</P>"
              + "<p style='display: none'>" + feature.properties.BRAND + "</p>"), {className: "popTable"});
          if($.inArray(feature.properties.NO,SPJK_DM) == -1) {
            cameraLayer.addLayer(marker);
          }else dmLayer.addLayer(marker);
        } else if (feature.properties.TYPE === "周界防盗传感器") {
          var icon = L.divIcon({
            html: "<div class='popIcon zjfdcgq'></div>"
          });
          var marker = L.marker([feature.properties.LAT, feature.properties.LON], {icon: icon})
            .bindPopup(getPopupTemplate("周界防盗传感器信息", "<P>编号：" + feature.properties.NO + "</P>"
              + "<P>名称：" + feature.properties.NAME + "</P>"
              + "<P>地址：" + feature.properties.ADDRESS + "</P>"
              + "<P>类别：" + feature.properties.TYPE + "</P>"
              + "<p style='display: none'>" + feature.properties.BRAND + "</p>"), {className: "popTable"});
              otherIotLayer.addLayer(marker);
        } else if (feature.properties.TYPE === "手动火灾报警按钮") {
          var icon = L.divIcon({
            html: "<div class='popIcon sdhzbj'></div>"
          });
          var marker = L.marker([feature.properties.LAT, feature.properties.LON], {icon: icon})
            .bindPopup(getPopupTemplate("手动火灾报警按钮信息", "<P>编号：" + feature.properties.NO + "</P>"
              + "<P>名称：" + feature.properties.NAME + "</P>"
              + "<P>地址：" + feature.properties.ADDRESS + "</P>"
              + "<P>类别：" + feature.properties.TYPE + "</P>"
              + "<p style='display: none'>" + feature.properties.BRAND + "</p>"), {className: "popTable"});
              otherIotLayer.addLayer(marker);
        } else if (feature.properties.TYPE === "RFID基站") {
          var icon = L.divIcon({
            html: "<div class='popIcon rfid'></div>"
          });
          var marker = L.marker([feature.properties.LAT, feature.properties.LON], {icon: icon})
            .bindPopup(getPopupTemplate("RFID信息", "<P>编号：" + feature.properties.NO + "</P>"
              + "<P>名称：" + feature.properties.NAME + "</P>"
              + "<P>地址：" + feature.properties.ADDRESS + "</P>"
              + "<P>类别：" + feature.properties.TYPE + "</P>"
              + "<p style='display: none'>" + feature.properties.BRAND + "</p>"), {className: "popTable"});
              otherIotLayer.addLayer(marker);
        } else {
          var icon = L.divIcon({
            html: "<div class='popIcon camera'></div>"
          });
          var marker = L.marker([feature.properties.LAT, feature.properties.LON], {icon: icon})
            .bindPopup(getPopupTemplate("摄像头信息", "<P>编号：" + feature.properties.NO + "</P>"
              + "<P>名称：" + feature.properties.NAME + "</P>"
              + "<P>地址：" + feature.properties.ADDRESS + "</P>"
              + "<P>类别：" + feature.properties.TYPE + "</P>"
              + "<p style='display: none'>" + feature.properties.BRAND + "</p>"
              + "<p><a onclick='openCamera(this);'>打开摄像头</a></P>"), {className: "popTable"});
          if($.inArray(feature.properties.NO,SPJK_DM) == -1) {
            if(feature.properties.NO.indexOf("RLSB") == -1) {
              cameraLayer.addLayer(marker);
            }else{
              if(feature.properties.NAME.indexOf("单元") == -1) cameraLayer.addLayer(marker);
              else dymLayer.addLayer(marker);
            }
          }else dmLayer.addLayer(marker);
        }
      })
    })
  } else if (layerType === "grid") {
    $.get(baseUrl + "m/frontpage/layer?layers=GRIDER", function (data) {
      data.GRIDER.forEach(function (feature) {
        if (feature.region != null) {
          var rings = [];
          feature.region.split(";").forEach(function (lngLat) {
            rings.push([parseFloat(lngLat.split(',')[1]), parseFloat(lngLat.split(',')[0])]);
          });
          var polyline = L.polyline(rings, {stroke: true, color: '#FF00FF'});
          // 网格员
          var gridMan = feature.griders.length > 0 ? feature.griders[0] : {realName: "", mobilephone: ""};
          polyline.bindPopup(getPopupTemplate("网格信息", "<p>网格编号：" + feature.gridId + "</p>"
            + "<p>网格名称：" + feature.gridName + "</p>"
            + "<p>网格员：" + gridMan.realName + "</p>"
            + "<p>联系电话：" + gridMan.mobilephone + "</p>"
            + "<p>网格覆盖楼栋：" + feature.buildings + "</p>"), {className: "popTable"});
          gridLayer.addLayer(polyline);
        }
      })
    })
  } else if (layerType === "important") {
    // $.get("http://172.29.1.20/m/alarm/info/labels/latest?startTime=2018-04-25 00:00:00", function (data) {

    importantLayer.clearLayers();
    var deviceNoMap = {}; // 存储设备的编号，如果有重复，要适当偏移坐标
    data.forEach(function (info) {
      if (info.status === "未处理") {
        var no = info.alarmLocation.split("/")[2]; // 设备编号
        var captureImageUri = info.captureImageUri ? info.captureImageUri[0].replace("pscm/", "") : ''; // 抓拍的图片
        var icon = L.divIcon({
          html: "<div class='importantPopup' style='background-image: url(" + baseUrl + captureImageUri + ")'></div>",
        });
        // 查询坐标
        var param = new SuperMap.QueryBySQLParameters({
          queryParams: {
            name: "佛祖岭摄像头@device",
            attributeFilter: "no='" + no + "'"
          }
        });
        L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
          var result = serviceResult.result;
          if (result.totalCount == 0) {
            return false;
          }
          if (deviceNoMap[no] == undefined) {
            deviceNoMap[no] = 1;
          } else {
            deviceNoMap[no]++;
          }
          var feature = result.recordsets[0].features.features[0].properties;
          var longitude = parseFloat(feature.LON) + 0.000010458 * 5 * (deviceNoMap[no] - 1); // 同一个地方计算偏移
          var latitude = parseFloat(feature.LAT);
          var marker = L.marker([latitude, longitude], {icon: icon})
            .bindPopup(getPopupTemplate("重点人员信息",
              "<p>姓名：" + info.relationPerson + "</p>"
              + "<p>身份证：" + info.identityCard + "</p>"
              + "<p>出现时间：" + info.alarmTime + "</p>"
              + "<p>出现地址：" + info.alarmLocation.split('/')[0] + "</p>"), {className: "importantTable important_" + info.id});
          importantLayer.addLayer(marker);
        });
      }
    });
    // });
  } else if (layerType === "important_route") {
    // $.get("http://172.29.1.20:8080/m/alarm/info/personal/trace?startTime=2018-04-09%2012:00:00&idno=420115200407252811", function (data) {

    routeLayer.clearLayers();
    var multiCoords = []; // 采集点的坐标
    var deviceNo = []; // 所有设备的编号信息
    var deviceNoAndCoords = {}; // 设备与坐标的匹配关系
    data.forEach(function (info) {
      if (info.alarmLocation.split("/").length == 3) {
        deviceNo.push(info.alarmLocation.split("/")[2]);
      }
    });
    var queryWhere = "";
    deviceNo.forEach(function (no) {
      queryWhere += "'" + no + "',";
    });
    if (deviceNo.length > 0) {
      queryWhere = queryWhere.substring(0, queryWhere.length - 1); // 去掉最后一个,
    }
    // 查询所有设备的坐标
    var param = new SuperMap.QueryBySQLParameters({
      queryParams: {
        name: "佛祖岭摄像头@device",
        attributeFilter: "no in (" + queryWhere + ")"
      }
    });
    L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
      var result = serviceResult.result;
      if (result.totalCount == 0) {
        return false;
      }
      result.recordsets[0].features.features.forEach(function (feature) {
        deviceNoAndCoords[feature.properties.NO] = [feature.properties.LAT, feature.properties.LON];
      });
      var deviceNoMap = {};
      // 整合数据
      data.forEach(function (info) {
        // 获取坐标
        if (info.alarmLocation.split("/").length == 3) {
          var no = info.alarmLocation.split("/")[2];
          if (deviceNoMap[no] == undefined) {
            deviceNoMap[no] = 1;
          } else {
            deviceNoMap[no]++;
          }
          var deviceCoord = deviceNoAndCoords[no];
          if (deviceCoord != undefined) {
            var longitude = parseFloat(deviceCoord[1]) + 0.000010458 * 5 * (deviceNoMap[no] - 1); // 同一个地方计算偏移
            var latitude = parseFloat(deviceCoord[0]);

            // 添加line的坐标
            multiCoords.push([latitude, longitude]);
            // 添加头像
            var icon = L.divIcon({
              html: "<div class='routeDiv'>" +
              "<img src='" + baseUrl + info.captureImageUri[0].split("pscm/")[1] + "'><span>" + info.content.split(" ")[1] + "</span>" +
              "</div>"
            });
            var marker = L.marker([latitude, longitude], {icon: icon});
            if (info.fullImageUri != null && info.fullImageUri != undefined) {
              marker.bindPopup("<img width='720px' height='auto' style='margin-bottom: 5px;' src='" + baseUrl + info.fullImageUri[0].split("pscm/")[1] + "'>", {className: "captureImage"});
            }
            routeLayer.addLayer(marker);
          }
        }
      });

      // 添加直线
      routeLayer.addLayer(L.polyline(multiCoords, {color: "#EE4000"}));

      multiCoords.reverse();// 时间逆序

      // 添加箭头
      routeLayer.addLayer(L.polylineDecorator(multiCoords, {
        patterns: [
          {
            offset: 0,
            repeat: 100,
            symbol: L.Symbol.arrowHead({
              pixelSize: 15,
              pathOptions: {color: "#EE4000", fillOpacity: 1, weight: 0}
            })
          }
        ]
      }));

      map.addLayer(routeLayer);

      map.flyToBounds(L.polygon(multiCoords).getBounds(), {animate: true, padding: L.point(50, 50)});

      $("#route").prop("checked", true);
    });
    // });
  } else if (layerType === "alarm") {
    // $.get("http://172.29.1.20/m/alarm/info/nopage/list?status=未处理&alarmType=event&bigScreen=yes&startTime=2018-04-26%2015:00:00", function (data) {

    alarmLayer.clearLayers();
    // var deviceNoMap = {}; // 存储设备的编号，如果有重复，要适当偏移坐标
    // data.forEach(function (info) {
    //     if (info.status === "未处理") {
    //         if (info.alarmLocation != null) {
    //             var no = info.alarmLocation.split("/")[2]; // 设备编号
    //             var icon = L.divIcon({
    //                 html: "<div class='popIcon alarm'></div>"
    //             });
    //             // 查询坐标
    //             var param = new SuperMap.QueryBySQLParameters({
    //                 queryParams: {
    //                     name: "佛祖岭摄像头@device",
    //                     attributeFilter: "no = '" + no + "'"
    //                 }
    //             });
    //             L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
    //                 var result = serviceResult.result;
    //                 if (result.totalCount == 0) {
    //                     return false;
    //                 }
    //                 if (deviceNoMap[no] == undefined) {
    //                     deviceNoMap[no] = 1;
    //                 } else {
    //                     deviceNoMap[no]++;
    //                 }
    //                 var feature = result.recordsets[0].features.features[0].properties;
    //                 var longitude = parseFloat(feature.LON) + 0.000010458 * 5 * (deviceNoMap[no] - 1); // 同一个地方计算偏移
    //                 var latitude = feature.LAT;
    //                 var marker = L.marker([latitude, longitude], {icon: icon})
    //                     .bindPopup(getPopupTemplate("报警信息",
    //                         "<p>报警位置：" + info.alarmLocation.split("/")[0] + "</p>"
    //                         + "<p>报警时间：" + info.alarmTime + "</p>"
    //                         + "<p>报警内容：" + info.alarmDesc + "</p>"
    //                         + "</table>"), {className: "popTable alarm_" + info.id});
    //                 alarmLayer.addLayer(marker);
    //             });
    //         }
    //     }
    // });
    // });

    $.map(data, function (item, key) {
      var no = key.split("/")[2];
      var infos = item.data;
      var total = item.total;
      // 查询坐标
      var param = new SuperMap.QueryBySQLParameters({
        queryParams: {
          name: "佛祖岭摄像头@device",
          attributeFilter: "no = '" + no + "'"
        }
      });
      L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
        var result = serviceResult.result;
        if (result.totalCount == 0) {
          return false;
        }
        var feature = result.recordsets[0].features.features[0].properties;
        var longitude = feature.LON;
        var latitude = feature.LAT;
        var icon;
        if (total == 1) {
          icon = L.divIcon({
            html: "<div class='popIcon alarm'></div>"
          });
        } else if (total > 20) {
          icon = L.divIcon({
            html: "<div class='popIcon alarm'><div class='num'>20+</div></div>"
          });
        } else {
          icon = L.divIcon({
            html: "<div class='popIcon alarm'><div class='num'>" + total + "</div></div>"
          });
        }
        var ul = "";
        infos.forEach(function (info, index) {
          ul += "<div>" + (index + 1) + "、" + info.alarmTime + "&nbsp;" + info.alarmDesc + "</div>";
        });
        if (total > 20) {
          ul += "<div>请在【佛祖岭街道社区信息平台】查询全部告警信息。</div>";
        }
        ul = "<div class='list'>" + ul + "</div>";
        var marker = L.marker([latitude, longitude], {icon: icon})
          .bindPopup(getPopupTemplate("报警信息",
            "<p>报警位置：" + key.split("/")[0] + "</p>" + ul
          ), {className: "popTable alarm_" + no});
        alarmLayer.addLayer(marker);
      });
    });


  } else if (layerType === "power") {
    $.get(baseUrl + "m/frontpage/power", function (data) {

      gridManLayer.clearLayers();
      policeLayer.clearLayers();
      auxiliaryPoliceLayer.clearLayers();
      securityStaffLayer.clearLayers();
      volunteerLayer.clearLayers();

      data.forEach(function (info) {
        if (info.groupName === "网格员") {
          info.users.forEach(function (user) {
            $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
              if (location.latitude != undefined && location.longitude != undefined) {
                var icon = L.icon({
                  iconUrl: (user.onLineState == 0 ? "images/gridman_1.png" : "images/gridman.png"),
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40]
                });
                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("网格员信息",
                  "<p>网格员：" + user.realName + "</p>"
                  + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                  + "<p>身份证：" + checkNull(user.idcard) + "</p>"
                  + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                  + "<p>所属网格：" + user.gridNames + "</p>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                  + "</button>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                  + "</button>"), {className: "gridman_" + user.userId});
                gridManLayer.addLayer(marker);
              }
            })
          });
        } else if (info.groupName === "警察") {
          info.users.forEach(function (user) {
            $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
              if (location.latitude != undefined && location.longitude != undefined) {
                var icon = L.icon({
                  iconUrl: (user.onLineState == 0 ? "images/police_1.png" : "images/police.png"),
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40]
                });
                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("警察信息",
                  "<p>警察：" + user.realName + "</p>"
                  + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                  + "<p>身份证：" + checkNull(user.idcard) + "</td></tr>"
                  + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                  + "<p>所属网格：" + user.gridNames + "</p>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                  + "</button>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                  + "</button>"), {className: "police_" + user.userId});
                policeLayer.addLayer(marker);
              }
            })
          });
        } else if (info.groupName === "协警") {
          info.users.forEach(function (user) {
            $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
              if (location.latitude != undefined && location.longitude != undefined) {
                var icon = L.icon({
                  iconUrl: (user.onLineState == 0 ? "images/auxiliaryPolice_1.png" : "images/auxiliaryPolice.png"),
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40]
                });
                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("协警信息",
                  "<p>协警：" + user.realName + "</p>"
                  + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                  + "<p>身份证：" + checkNull(user.idcard) + "</p>"
                  + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                  + "<p>所属网格：" + user.gridNames + "</p>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                  + "</button>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                  + "</button>"), {className: "auxiliaryPolice_" + user.userId});
                auxiliaryPoliceLayer.addLayer(marker);
              }
            })
          });
        } else if (info.groupName === "保安") {
          info.users.forEach(function (user) {
            $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
              if (location.latitude != undefined && location.longitude != undefined) {
                var icon = L.icon({
                  iconUrl: (user.onLineState == 0 ? "images/security_1.png" : "images/security.png"),
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40]
                });
                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("保安信息",
                  "<p>保安：" + user.realName + "</p>"
                  + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                  + "<p>身份证：" + checkNull(user.idcard) + "</p>"
                  + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                  + "<p>所属网格：" + user.gridNames + "</p>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                  + "</button>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                  + "</button>"), {className: "security_" + user.userId});
                securityStaffLayer.addLayer(marker);
              }
            })
          });
        } else if (info.groupName === "志愿者") {
          info.users.forEach(function (user) {
            $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
              if (location.latitude != undefined && location.longitude != undefined) {
                var icon = L.icon({
                  iconUrl: (user.onLineState == 0 ? "images/volunteer_1.png" : "images/volunteer.png"),
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40]
                });
                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("志愿者信息",
                  "<p>志愿者：" + user.realName + "</p>"
                  + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                  + "<p>身份证：" + checkNull(user.idcard) + "</p>"
                  + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                  + "<p>所属网格：" + user.gridNames + "</p>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                  + "</button>"
                  + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                  + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                  + "</button>"), {className: "volunteer_" + user.userId});
                volunteerLayer.addLayer(marker);
              }
            });
          });
        }
      });
    });
  } else if (layerType === "blacklist") {

    var idno = data[0].idno;
    if ($.inArray(idno, blackIds) != -1) {
      closeLayer(idno);
    } else {
      blackIds.push(idno);
    }

    var multiCoords = []; // 采集点的坐标
    var deviceNo = []; // 所有设备的编号信息
    var deviceNoAndCoords = {}; // 设备与坐标的匹配关系
    data.forEach(function (info) {
      if (info.location.split("/").length == 3) {
        deviceNo.push(info.location.split("/")[2]);
      }
    });
    var queryWhere = "";
    deviceNo.forEach(function (no) {
      queryWhere += "'" + no + "',";
    });
    if (deviceNo.length > 0) {
      queryWhere = queryWhere.substring(0, queryWhere.length - 1); // 去掉最后一个,
    }
    // 查询所有设备的坐标
    var param = new SuperMap.QueryBySQLParameters({
      queryParams: {
        name: "佛祖岭摄像头@device",
        attributeFilter: "no in (" + queryWhere + ")"
      }
    });
    L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
      var result = serviceResult.result;
      if (result.totalCount == 0) {
        return false;
      }
      result.recordsets[0].features.features.forEach(function (feature) {
        deviceNoAndCoords[feature.properties.NO] = [feature.properties.LAT, feature.properties.LON];
      });
      var deviceNoMap = []; // 存储设备的编号

      // 随机生成一个guid
      // var uuid = makeGUID();
      var uuid = idno;

      // 整合数据
      data.reverse().forEach(function (info, index) {
        // 获取坐标
        if (info.location.split("/").length == 3) {

          var no = info.location.split("/")[2];

          if (deviceNoMap.indexOf(no) == -1) {
            deviceNoMap.push(no);
            var deviceCoord = deviceNoAndCoords[no];

            var longitude = parseFloat(deviceCoord[1]);
            var latitude = parseFloat(deviceCoord[0]);

            // 添加line的坐标
            multiCoords.push([latitude, longitude]);
            // 添加头像
            var icon = L.divIcon({
              html: "<div class='routeDiv'>" +
              "<img style='cursor: default' src='" + baseUrl + info.imageUrl.split("pscm/")[1] + "'>" +
              "<span style='cursor: default;'>" + info.captureTime.split(" ")[1] + "</span>" +
              (index == 0 ? "<img code='" + uuid + "' onclick='closeBlank(this)' class='closeBtn'>" : "") +
              "</div>",
              className: 'mutliPath_' + uuid
            });
            var marker = L.marker([latitude, longitude], {icon: icon})
              .bindPopup("<img width='720px' height='auto' style='margin-bottom: 5px;' src='" + baseUrl + info.fullImageUrl.split("pscm/")[1] + "'>", {className: "captureImage"});

            blackLayer.addLayer(marker);
          }
        }
      });

      var color = getColor();

      // 添加直线
      blackLayer.addLayer(L.polyline(multiCoords, {color: color, className: 'mutliPath_' + uuid}));

      // 添加箭头
      blackLayer.addLayer(L.polylineDecorator(multiCoords, {
        patterns: [
          {
            offset: 0,
            repeat: 100,
            symbol: L.Symbol.arrowHead({
              pixelSize: 15,
              pathOptions: {color: color, fillOpacity: 1, weight: 0}
            })
          }
        ], className: 'mutliPath_' + uuid
      }));
      map.addLayer(blackLayer);
      map.flyToBounds(L.polygon(multiCoords).getBounds(), {animate: true, padding: L.point(50, 50)});
    });
  }
}

/**
 * 图层修改
 * @param layerType
 */
function updateLayer(layerType, data) {
  if (layerType === "important_route") {
    map.removeLayer(routeLayer); // 取消显示
    $("#route").prop("checked", false);
  } else if (layerType === "alarm") {
    if (data.alarmType === "重点人员报警") {

      // var idCard = data.identityCard;
      // importantLayer.eachLayer(function (layer) {
      //   var html = $(layer.getPopup().getContent()).find(".popBody").html();
      //   if (html.indexOf(idCard) != -1) {
      //     layer.remove();
      //     return false;
      //   }
      // });

      importantLayer.clearLayers();

      var no = data.alarmLocation.split("/")[2]; // 设备编号
      var captureImageUri = data.captureImageUri[0].replace("pscm/", ""); // 抓拍的图片
      var icon = L.divIcon({
        html: "<div class='importantPopup' style='background-image: url(" + baseUrl + captureImageUri + ")'></div>",
      });
      // 查询坐标
      var param = new SuperMap.QueryBySQLParameters({
        queryParams: {
          name: "佛祖岭摄像头@device",
          attributeFilter: "no='" + no + "'"
        }
      });
      L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
        var result = serviceResult.result;
        if (result.totalCount == 0) {
          return false;
        }
        var feature = result.recordsets[0].features.features[0].properties;
        var longitude = parseFloat(feature.LON); // 同一个地方计算偏移
        var latitude = parseFloat(feature.LAT);
        var marker = L.marker([latitude, longitude], {icon: icon})
          .bindPopup(getPopupTemplate("重点人员信息",
            "<p>姓名：" + data.relationPerson + "</p>"
            + "<p>身份证：" + data.identityCard + "</p>"
            + "<p>出现时间：" + data.alarmTime + "</p>"
            + "<p>出现地址：" + data.alarmLocation.split('/')[0] + "</p>"), {className: "importantTable important_" + data.id});
        importantLayer.addLayer(marker);
        map.addLayer(importantLayer);
        $("#important").prop("checked", true);
        marker.openPopup();
        map.flyTo(marker.getLatLng(), 21, {animate: true}); // 居中
      });
    } else {
      // 取消之前的闪缩
      alarmLayer.eachLayer(function (layer) {
        // 如果是相同的位置，则删掉之前的
        var location = $(layer.getPopup().getContent()).find("tr").eq(0).find("td").eq(1).html();
        if (location === data.alarmLocation.split("/")[0]) {
          alarmLayer.removeLayer(layer);
        } else {
          layer.setIcon(L.divIcon({
            html: "<div class='popIcon alarm'></div>"
          }));
        }
      });
      // 添加最新的一个告警
      var no = data.alarmLocation.split("/")[2]; // 设备编号
      var icon = L.divIcon({
        html: "<div class='popIcon alarm blink-fast'></div>"
      });
      // 查询坐标
      var param = new SuperMap.QueryBySQLParameters({
        queryParams: {
          name: "佛祖岭摄像头@device",
          attributeFilter: "no='" + no + "'"
        }
      });
      L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
        var result = serviceResult.result;
        if (result.totalCount == 0) {
          return false;
        }
        var feature = result.recordsets[0].features.features[0].properties;
        var longitude = feature.LON;
        var latitude = feature.LAT;
        var marker = L.marker([latitude, longitude], {icon: icon})
          .bindPopup(getPopupTemplate("最新报警信息",
            "<p>报警位置：" + data.alarmLocation.split("/")[0] + "</p>"
            + "<p>报警时间：" + data.alarmTime + "</p>"
            + "<p>报警内容：" + data.alarmDesc + "</p>"), {className: "popTable"});
        alarmLayer.addLayer(marker);
        map.addLayer(alarmLayer);
        $("#alarm").prop("checked", true);
        marker.openPopup();
        map.flyTo(marker.getLatLng(), 21, {animate: true}); // 居中
      });
    }
  }
}

/**
 * 居中重点人员
 */
function centerImportant(data) {
  if (data != "" && typeof(data) === "string") {
    data = eval("(" + data + ")");
  }
  if (!map.hasLayer(importantLayer)) {
    map.addLayer(importantLayer);
    $("#important").prop("checked", true);
  }
  // 找到要素定位
  // importantLayer.eachLayer(function (layer) {
  //     var className = layer.getPopup().options.className;
  //     if (className.indexOf("important_" + data.id) != -1) {
  //         layer.openPopup();
  //         map.panTo(layer.getLatLng(), {animate: true});
  //         return false;
  //     }
  // });
  // 找到要素删除
  // var idCard = data.identityCard;
  // importantLayer.eachLayer(function (layer) {
  //   var html = $(layer.getPopup().getContent()).find(".popBody").html();
  //   if (html.indexOf(idCard) != -1) {
  //     layer.remove();
  //     return false;
  //   }
  // });

  importantLayer.clearLayers();
  // 重新添加定位
  var no = data.alarmLocation.split("/")[2]; // 设备编号
  var captureImageUri = data.captureImageUri ? data.captureImageUri[0].replace("pscm/", "") : ''; // 抓拍的图片
  var icon = L.divIcon({
    html: "<div class='importantPopup' style='background-image: url(" + baseUrl + captureImageUri + ")'></div>",
  });
  // 查询坐标
  var param = new SuperMap.QueryBySQLParameters({
    queryParams: {
      name: "佛祖岭摄像头@device",
      attributeFilter: "no='" + no + "'"
    }
  });
  L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-Device/rest/maps/佛祖岭").queryBySQL(param, function (serviceResult) {
    var result = serviceResult.result;
    if (result.totalCount == 0) {
      return false;
    }
    var feature = result.recordsets[0].features.features[0].properties;
    var longitude = parseFloat(feature.LON);
    var latitude = parseFloat(feature.LAT);
    var marker = L.marker([latitude, longitude], {icon: icon})
      .bindPopup(getPopupTemplate("重点人员信息",
        "<p>姓名：" + data.relationPerson + "</p>"
        + "<p>身份证：" + data.identityCard + "</p>"
        + "<p>出现时间：" + data.alarmTime + "</p>"
        + "<p>出现地址：" + data.alarmLocation.split('/')[0] + "</p>"), {className: "importantTable important_" + data.id});
    importantLayer.addLayer(marker);
    marker.openPopup();
    map.panTo(marker.getLatLng(), {animate: true});
  });
}

/**
 * 居中告警位置
 * @param data
 */
function centerAlarm(data) {
  if (data != "" && typeof(data) === "string") {
    data = eval("(" + data + ")");
  }
  if (!map.hasLayer(alarmLayer)) {
    map.addLayer(alarmLayer);
    $("#alarm").prop("checked", true);
  }
  alarmLayer.eachLayer(function (layer) {
    var className = layer.getPopup().options.className;
    //if (className.indexOf("alarm_" + data.id) != -1) {
    if (className.indexOf("alarm_" + data.alarmLocation.split("/")[2]) != -1) {
      map.panTo(layer.getLatLng(), {animate: true});
      return false;
    }
  });
}

/**
 * 刷新综治力量
 * @param data
 */
function refreshPower(data) {
  initLayer("power", data);
}

/**
 * 居中综治力量人员
 * @param obj
 */
function centerPower(data) {
  if (data != "" && typeof(data) === "string") {
    data = eval("(" + data + ")");
  }
  if (data.groupName === "网格员") {
    if (!map.hasLayer(gridManLayer)) {
      map.addLayer(gridManLayer);
      $("#gridMan").prop("checked", true);
    }
    gridManLayer.eachLayer(function (layer) {
      var className = layer.getPopup().options.className;
      if (className === "gridman_" + data.userId) {
        layer.openPopup();
        map.panTo(layer.getLatLng(), {animate: true});
        return false;
      }
    });
  } else if (data.groupName === "警察") {
    if (!map.hasLayer(policeLayer)) {
      map.addLayer(policeLayer);
      $("#police").prop("checked", true);
    }
    policeLayer.eachLayer(function (layer) {
      var className = layer.getPopup().options.className;
      if (className === "police_" + data.userId) {
        layer.openPopup();
        map.panTo(layer.getLatLng(), {animate: true});
        return false;
      }
    });
  } else if (data.groupName === "协警") {
    if (!map.hasLayer(auxiliaryPoliceLayer)) {
      map.addLayer(auxiliaryPoliceLayer);
      $("#auxiliaryPolice").prop("checked", true);
    }
    auxiliaryPoliceLayer.eachLayer(function (layer) {
      var className = layer.getPopup().options.className;
      if (className === "auxiliaryPolice_" + data.userId) {
        layer.openPopup();
        map.panTo(layer.getLatLng(), {animate: true});
        return false;
      }
    });
  } else if (data.groupName === "保安") {
    if (!map.hasLayer(securityStaffLayer)) {
      map.addLayer(securityStaffLayer);
      $("#securityStaff").prop("checked", true);
    }
    securityStaffLayer.eachLayer(function (layer) {
      var className = layer.getPopup().options.className;
      if (className === "security_" + data.userId) {
        layer.openPopup();
        map.panTo(layer.getLatLng(), {animate: true});
        return false;
      }
    });
  } else if (data.groupName === "志愿者") {
    if (!map.hasLayer(volunteerLayer)) {
      map.addLayer(volunteerLayer);
      $("#volunteer").prop("checked", true);
    }
    volunteerLayer.eachLayer(function (layer) {
      var className = layer.getPopup().options.className;
      if (className === "volunteer_" + data.userId) {
        layer.openPopup();
        map.panTo(layer.getLatLng(), {animate: true});
        return false;
      }
    });
  }
}

/**
 * 关闭以图搜图轨迹
 */
function closeBlank(obj) {
  var uuid = $(obj).attr("code");
  closeLayer(uuid);
}

function closeLayer(uuid) {
  blackLayer.eachLayer(function (layer) {
    var className = "";
    var icon = layer._icon;
    if (icon != null) {
      className = icon.className;
    } else {
      var path = layer._path;
      if (path != null) {
        className = path.className.baseVal;
      } else {
        className = layer.options.className;
      }
    }
    //var className = (icon != null) ? icon.className : layer._path.className.baseVal;
    if (className.indexOf("mutliPath_" + uuid) != -1) {
      blackLayer.removeLayer(layer);
      return false;
    }
  });
}

/**
 * 人脸识别搜索
 */
function searchMessage() {
  sendUIMessage("人脸检索", "");
}

/**
 * 群组对讲
 */
function callPhone() {
  sendUIMessage("获取对讲组列表", "");
  $(".callContent").show();
}

/**
 * 点击识别楼栋信息
 */
function identifyBuilding(e) {
  var latlng = e.latlng;
  var point = L.CRS.EPSG3857.project(L.latLng(latlng.lat, latlng.lng));
  var param = new SuperMap.QueryByGeometryParameters({
    queryParams: {name: "B区楼栋@manager"},
    geometry: point,
    expectCount: 1,
    networkType: SuperMap.GeometryType.REGION,
    queryOption: SuperMap.QueryOption.ATTRIBUTEANDGEOMETRY,
    spatialQueryMode: SuperMap.SpatialQueryMode.INTERSECT
  });
  L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-PeaceComm/rest/maps/综治平台").queryByGeometry(param, function (serviceResult) {
    if (serviceResult.result.totalCount != 0) {
      var feature = serviceResult.result.recordsets[0].features.features[0].properties;
      L.popup().setLatLng(latlng).setContent(
        getPopupTemplate("楼栋基础信息", "<p>街道:" + feature.DISTRICT + "</p>" +
          "<p>社区:" + feature.COMMUNITY + "</p>" +
          "<p>楼栋名称:" + feature.BUILDNO + "</p>")
      ).openOn(map);
      sendUIMessage("查看建筑", {id: feature.OBJECTID, district: feature.DISTRICT, community: feature.COMMUNITY, buildno: feature.BUILDNO});//sendUIMessage("查看建筑", feature.NAME);
    }
  });
}

/**
 * 自定义气泡模板
 * @param title 气泡标题
 * @param content 气泡内容html
 * @returns {string}
 */
function getPopupTemplate(title, content) {
  return "<div class='popContent'>" +
    "<div class='popHead'><div class='popTitle'>" + title + "</div></div>" +
    "<div class='popBody'>" + content + "</div>" +
    "<div class='popFoot'></div>" +
    "</div>";
}

/**
 * 打开摄像头
 * @param obj
 */
function openCamera(feature) {
  var name = $(feature).parent().prev().html();
  sendUIMessage("视频信息", name);
}

/**
 * 搜索框
 */
function keySearch() {
  var type = $("#searchType").find(".menuText").text();
  var text = $("#searchText").val().trim();

  if (text === "") {
    $(".searchContent ul").empty();
    return true;
  }

  if (type === "调度人员") {
    sendUIMessage("搜索调度人员", text); // 搜索调度人员
  } else {
    $.get(baseUrl + "m/frontpage/key?key=" + encodeURI(text), function (data) {
      if (isEmptyObject(data)) {
        $(".searchContent ul").empty();
      } else {
        $(".searchContent ul").empty();
        $.each(data, function (key, value) {
          if (key === "RESIDENT") {
            for (var i = 0; i < value.length; i++) {
              var person = value[i]; // 人
              var houses = person.houses; // 对应房屋
              houses.forEach(function (house) {
                var houseInfo = house.houseInfo;
                var html = "<li>" +
                  "<a code='" + house.houseId + "' onclick=\"showPerson(this)\">" + person.name + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>" +
                  "<span>" + houseInfo.buildingInfo.fullBuildingName + "/" + houseInfo.unitNumber + "单元" + "/" +
                  houseInfo.floorNumber + leftPad(houseInfo.houseNumber, 2) + "</span>" +
                  "</li>";
                $(".searchContent ul").append(html);
              })


            }
          } else if (key === "BUILDING") {
            for (var i = 0; i < value.length; i++) {
              var building = value[i]; // 楼栋
              var html = " <li>" +
                "<a onclick=\"showBuilding(this)\">" + building.fullBuildingName + "</a>" +
                "</li>";
              $(".searchContent ul").append(html);
            }
          }
        });
      }
    })
  }
}

/**
 * 调度人员接口回调
 * @param data
 */
function fillSearchContent(data) {
  if (data != "" && typeof(data) === "string") {
    data = eval("(" + data + ")");
  }
  $(".searchContent ul").empty();
  data.forEach(function (person) {
    var html = "<li>" +
      "<span>" + person.name + "</span>" +
      "<span>" + person.no + "</span>" +
      "<button onclick='callSinglePhone(" + person.no + ")'>语音</button>" +
      "<button onclick='callSingleVideo(" + person.no + ")'>视频</button>" +
      "<span>在线</span>" +
      "</li>";
    $(".searchContent ul").append(html);
  })
}

/**
 * 群呼接口回掉
 * @param data
 */
function fillCallContent(data) {
  if (data != "" && typeof(data) === "string") {
    data = eval("(" + data + ")");
  }
  $(".mainText ul").empty();
  data.forEach(function (person) {
    var html = "<li>" +
      "<span>" + person.name + "</span>" +
      "<span>" + person.no + "</span>" +
      "<button onclick='callMutliPhone(" + person.no + ")'>语音</button>" +
      "<button onclick='callMutliVideo(" + person.no + ")'>视频</button>" +
      "<span>在线</span>" +
      "</li>";
    $(".mainText ul").append(html);
  });

  // 调整一下位置
  // $(".mainText").css("top", parseInt($(".mainText").css("top")) - $(".mainText").height() / 2);
  $(".mainText").css("top", parseInt($(window).height() / 2) - $(".mainText").height() / 2);
}

/**
 * 单人对讲
 * @param no
 */
function callSinglePhone(no) {
  //alert(no);
  sendUIMessage("语音呼叫", no.toString());
}

/**
 * 单人视频通话
 * @param no
 */
function callSingleVideo(no) {
  //alert(no);
  sendUIMessage("视频呼叫", no.toString());
}

/**
 * 群组对讲
 * @param no
 */
function callMutliPhone(no) {
  sendUIMessage("群组语音对讲", no.toString());
}

/**
 * 群组视频
 * @param no
 */
function callMutliVideo(no) {
  sendUIMessage("群组视频对讲", no.toString());
}

/**
 * 显示查询到的人所在位置
 */
function showPerson(obj) {
  var houseId = $(obj).attr("code");
  var house = $(obj).next().text();
  var buildName = house.substring(0, house.indexOf('栋') + 1);

  // 查询坐标
  var param = new SuperMap.QueryBySQLParameters({
    queryParams: {
      name: "B区楼栋@manager",
      attributeFilter: "name='" + buildName + "'"
    }
  });
  L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-PeaceComm/rest/maps/综治平台").queryBySQL(param, function (serviceResult) {
    var result = serviceResult.result;
    if (result.totalCount != 0) {
      var buildInfo = result.recordsets[0].features.features[0].properties;
      var buildMarker = L.marker([buildInfo.LAT, buildInfo.LON]).bindPopup(
        getPopupTemplate("人员定位",
          "<p style='display: none'>" + houseId + "</p>"
          + "<p>房屋地址：" + house + "</p>"
          + "<p><a onclick='openHouseRelate(this);'>显示关联人口</a></P>"), {className: "popTable"});
      locateLayer.addLayer(buildMarker);
      map.flyTo(buildMarker.getLatLng(), 20);
    }
  });
  $(".searchContent").hide();
}

function openHouseRelate(obj) {
  // var house = $(obj).parent().prev().html().split("：")[1];
  var houseId = $(obj).parent().prev().prev().html();
  sendUIMessage("查看关联人口", houseId);
}

/**
 * 显示查询到的建筑
 * @param obj
 */
function showBuilding(obj) {
  var buildName = $(obj).text();

  // 查询坐标
  var param = new SuperMap.QueryBySQLParameters({
    queryParams: {
      name: "B区楼栋@manager",
      attributeFilter: "name='" + buildName + "'"
    }
  });
  L.supermap.queryService(SUPERMAP_URL + "iserver/services/map-PeaceComm/rest/maps/综治平台").queryBySQL(param, function (serviceResult) {
    var result = serviceResult.result;
    if (result.totalCount != 0) {
      var buildInfo = result.recordsets[0].features.features[0].properties;
      var content = `<p>楼栋地址：${buildName}</p>
         <p style='cursor:pointer;'><a onclick='openBuilding("${buildInfo.DISTRICT}", "${buildInfo.COMMUNITY}", "${buildInfo.BUILDNO}", "${buildInfo.OBJECTID}")'>查看建筑</a></P>)`
      var buildMarker = L.marker([buildInfo.LAT, buildInfo.LON]).bindPopup(
        getPopupTemplate("楼栋定位", content , {className: "popTable"}));
      locateLayer.addLayer(buildMarker);
      map.flyTo(buildMarker.getLatLng(), 20);
    }
  });
  $(".searchContent").hide();
}

function openBuilding(district, community, buildno, id) {
  // var build = $(obj).parent().prev().html().split("：")[1];
  sendUIMessage("查看建筑", {district, community, buildno, id});
}

/**
 * 关闭搜索定位信息
 */
function removePin() {
  locateLayer.clearLayers();
  $(".clearSearch").hide();
  $("#searchText").val("");
  $(".searchContent ul").empty();
}

/**
 * @description 根据名称高亮图标
 * @param {*} name
 */
function locateByName(name) {
  cancelHighlight();
  if(cameraLayer.getLayers().length > 0){
    cameraLayer.eachLayer(function(layer) {
      if(layer.getPopup().getContent().indexOf(name) >= 0) {
        layer.setZIndexOffset(1000);
        highlightMarker = L.marker([layer.getLatLng().lat, layer.getLatLng().lng], {icon: L.divIcon({html: document.getElementsByClassName("rippleWrap")[0].innerHTML, iconAnchor: [-1,-4]})}).addTo(map);
        highlightMarker.setZIndexOffset(100);
        map.flyTo(highlightMarker.getLatLng(), 19);
        // setTimeout(() => {
        //   map.panTo([highlightMarker.getLatLng().lat + 0.0003,highlightMarker.getLatLng().lng + 0.0005]);
        // }, 500);
      }
    });
  }
}

/**
 * @description 取消图标高亮
 */
function cancelHighlight() {
  if(highlightMarker != null) {
    map.removeLayer(highlightMarker);
    highlightMarker = null;
  }
}