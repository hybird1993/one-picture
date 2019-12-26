//================公司环境================
/**
 * 基础业务地址---综治平台网站地址
 */
var baseUrl = window.location.protocol + "//" + window.location.host + "/pscm/";
// var baseUrl = "http://172.29.1.18:89/pscm/";
/**
 * 超图服务器地址 --- SuperMap IServer的地址
 */
var SUPERMAP_URL = "http://172.29.1.151:8090/";
/**
 * 地图tomcat服务地址 --- 另外开的一个TOMCAT服务器，用于发布瓦片地图
 */
var TOMCAT_URL = "http://172.29.1.151:8080/";

////================街道办环境===============
// /**
//  * 基础业务地址---综治平台网站地址
//  */
//  var baseUrl = window.location.protocol + "//" + window.location.host + "/pscm/";
// /**
//  * 超图服务器地址 --- SuperMap IServer的地址
//  */
//  var SUPERMAP_URL = window.location.host.indexOf("10.0.151.254") != -1 ?  "http://10.0.151.253:8090/" :  "http://www.hongxinshequ.com:8190/";
// /**
//  * 地图tomcat服务地址 --- 另外开的一个TOMCAT服务器，用于发布瓦片地图
//  */
//  var TOMCAT_URL = window.location.host.indexOf("10.0.151.254") != -1 ?  "http://10.0.151.253:8080/" : "http://www.hongxinshequ.com:8180/";

/**
 * 获取url参数
 * @param name
 * @returns {*}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 左对齐
function leftPad(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

/**
 * 翻译性别字典
 * @param code
 * @returns {string}
 */
function getSex(code) {
    switch (code) {
        case "0" :
            return "未知的性别";
        case "1" :
            return "男性";
        case "2" :
            return "女性";
        case "9" :
            return "未说明的性别";
        default  :
            return "";
    }
}

/**
 * 翻译人员类别
 * @param code
 * @returns {string}
 */
function getOccupation(code) {
    switch (code) {
        case "teenager"     :
            return "重点青少年";
        case "drug"         :
            return "吸毒人员";
        case "emancipist"   :
            return "刑满释放人员";
        case "pertition"    :
            return "非法上访人员";
        case "rectify"      :
            return "社区矫正人员";
        case "aids"         :
            return "艾滋病危险人员";
        case "alloeosis"    :
            return "严重精神障碍患者";
        case "suballow"     :
            return "低保人员";
        case "livealone"    :
            return "独居老人";
        case "disabled"     :
            return "残障人士";
        default             :
            return "";
    }
}

/**
 * 配置楼栋基础信息中的图片
 * @param url
 * @returns {*}
 */
function checkPicture(url) {
    if (url === null || url === "") {
        return "../img/default.png";
    } else return url;
}

/**
 * 翻译楼栋用途字典
 * @param code
 * @returns {string}
 */
function getBuildingType(code) {
    switch (code) {
        case "01" :
            return "住宅";
        case "02" :
            return "商业";
        case "03" :
            return "办公";
        case "04" :
            return "工业";
        case "05" :
            return "仓储";
        case "06" :
            return "商住混用";
        default   :
            return "";
    }
}

/**
 * 翻译房屋用途字典
 * @param code
 * @returns {string}
 */
function getHouseType(code) {
    switch (code) {
        case "01" :
            return "宿舍";
        case "02" :
            return "住房";
        case "03" :
            return "商铺";
        case "04" :
            return "办公";
        case "05" :
            return "仓库";
        case "06" :
            return "厂房";
        case "99" :
            return "其他";
        default   :
            return "";
    }
}

/**
 * 检测空对象
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

/**
 * 判断是否为null
 * @param value
 * @returns {string}
 */
function checkNull(value) {
    if (value == null || value === "null" || value == undefined || value === "undefined") {
        return "";
    } else return value;
}

/**
 * 获取距离今天days天的日期
 * @param days
 */
function getTimeString(days) {
    var date = new Date();
    date.setDate(date.getDate() - days);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds();
}

/**
 * 计算二阶贝塞尔曲线的控制点
 * @param p1 基础点p1
 * @param p2 基础点p2
 * @param k 弹性系数(0-1)
 */
function getSecondLevelCurve(p1, p2, k) {
    var dis = 111000 * Math.cos(30.60 * Math.PI / 180); // 佛祖岭1°的实际距离
    var cpx = (p1[0] + p2[0]) / 2; // 中点x
    var cpy = (p1[1] + p2[1]) / 2; // 中点y
    var s = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)) * dis; // p1和p2之间的距离
    var l = s * 0.5 * k; // 控制点与中点的距离
    var arc = Math.atan((p1[1] - p2[1]) / (p1[0] - p2[0])); // p1 和 p2之间的角度(弧度)
    //arc = 180 * arc / Math.PI; //转换为角度值
    var l2 = Math.abs(l * Math.sin(arc)); // 控制点到中点的水平距离
    l2 = l2 / dis; // 弧度转度
    var x = arc > 0 ? cpx - l2 : cpx + l2; // 控制点x
    var l3 = Math.abs(l * Math.cos(arc)); // 控制点到中点的垂直距离
    l3 = l3 / dis; // 弧度转度
    var y = cpy + l3; // 控制点y
    return [x, y];
}

/**
 * 扩展ARCGIS瓦片加载规则
 */
try {
    L.TileLayer.ARCGIS = L.TileLayer.extend({
        getTileUrl: function (tilePoint) {
            var oo = "00000000";
            var xx = tilePoint.x.toString(16);
            xx = "C" + oo.substring(0, 8 - xx.length) + xx;
            var yy = tilePoint.y.toString(16);
            yy = "R" + oo.substring(0, 8 - yy.length) + yy;
            return L.Util.template(this._url, L.extend({
                s: this._getSubdomain(tilePoint),
                z: "L" + tilePoint.z,
                x: xx.toUpperCase(),
                y: yy.toUpperCase()
            }, this.options));
        }
    });
    L.tileLayer.arcgis = function(p) {
        return new L.TileLayer.ARCGIS(p);
    }
}catch(e) {
    ;
}

/**
 * GUID生成算法
 * @returns {string}
 */
function makeGUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/**
 * 随机色
 * @returns {string}
 */
// function getColor() {
//     var color = "#";
//     for (var i = 0; i < 6; i++) {
//         color += (Math.random() * 16 | 0).toString(16);
//     }
//     return color;
// }

function getColor() {//输出rgba颜色格式

    var r = Math.floor(Math.random() * 255) % 2, g = 0, b = Math.floor(Math.random() * 255) % 2, a = 1;
    var rgb = 155;
    var c = Math.floor(Math.random() * (255 - rgb) + rgb);
    if (r * g * b == 1) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
    } else if (r + g + b == 0) {
        var t = Math.floor(Math.random() * 255);
        r = t;
        g = t;
        b = t;
    } else {
        r = r == 1 ? (Math.floor(Math.random() * (255 - rgb) + rgb)) : (Math.floor(Math.random() * (c / 2)));
        g = g == 1 ? Math.floor(Math.random() * (255 - rgb) + rgb) : Math.floor(Math.random() * (c / 2));
        b = b == 1 ? Math.floor(Math.random() * (255 - rgb) + rgb) : Math.floor(Math.random() * (c / 2));
    }
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}