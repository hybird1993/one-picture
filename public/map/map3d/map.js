/**
 * 全局对象
 * @type {null}
 */
var viewer = null;
var scene = null;
var selectedEntity = null;

// 点选气泡模式
var pinType = null;

function onload(Cesium) {

    //初始化viewer部件
    viewer = new Cesium.Viewer('cesiumContainer', {
        infoBox: true,
        selectionIndicator: false,
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
            url: 'http://www.google.cn/maps/vt?lyrs=s@716&x={x}&y={y}&z={z}'
        })
    });

    selectedEntity = new Cesium.Entity(); // infoBox需要的Entity
    scene = viewer.scene;
    var widget = viewer.cesiumWidget;
    $('#loadingbar').remove();
    try {

        var t1 = scene.addS3MTilesLayerByScp(SUPERMAP_URL + "iserver/services/3D-fzl3dmax/rest/realspace/datas/t1@max/config", {name: 't1'});
        var kind = scene.addS3MTilesLayerByScp(SUPERMAP_URL + "iserver/services/3D-fzl3dmax/rest/realspace/datas/kind@max/config", {name: 'kind'});
        var mx = scene.addS3MTilesLayerByScp(SUPERMAP_URL + "iserver/services/3D-fzl3dmax/rest/realspace/datas/mx@36R/config", {name: 'mx'});

        t1.then(function (layer) {
            layer.cullEnabled = true; //双面渲染  关键
            layer.selectEnabled = false;
            layer.hasLight = true; //关闭光照  关键
            layer.style3D._fillForeColor.alpha = 1;
        });
        kind.then(function (layer) {
            layer.cullEnabled = true; //双面渲染  关键
            layer.selectEnabled = false;
            layer.hasLight = true; //关闭光照  关键
            layer.style3D._fillForeColor.alpha = 1;
        });
        mx.then(function (layer) {
            layer.cullEnabled = false; //双面渲染  关键
            layer.hasLight = true; //关闭光照  关键
            layer.style3D._fillForeColor.alpha = 0; //半透
            layer.selectColorType = 1.0;
            layer.selectedColor = Cesium.Color.RED;
            layer.selectedColor.alpha = 0.4;
        });

        Cesium.when(mx, function (layer) {
            if (!scene.pickPositionSupported) {
                alert('不支持深度拾取,属性查询功能无法使用！');
            }
            //设置属性查询参数
            layer.setQueryParameter({
                url: SUPERMAP_URL + 'iserver/services/data-fzl3dmax/rest/data', //查询分层信息矢量面数据服务
                dataSourceName: 'dom',
                dataSetName: 'QXMX'
            });
            //设置相机视角
            scene.camera.setView({
                destination: new Cesium.Cartesian3.fromDegrees(114.44173564732083, 30.443091711192622, 33.50276022062371),
                orientation: {
                    heading: 4.578465637097203,
                    pitch: -0.1866466582339863,
                    roll: 6.283185307178481
                }
            });

            $(".homeBtn #home").on("click", function () {
                scene.camera.flyTo({
                    destination: new Cesium.Cartesian3.fromDegrees(114.44173564732083, 30.443091711192622, 33.50276022062371),
                    orientation: {
                        heading: 4.578465637097203,
                        pitch: -0.1866466582339863,
                        roll: 6.283185307178481
                    }
                })
            });

            $(".homeBtn #play").on("click", function () {
                playRoam();
            });
            $(".homeBtn #pause").on("click", function () {
                pauseRoam();
            });
            $(".homeBtn #stop").on("click", function () {
                stopRoam();
            });

            // 设置选择模式
            pinType = "house";

            if (auth_token != null){
                $(".hideBtn").show();
                addCamera();
                autoFly();
            }

        }, function (e) {
            if (widget._showRenderLoopErrors) {
                var title = '渲染时发生错误，已停止渲染。';
                widget.showErrorPanel(title, undefined, e);
            }
        });

        //注册鼠标点击事件
        viewer.pickEvent.addEventListener(function (feature) {
            var name = feature.NAME;// 佛祖岭街道/佛祖岭B区/36栋/2单元/8层/803 ----- 佛祖岭街道/佛祖岭B区/36栋/1单元/3/1
            var street = feature.DISTRICT; // 街道
            var comm = feature.COMMUNITY; // 社区
            var build = feature.BUILDNO; // 楼栋
            var unit = feature.UNIT; // 单元
            var room = feature.ROOM; // 房号

            // 以下是异步获取数据返回html的示例
            // 将101拆分成1/1 1001拆分成10/1
            room = (room.length == 3) ? room.substring(0, 1) + "/" + room.substring(2, 3) : room.substring(0, 2) + "/" + room.substring(3, 4);
            var houseName = street + "/" + comm + "/" + build + "栋/" + unit + "单元/" + room;

            if (pinType === "house") {
                selectedEntity.name = "房屋信息";
                selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
                viewer.selectedEntity = selectedEntity;

                $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE", function (response) {
                    if (response != null && response != "" && response != undefined && response != "undefined") {
                        selectedEntity.description = "<table class=\"cesium-infoBox-defaultTable\"><tbody>" +
                            "<tr><th>房屋名称</th><td>" + name + "</td></tr>" +
                            "<tr><th>房屋用途</th><td>" + getHouseType(response.useType) + "</td></tr>" +
                            "<tr><th>房主姓名</th><td>" + (response.residents == null || response.residents.length == 0 ? '' : response.residents[0].name) + "</td></tr>" +
                            "<tr><th>联系方式</th><td>" + (response.residents == null || response.residents.length == 0 ? '' : response.residents[0].contact) + "</td></tr>" +
                            "<tr><th>房号</th><td>" + response.floorNumber + '0' + response.houseNumber + "</td></tr>" +
                            //"<tr><th colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/roomInfo.html?houseId=" + response.uid + "\', \'_blank\'))\">详情</a></th></tr>" +
                            "</tbody></table>";
                        // 一张图使用
                        // if (jsobj != null) {
                        //     jsobj.SendUIMessage("查看关联人口", response.houseId + "");
                        // }
                        window.parent.postMessage({
                            method: "查看关联人口",
                            params: response.houseId
                        },'*');
                    } else {
                        selectedEntity.description = "未查询到记录...";
                    }
                });


            } else if (pinType === "important") {
                selectedEntity.name = "重点人员信息";
                selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
                viewer.selectedEntity = selectedEntity;

                $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE&subLayers=teenager,drug,emancipist,pertition,rectify,aids,alloeosis", function (response) {
                    var persons = response.residents;
                    if (persons != null && persons.length != 0) {
                        var html = "";
                        persons.forEach(function (person) {
                            html +=
                                "<tr><td>" + person.idNo + "</td>" +
                                "<td>" + person.name + "</td>" +
                                "<td>" + getSex(person.sex) + "</td>" +
                                "<td>" + getOccupation(person.occupation) + "</td>" +
                                "<td>" + room + "</td>";
                            //"<td><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" +
                            //person.residentBaseId + "\', \'_blank\'))\">详情</a></td>";
                        });
                        selectedEntity.description = "<table class=\"cesium-infoBox-defaultTable centerTable\">" +
                            "<thead><tr><th>身份证</th><th>人员姓名</th><th>性别</th><th>人员类别</th><th>房号</th></tr></thead><tbody>" + //<th>详情</th>
                            html +
                            "</tbody></table>";
                    } else {
                        selectedEntity.description = "未查询到记录...";
                    }
                });
            } else if (pinType === "help") {
                selectedEntity.name = "帮扶人员信息";
                selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
                viewer.selectedEntity = selectedEntity;

                $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE&subLayers=suballow,livealone,disabled", function (response) {
                    var persons = response.residents;
                    if (persons != null && persons.length != 0) {
                        var html = "";
                        persons.forEach(function (person) {
                            html +=
                                "<tr><td>" + person.idNo + "</td>" +
                                "<td>" + person.name + "</td>" +
                                "<td>" + getSex(person.sex) + "</td>" +
                                "<td>" + getOccupation(person.occupation) + "</td>" +
                                "<td>" + room + "</td>";
                            //"<td><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" +
                            // person.residentBaseId + "\', \'_blank\'))\">详情</a></td>";
                        });
                        selectedEntity.description = "<table class=\"cesium-infoBox-defaultTable\">" +
                            "<thead><tr><th>身份证</th><th>人员姓名</th><th>性别</th><th>人员类别</th><th>房号</th></tr></thead><tbody>" + //<th>详情</th>
                            html +
                            "</tbody></table>";
                    } else {
                        selectedEntity.description = "未查询到记录...";
                    }
                });
            }
        });

        // 设置相机的最大高度
        // scene.screenSpaceCameraController.minimumZoomDistance = 120; // 默认拍摄高度

    } catch (e) {
        if (widget._showRenderLoopErrors) {
            var title = '渲染时发生错误，已停止渲染。';
            widget.showErrorPanel(title, undefined, e);
        }
    }
}
