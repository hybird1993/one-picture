const Util = {
  getRequest: function(key) {
    const url = location.search; //获取url中"?"符后的字串
    const theRequest = {};
    if (url.indexOf("?") != -1) {
      const str = url.substr(1);
      const strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest[key];
  },

  getCookie: function(name = "auth-token") {
    if (this.getRequest(name)) {
      return this.getRequest(name);
    }
    const strcookie = document.cookie; //获取cookie字符串
    var arrcookie = strcookie.split("; "); //分割
    //遍历匹配
    for (var i = 0; i < arrcookie.length; i++) {
      var arr = arrcookie[i].split("=");
      if (arr[0] == name) {
        return arr[1];
      }
    }
    return "";
  },

  getWebSocketUrl: function() {
    // ws://172.29.1.18:9070/ws/
    const url = process.env.VUE_APP_WEBSOCKET_URL || window.location.hostname,
      port = process.env.VUE_APP_WEBSOCKET_PORT || "9070";
    return `ws://${url}:${port}/ws/`;
  },

  getFontSizeTimes: function(isFullScreen) {
    let size = (window.document.body.offsetWidth / 1920).toFixed(2);
    if (size < 1) {
      size = 1;
    } 
    return isFullScreen ? 3 * size : size;
  },

  /**
   * 文件转成可以在本地预览的格式
   * param {file} file 
   */
  getObjectURL: function(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
      // basic
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  },

  base64ToImg: function(data) {
    return `data:image/jpeg;base64,${data}`;
  },

  getImgUrl(url) {
    return `${process.env.VUE_APP_API}/${url}`;
  },
};

export { Util };
