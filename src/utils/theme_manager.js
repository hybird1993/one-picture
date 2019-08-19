import $ from 'jquery';
import THEME_CONFIG from './theme.config';

function ThemeManager() {

  var themeName;
  var themetypes = [{
    type: "",
    obj: ""
  }];

  //设置themeName
  this.setThemeName = function (type) {
    themeName = type;
  }

  this.getThemeName = function () {
    return themeName;
  }

  //添加动画对象到数组
  this.add = function (typetheme, newObj) {
    themetypes.push({
      type: typetheme,
      obj: newObj
    });
  }

  //取得动画对象		
  this.getThemeObj = function (themetype) {
    var index = -1;
    for (var i = 0; i < themetypes.length; i++) {
      if (themetypes[i].type == themetype)
        index = i;
    }
    return index > -1 ? themetypes[index].obj : {
      getOptionsDefine: () => {
        return []
      }
    };
  }
}


//星空穿梭
function StarSkyTheme() {
  var w_b;
  var s_color = "#FFF";
  var dom;
  var fov;
  var SCREEN_WIDTH = window.screen.availWidth;
  var SCREEN_HEIGHT = window.screen.availHeight;
  var HALF_WIDTH = SCREEN_WIDTH / 2;
  var HALF_HEIGHT = SCREEN_HEIGHT / 2;
  var numPoints;
  var speed;
  var loop;
  var c; //canvas上下文
  var points = [];
  var countpaint = 0;

  this.setDom = function (domdiv) {
    dom = domdiv;
    // dom.attr({
    //   width: SCREEN_WIDTH,
    //   height: SCREEN_HEIGHT
    // });
  }

  this.getOptionsDefine = function () {
    return THEME_CONFIG.starsky.config;
  }

  this.setOption = function (options) {
    numPoints = parseInt(options.star_num);
    w_b = options.animatebg;
    fov = parseInt(options.star_depth);
    speed = 100 - parseInt(options.star_speed);
  }

  this.stopAnimate = function () {
    clearInterval(loop);
  }
  this.startAnimate = function () {
    initPoints();
    c = dom.getContext('2d');
    loop = setInterval(function () {
      render();
    }, speed);
  }

  function initPoints() {
    for (var i = 0; i < numPoints; i++) {
      const point = [(Math.random() * 800) - 400, (Math.random() * 800) - 400, (Math.random() * 800) - 400];
      points.push(point);
    }
  }

  function draw3Din2D(point3d, c) {

    const x3d = point3d[0];
    const y3d = point3d[1];
    const z3d = point3d[2];
    var scale = fov / (fov + z3d);
    var x2d = (x3d * scale) + HALF_WIDTH;
    var y2d = (y3d * scale) + HALF_HEIGHT;
    c.beginPath();
    c.fillStyle = s_color;
    c.arc(x2d, y2d, scale > 0 ? scale : 1, 0, 2 * Math.PI);
    c.closePath();
    c.fill();

  }

  function render() {
    //	c.clearRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);	
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 0.2;
    c.fillStyle = w_b;
    c.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < numPoints; i++) {
      const point3d = points[i];
      let z3d = point3d[2];
      z3d -= 0.1;
      if (z3d < -fov) z3d = (Math.random() * 800) - 400; // z3d +=500;
      point3d[2] = z3d;
      draw3Din2D(point3d, c);
    }
  }
}

//云朵
function CloudsTheme() {

  var s_color = "#FFF";
  var dom;

  this.getOptionsDefine = function () {
    return THEME_CONFIG.clouds.config;
  }

  this.setDom = function (domdiv) {
    dom = domdiv;
  }

  this.setOption = function (options) {
    var speed = (11 - options.cloud_speed) * 1000;
    $(".dynamic-area1").css("animation", "posterDrop1 " + speed + "s linear infinite");
    dom.css("background", options.animatebg);
  }
  this.stopAnimate = function () {
    $(".dynamic-area1").css("animation-play-state", "paused");
    $(".dynamic-area2").css("animation-play-state", "paused");
  }

  this.startAnimate = function () {
    $(".dynamic-area1").css("animation-play-state", "running");
    $(".dynamic-area2").css("animation-play-state", "running");
  }

}



