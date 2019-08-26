const WXAPI = require('../../wxapi/main')
// pages/search/index.js
Page({
  /**
     * 页面的初始数据
     */
  data: {
    lists: [],              // 接收搜索的内容
    wxSearchData: '',       // 输入的值
    searchVal : '',
    categories: [],
    goodsWrap: [],
    goodsWrapGlobal: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
  },
  initData() {
    let that = this;
    wx.showNavigationBarLoading();
    WXAPI.goodsCategory().then(function (res) {
      var categories = [];
      if (res.code == 0) {
        for (var i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          item.scrollId = "s" + item.id;
          categories.push(item);
          if (i == 0) {
            that.setData({
              categorySelected: item.scrollId,
            })
          }
        }
      }
      that.setData({
        categories: categories,
      });
      console.log(categories);
      that.getGoodsList(0, "");
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });

  },
  getGoodsList: function (categoryId, keyWord) {
    let that = this;
    WXAPI.goods({
      categoryId: "",
      page: 1,
      pageSize: 100000
    }).then(function (res) {
      if (res.code == 404 || res.code == 700) {
        return
      }
      let goodsWrap = [];
      that.data.categories.forEach((o, index) => {
        let wrap = {};
        wrap.id = o.id;
        wrap.scrollId = "s" + o.id;
        wrap.name = o.name;
        let goods = [];
        wrap.goods = goods;
        console.log("come here ")
        res.data.forEach((item, i) => {
          if (keyWord != "") {
            console.log(item.name, keyWord)
            if (item.categoryId == wrap.id &&
              item.name.toLowerCase().indexOf(keyWord) != -1) {
              goods.push(item)
            }
          } else {
            if (item.categoryId == wrap.id) {
              goods.push(item)
            }
          }
        })
        goodsWrap.push(wrap);
      })
      that.setData({
        goodsWrap: goodsWrap,
        goodsWrapGlobal : goodsWrap
      });
      console.log(goodsWrap);
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  /**
     * 搜索
     */
  wxSearchInput: function (value) {
    var that = this;
    console.log(value)
    that.setData(
      {
        'searchVal': value.detail.value.toLowerCase()
      }
    )
  },
  /**
   * 监听软键盘确认键
   */
  wxSearchConfirm: function (e) {
    console.log(this.data.searchVal)
    this.getGoodsList(0, this.data.searchVal)
  },
  /**
   * 返回
   */
  back: function (e) {
    console.log(this.data.searchVal)
    this.getGoodsList(0, this.data.searchVal)
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
})
