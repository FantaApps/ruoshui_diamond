var app = getApp();
const API_BASE_URL = app.server
var sha256 = require("sha256.js");

const request = (url, method, data) => {
  let _url = API_BASE_URL + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

const requestTencent = (url, method, data) => {
  console.log(url)
  let _url = url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        console.log("wrong here")
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  addUserAccount: (data) => {
    return request('/v1/user/add', 'POST', data)
  },
  getUserAdded : (data) => {
    return request('/v1/user/added', 'GET', data)
  },
  getUserGranted: (data) => {
    return request('/v1/user/granted', 'GET', data)
  },
  updateUserAccount: (data) => {
    return request('/v1/user/update', 'PUT', data)
  },
  addVipDevelop: (data) => {
    return request('/v1/user/develop', 'POST', data)
  },
  updateVipDevelop: (data) => {
    return request('/v1/user/develop/update', 'PUT', data)
  },
  addProduct: (data) => {
    console.log(data)
    return request('/v1/product/add', 'POST', data)
  },
  getProductId : (data) => {
    console.log(data)
    return request('/v1/product', 'GET', data)
  },
  getUnconfirmedPurchase: (data) => {
    return request('/v1/product/sale/unconfirmed', 'GET', data)
  },
  confirmPurchase: (data) => {
    return request('/v1/product/purchase', 'PUT', data)
  },
  getOpenId: (data) => {
    return request('/v1/project/openid', 'GET', data)
  },
  click: (data) => {
    return request('/v1/product/click', 'POST', data)
  },
  sendMsg: (data) => {
    let strRand = Math.floor(Math.random() * 100000).toString()
    let strAppKey = "7a3fe6cca5a60db6b94ec14da9160c48";
    let strMobile = data["tel"]["mobile"]
    let strTime = data["time"]
    let sig = sha256.sha256_digest(`appkey=${strAppKey}&random=${strRand}&time=${strTime}&mobile=${strMobile}`).toString();
    data['sig'] = sig
    console.log(data)
    return requestTencent("https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid=1400253354&random=" + strRand, "POST", data)
  }
}
