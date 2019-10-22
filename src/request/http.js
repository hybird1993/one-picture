/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = process.env.VUE_APP_API;

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

axios.defaults.withCredentials = true;    // 请求带上cookie

// if (getCookie()) {
//   document.cookie = `auth-token=${getCookie()};Path=/`;
//   alert(`document.cookie: ${document.cookie}`)
// }
// axios.defaults.headers.Cookie = `auth-token=${getRequest()}`;    // 请求带上cookie

// 请求拦截器
// axios.interceptors.request.use( 
//  config => {
//   // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
//   // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
//   // eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjgyNjgxNzMsInN1YiI6IjIzIiwiaXNzIjoid2ViIiwiZXhwIjoxNTY4MjY5OTczfQ.ARMkZFPL7KPr9dADE8brzoOqcu6LDuk-z8OnLbP7hAw
//   const token = getRequest().token;  
//   // if (token) {
//   //   // config.xsrfCookieName = 'Cookie';
//   //   config.headers.Cookie = `auth-token=${token}`
//   // }
//   // config.headers.token = `12345`
//   config.xsrfCookieName = `auth-token`;
//   config.xsrfHeaderName = `Cookie`;
//   config.headers.Cookie = `auth-token=${token}`;
//   console.log(config)
//   return config; 
//  }, 
//  error => {  
//   return Promise.error(error); 
//  })

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // alert(response.status)
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况 
  error => {
    alert(error)
    if (error.response.status) {
      return Promise.reject(error.response);
    }
  }
);
/** 
 * get方法，对应get请求 
 * param {String} url 请求的url地址
 * param {Object} params 请求时携带的参数
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    // document.cookie = `auth-token=${getRequest().token}`;
    axios.get(url, {
        params: params,
      })
      .then(res => {
        // console.log(res);
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/** 
 * post方法，对应post请求 
 * param {String} url 请求的url地址
 * param {Object} params 请求时携带的参数 
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params))    // 参数序列化
      .then(res => {
        // console.log(res);
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

function getCookie(name = 'auth-token') {
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
}