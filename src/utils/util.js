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
  
  getCookie: function(name = 'auth-token') {
    const strcookie = document.cookie; //获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for ( var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split("=");
    if (arr[0] == name){
    return arr[1];
    }
    }
    return "";
  },
}

export {
  Util
};