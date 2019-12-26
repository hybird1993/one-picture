/**
 * 14个摄像头的位置
 * @type {*[]}
 */
var camera_locations = [
  // 真实的
  // {'NO': 'SPJK-151', 'X': 114.440118, 'Y': 30.441818, 'Z': 1.20, 'BRAND': '佛祖岭B区南区-南大门广场球机41/视频监控摄像头/SPJK-151'},
  // {'NO': 'SPJK-002', 'X': 114.439979, 'Y': 30.442064, 'Z': 1.21, 'BRAND': '佛祖岭B区南门大屏/视频监控摄像头/SPJK-002'},
  // {'NO': 'SPJK-159', 'X': 114.440479, 'Y': 30.442344, 'Z': 1.16, 'BRAND': '佛祖岭B区南区-37.38栋西侧通道/视频监控摄像头/SPJK-159'},
  // {'NO': 'SPJK-158', 'X': 114.440529, 'Y': 30.442773, 'Z': 1.21, 'BRAND': '佛祖岭B区南区-36栋西侧通道/视频监控摄像头/SPJK-158'},
  // {'NO': 'SPJK-137', 'X': 114.440536, 'Y': 30.442918, 'Z': 1.22, 'BRAND': '佛祖岭B区北区-36栋北侧通道/视频监控摄像头/SPJK-137'},
  // {'NO': 'SPJK-131', 'X': 114.440476, 'Y': 30.443690, 'Z': 1.25, 'BRAND': '佛祖岭B区北区-35栋通道/视频监控摄像头/SPJK-131'},
  // {'NO': 'SPJK-136', 'X': 114.440293, 'Y': 30.444087, 'Z': 1.15, 'BRAND': '佛祖岭B区北区-32栋南侧拐角通道/视频监控摄像头/SPJK-136'},
  // {'NO': 'SPJK-139', 'X': 114.438704, 'Y': 30.443838, 'Z': 1.16, 'BRAND': '佛祖岭B区北区-大队部门前通道48/视频监控摄像头/SPJK-139'},
  // {'NO': 'SPJK-170', 'X': 114.437612, 'Y': 30.443300, 'Z': 1.15, 'BRAND': '佛祖岭B区北区-11栋车棚/视频监控摄像头/SPJK-170'},
  // {'NO': 'SPJK-154', 'X': 114.437678, 'Y': 30.443100, 'Z': 1.15, 'BRAND': '佛祖岭B区南区-11栋9栋通道/视频监控摄像头/SPJK-154'},
  // {'NO': 'SPJK-145', 'X': 114.438006, 'Y': 30.442490, 'Z': 1.16, 'BRAND': '佛祖岭B区南区-西大门球机42/视频监控摄像头/SPJK-145'},
  // {'NO': 'SPJK-157', 'X': 114.438118, 'Y': 30.442141, 'Z': 1.15, 'BRAND': '佛祖岭B区南区-3栋西侧通道/视频监控摄像头/SPJK-157'},
  // {'NO': 'SPJK-184', 'X': 114.438398, 'Y': 30.441861, 'Z': 1.14, 'BRAND': '佛祖岭B区南区-1栋车棚/视频监控摄像头/SPJK-184'},
  // {'NO': 'SPJK-152', 'X': 114.440028, 'Y': 30.442002, 'Z': 1.16, 'BRAND': '佛祖岭B区南区-南门广场入口/视频监控摄像头/SPJK-152'},


  // UPDATE 9-5

  {'NO': 'SPJK-002', 'X': 114.440042, 'Y': 30.441992, 'Z': 1.38, 'BRAND': '佛祖岭B区南门大屏/视频监控摄像头/SPJK-002'},
  {'NO': 'SPJK-137', 'X': 114.440527, 'Y': 30.442912, 'Z': 1.38, 'BRAND': '佛祖岭B区北区-36栋北侧通道/视频监控摄像头/SPJK-137'},
  {'NO': 'SPJK-140', 'X': 114.440279, 'Y': 30.444079, 'Z': 1.38, 'BRAND': '佛祖岭B区北区-32栋门前通道/视频监控摄像头/SPJK-140'},
  {'NO': 'SPJK-139', 'X': 114.438704, 'Y': 30.443838, 'Z': 1.38, 'BRAND': '佛祖岭B区北区-幼儿园48/视频监控摄像头/SPJK-139'},
  {'NO': 'SPJK-170', 'X': 114.437728, 'Y': 30.443493, 'Z': 1.38, 'BRAND': '佛祖岭B区北区-11栋车棚/视频监控摄像头/SPJK-170'},
  {'NO': 'SPJK-144', 'X': 114.437937278917, 'Y': 30.4426372834398, 'Z': 1.38, 'BRAND': '佛祖岭B区南区-5栋西侧通道/视频监控摄像头/SPJK-144'},
  {'NO': 'SPJK-145', 'X': 114.437976468529, 'Y': 30.4425476961823, 'Z': 1.38, 'BRAND': '佛祖岭B区南区-西大门球机42/视频监控摄像头/SPJK-145'},
  {'NO': 'SPJK-147', 'X': 114.438231, 'Y': 30.441827, 'Z': 1.38, 'BRAND': '佛祖岭B区南区-1栋门前通道/视频监控摄像头/SPJK-147'},
  {'NO': 'SPJK-176', 'X': 114.439282334448, 'Y': 30.4421021515513, 'Z': 1.38, 'BRAND': '佛祖岭B区南区-2栋车棚/视频监控摄像头/SPJK-176'},
  {'NO': 'SPJK-152', 'X': 114.439978, 'Y': 30.442067, 'Z': 1.38, 'BRAND': '佛祖岭B区南区-南门广场入口/视频监控摄像头/SPJK-152'}
];

