var app = getApp();
const API_BASE_URL = app.server


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
  getUserAdded: (data) => {
    return request('/v1/user/added', 'GET', data)
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
    return request('/v1/product/add', 'POST', data)
  },
  click : (data) => {
    return request('/v1/product/click', 'POST', data)
  }
}