function ShootingstarTheme() {
  var WINDOW_WIDTH = window.screen.width;
  // 屏幕高度
  var WINDOW_HEIGHT = window.screen.height;
  var canvas, context;
  // 星星数量
  var num;
  // 星星数组
  var stars = [];
  // 流星索引
  var rnd;
  var speed;
  var loop;


  this.setDom = function (domdiv) {
    dom = domdiv;
    // canvas.attr({
    //   width: WINDOW_WIDTH,
    //   height: WINDOW_HEIGHT
    // });
    context = dom.getContext('2d');
  }

  this.getOptionsDefine = function () {
    return THEME_CONFIG.starflash.config;
  }

  this.setOption = function (options) {
    speed = parseInt(options.flash_speed);
    num = parseInt(options.flash_num);
    canvas.css("background", options.animatebg);
    canvas.css("background-size", "cover");
  }

  this.stopAnimate = function () {
    clearInterval(loop);
  }
  this.startAnimate = function () {
    // 生成星星
    addStar();
    meteor();
    loop = setInterval(function () {
      render();
    }, speed);
  }

  // 生成流星的索引号
  function meteor() {
    var time = Math.round(Math.random() * 3000 + 33);
    setTimeout(function () {
      rnd = Math.ceil(Math.random() * stars.length);
      meteor();
    }, time);
  }
  // 画布渲染
  var render = function () {
    /*var img = new Image();
    img.src="./images2/firstbgb.jpg";
    var pattern = context.createPattern(img, "no-repeat");
    context.fillStyle=pattern;*/
    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    context.fillStyle = 'rgba(0,0,0,0)';
    // 画布位置
    context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    for (var i = 0; i < num; i++) {
      var star = stars[i];
      // 画流星
      if (i == rnd) {
        rnd = -1;
        star.vx = -5;
        star.vy = 20;
        context.beginPath();
        context.strokeStyle = 'rgba(255,255,255,' + star.alpha + ')';
        context.lineWidth = star.r;
        context.moveTo(star.x, star.y);
        context.lineTo(star.x + star.vx, star.y + star.vy);
        context.stroke();
        context.closePath();
      }
      star.alpha += star.ra;
      // 透明度判断，从0到1
      if (star.alpha <= 0) {
        star.alpha = 0;
        star.ra = -star.ra;
        star.vx = Math.random() * 0.2 - 0.1;
        star.vy = Math.random() * 0.2 - 0.1;
      } else if (star.alpha > 1) {
        star.alpha = 1;
        star.ra = -star.ra
      }
      star.x += star.vx;
      // x轴坐标判断
      if (star.x >= WINDOW_WIDTH) {
        star.x = Math.random() * WINDOW_WIDTH;
      } else if (star.x < 0) {
        star.x = Math.random() * WINDOW_WIDTH;
        star.vx = Math.random() * 0.2 - 0.1;
        star.vy = Math.random() * 0.2 - 0.1;
      }
      star.y += star.vy;
      // y轴坐标判断
      if (star.y >= WINDOW_HEIGHT) {
        star.y = Math.random() * WINDOW_HEIGHT;
        star.vy = Math.random() * 0.2 - 0.1;
        star.vx = Math.random() * 0.2 - 0.1;
      } else if (star.y < 0) {
        star.y = Math.random() * WINDOW_HEIGHT;
      }
      // 开始绘制
      context.beginPath();
      var bg = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r);
      bg.addColorStop(0, 'rgba(255,255,255,' + star.alpha + ')');
      bg.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = bg;
      // 画圆
      context.arc(star.x, star.y, star.r, 0, Math.PI * 2, true);
      // 实际绘制
      context.fill();
      context.closePath();
    }
  }
  // 生成星星
  var addStar = function () {
    for (var i = 0; i < num; i++) {
      var aStar = {
        // x轴坐标
        x: Math.round(Math.random() * WINDOW_WIDTH),
        // y轴坐标
        y: Math.round(Math.random() * WINDOW_HEIGHT),
        // 圆半径
        r: Math.random() * 3,
        ra: Math.random() * 0.05,
        // 透明度
        alpha: Math.random(),
        // 横向移动偏移量
        vx: Math.random() * 0.2 - 0.1,
        // 纵向移动偏移量
        vy: Math.random() * 0.2 - 0.1
      };
      stars.push(aStar);
    }
  }
}


