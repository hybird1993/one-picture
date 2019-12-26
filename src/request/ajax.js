import qs from 'qs';
const ajaxHttp = function (options) {
      /*将数据转化为字符串*/
      var strData = function (data) {
        var dataStr = "";
        for (var key in data) {
          dataStr += key + '=' + data[key] + '&';
        }
        dataStr = dataStr && dataStr.slice(0, -1);
        return dataStr;
      };
      /*创建 XMLHttpRequest 对象*/
      var createXHR = function () {
        return new XMLHttpRequest()
      };
      /*向服务器发送请求*/
      var open = function (xhr, type, url, async) {
        xhr.open(type, url, async);
        xhr.withCredentials = true; //支持跨域发送cookies
      };
      var send = function (xhr, msg) {
        xhr.send(msg);
      };
      var setHeaders = function (xhr, headers) {
        if (!headers['Content-Type']) {
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        if (!headers) {
          return false;
        }
        for (var key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }
      var request = function (xhr, opts) {
        opts.async = true;
        if (opts.type === "GET") {
          const url = process.env.VUE_APP_API + opts.url + (opts.url.includes('?') ?  '&' : strData(opts.data) ? '?' : '') + strData(opts.data);
          open(xhr, opts.type, url, opts.async);
          send(xhr, null);
        } else if (opts.type === "POST") {
          open(xhr, opts.type, process.env.VUE_APP_API + opts.url, opts.async);
          if (opts.headers) {
            setHeaders(xhr, opts.headers);
          }
          send(xhr, qs.stringify(opts.data));
        }
      };
      return new Promise((resolve, reject) => {
        if (!options || typeof options != 'object') {
          reject(new Error("参数错误，请传入对象参数！"));
          return false;
        }
        if (!options.url) {
          reject(new Error("url不能为空"));
          return false;
        }
        options.type = options.type ? options.type.toUpperCase() : 'GET';
        options.async = (options.async && options.async === false) ? false : true;
        options.dataType = options.dataType || "json";
        options.data = options.data || {};
        options.headers = options.headers || {};
        /*创建 XMLHttpRequest 对象*/
        var xhr = createXHR();
       
        /*创建服务器返回响应后执行操作函数*/
        xhr.onreadystatechange = function () {
          var responseData;
          if (xhr.readyState == 4) {
            switch (xhr.status) {
              case 200:
                switch (options.dataType) {
                  case "xml":
                    responseData = xhr.responseXML;
                    break;
                  case "text":
                    responseData = xhr.responseText;
                    break;
                  case "json":
                    responseData = xhr.responseText ? JSON.parse(xhr.responseText) : xhr.responseText;
                    break;
                }
                resolve(responseData);
                break;
              default:
                reject(new Error("这里做错误处理"));
            }
          }
        };
        /*向服务器发送请求*/
        request(xhr, options);
      })
    };

export function get(url, params) {
  return new Promise((resolve, reject) => {
    ajaxHttp({
      url,
      type: 'GET',
      data: params,
    }).then(res => {
      // console.log(res);
      resolve(res);
    })
    .catch(err => {
      reject(err)
    })
  });
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    ajaxHttp({
      url,
      type: 'POST',
      data: params,
    }).then(res => {
      // console.log(res);
      resolve(res);
    })
    .catch(err => {
      reject(err)
    })
  });
}