/**
 * 添加摄像头模型
 */
function addCamera() {
  var cameraUrl = 'camera.s3m';
  var layer = new Cesium.DynamicLayer3D(scene.context, [cameraUrl]);
  scene.primitives.add(layer);

  //更新model.s3m类型实例的状态信息（最后一个摄像头模型上存在，故不再绘制了）
  var states = [];
  for (var i = 0; i < camera_locations.length - 1; i++) {
    var point = camera_locations[i];
    var cameraState = new Cesium.DynamicObjectState({
      id: i,
      longitude: point.X,
      latitude: point.Y,
      altitude: point.Z,
      scale: new Cesium.Cartesian3(0.7, 0.7, 0.7)
    });
    states.push(cameraState);
  }
  layer.updateObjectWithModel(cameraUrl, states);


  // 添加标注
  for (var i = 0; i < camera_locations.length; i++) {
    var point = camera_locations[i];
    viewer.entities.add({
      name: point.BRAND,
      position: Cesium.Cartesian3.fromDegrees(point.X, point.Y, 4.6),
      label: {
        text: point.BRAND.split("/")[0],
        font: '12pt sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE, //FILL  FILL_AND_OUTLINE OUTLINE
        fillColor: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // CENTER LEFT RIGHT
        verticalOrigin: Cesium.VerticalOrigin.BASELINE, //BASELINE BOTTOM CENTER TOP
        // 偏移
        pixelOffset: new Cesium.Cartesian2(10, 0), //指定像素偏移量的属性
        translucencyByDistance: new Cesium.NearFarScalar(100, 1, 1000, 0)
      }
    });
  }
}

var flyManager = null;
var deferS = null;
var routeStopS = null;
var curNo = '';

/**
 * 漫游
 */
function autoFly() {
  // 飞行路线集合对象
  var routes = new Cesium.RouteCollection();
  //添加fpf飞行文件，fpf由SuperMap iDesktop生成
  var fpfUrl = 'route.fpf';
  routes.fromFile(fpfUrl);
  //初始化飞行管理,控制飞行的开始、暂停、停止以及站点事件等
  flyManager = new Cesium.FlyManager({
    scene: scene,
    routes: routes
  });
  flyManager.playRate = 1; //获取或者设置飞行路线的飞行速率，大于1.0加速，小于1.0减速

  // 飞行路线就绪
  flyManager.stopArrived.addEventListener(function (routeStop) {

    var stopName = routeStop.stopName; // 获取站点的名称
    if (stopName.startsWith('s')) {
      var brand = camera_locations[parseInt(stopName.substring(1)) - 1].BRAND;
      curNo = camera_locations[parseInt(stopName.substring(1)) - 1].NO;
      console.log("摄像头编号：" + stopName + ", 命名编号：" + brand + ", 暂停漫游, 开始播放视频");
      SendUIMessage("漫游视频", brand);
      SendUIMessage("摄像头定位", curNo);

      // 暂停播放
      deferS = Cesium.when.defer();
      routeStop.promise = deferS;
      routeStopS = routeStop;
      $(".hideBtn").attr("disabled", "disabled");
    }
  });
  flyManager.readyPromise.then(function () {
    var currentRoute = flyManager.currentRoute;
    currentRoute.speed = 30 / 3.6;
    currentRoute.isFlyLoop = true; // 循环播放
  });
}

// 一张图使用
function SendUIMessage(name, value) {
  // try {
  //   if (jsobj != undefined && jsobj != null) {
  //     jsobj.SendUIMessage(name, value);
  //   }
  // } catch (e) {
  //   console.log(e);
  // }
  window.parent.postMessage({
    method: name,
    params: value
  },'*');
}

function RecvUIMessage(name, data) {
  if (name == "当前漫游完毕") {
    resumeRoam();
  }
}

window.addEventListener('message', function (evt) {
  RecvUIMessage(evt.data.method,evt.data.params||'');
});

/**
 * 对应站点暂停事件的继续播放事件
 */
function resumeRoam() {
  deferS.resolve(true);
  routeStopS.promise = undefined;
  $(".homeBtn #pause").removeAttr("disabled");
  $(".homeBtn #stop").removeAttr("disabled");
}

/**
 * 开始漫游
 */
function playRoam() {
  $(".homeBtn #home").attr("disabled", "disabled");
  $(".homeBtn #play").attr("disabled", "disabled");
  $(".homeBtn #pause").removeAttr("disabled");
  $(".homeBtn #stop").removeAttr("disabled");
  flyManager.currentRoute.speed = 10 / 3.6;
  flyManager && flyManager.play();
  SendUIMessage("开始漫游", "");
}

/**
 * 暂停漫游
 */
function pauseRoam() {
  $(".homeBtn #play").removeAttr("disabled");
  $(".homeBtn #pause").attr("disabled", "disabled");
  flyManager && flyManager.pause();
}

/**
 * 停止漫游
 */
function stopRoam() {
  $(".homeBtn #home").removeAttr("disabled");
  $(".homeBtn #play").removeAttr("disabled");
  $(".homeBtn #pause").attr("disabled", "disabled");
  $(".homeBtn #stop").attr("disabled", "disabled");
  flyManager && flyManager.stop();
  SendUIMessage("结束漫游", "");
}