//编织星空主题	
function StarplaitTheme() {

  var SCREEN_WIDTH = window.screen.width;
  var SCREEN_HEIGHT = window.screen.height;
  var canvasEl;
  var ctx;
  var easingFactor = 5.0;
  var nodeColor = '#fff';
  var edgeColor = '#fff';

  var nodes = [];
  var edges = [];
  var num, speed, radio, alpha;
  var loop;

  this.setDom = function (domdiv) {
    canvasEl = domdiv;
    canvasEl.attr({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT
    });
    ctx = document.getElementById(canvasEl.attr("id")).getContext('2d');
  }

  this.getOptionsDefine = function () {
    return THEME_CONFIG.starplait.config;
  }

  this.setOption = function (options) {
    num = parseInt(options.plait_num);
    speed = 250 - parseInt(options.plait_speed);
    radio = parseInt(options.plait_radio) / 10;
    //	alpha = parseInt(options.plait_alpha)/10;
    canvasEl.css("background", options.animatebg);
    canvasEl.css("background-size", "cover");
  }

  this.stopAnimate = function () {
    clearInterval(loop);
  }

  this.startAnimate = function () {
    nodes = [];
    edges = [];
    constructNodes();
    loop = setInterval(function () {
      step();
    }, speed);
  }

  var constructNodes = function () {
    for (var i = 0; i < num; i++) {
      var node = {
        //      drivenByMouse: i == 0,
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * SCREEN_HEIGHT,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        radius: Math.random() > 0.9 ? 3 + Math.random() * 3 : 1 + Math.random() * 3
      };

      nodes.push(node);
    }

    nodes.forEach(function (e) {
      nodes.forEach(function (e2) {
        if (e == e2) {
          return;
        }

        var edge = {
          from: e,
          to: e2
        }
        addEdge(edge);
      });
    });
  }

  var addEdge = function (edge) {
    var ignore = false;

    edges.forEach(function (e) {
      if (e.from == edge.from && e.to == edge.to) {
        ignore = true;
      }

      if (e.to == edge.from && e.from == edge.to) {
        ignore = true;
      }
    });

    if (!ignore) {
      edges.push(edge);
    }
  }

  var step = function () {

    nodes.forEach(function (e) {

      e.x += e.vx;
      e.y += e.vy;

      function clamp(min, max, value) {
        if (value > max) {
          return max;
        } else if (value < min) {
          return min;
        } else {
          return value;
        }
      }

      if (e.x <= 0 || e.x >= SCREEN_WIDTH) {
        e.vx *= -1;
        e.x = clamp(0, SCREEN_WIDTH, e.x)
      }

      if (e.y <= 0 || e.y >= SCREEN_HEIGHT) {
        e.vy *= -1;
        e.y = clamp(0, SCREEN_HEIGHT, e.y)
      }
    });

    //  adjustNodeDrivenByMouse();
    render();
    //    window.requestAnimationFrame(step);
  }



  var lengthOfEdge = function (edge) {
    return Math.sqrt(Math.pow((edge.from.x - edge.to.x), 2) + Math.pow((edge.from.y - edge.to.y), 2));
  }

  var render = function () {

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    edges.forEach(function (e) {
      var l = lengthOfEdge(e);
      var threshold = SCREEN_WIDTH / 8;

      if (l > threshold) {
        return;
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = (1.0 - l / threshold) * radio;
      ctx.globalAlpha = 1.0 - l / threshold;
      ctx.beginPath();
      ctx.moveTo(e.from.x, e.from.y);
      ctx.lineTo(e.to.x, e.to.y);
      ctx.stroke();
    });
    ctx.globalAlpha = 1.0;

    nodes.forEach(function (e) {
      /*   if (e.drivenByMouse) {
           return;
         }*/

      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius * 0.5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }


}


export {
  ThemeManager,
  StarSkyTheme,
  CloudsTheme,
  ShootingstarTheme,
  StarplaitTheme,
}