'use strict';
const app = getApp();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    html: '',
    current3: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    tabStyle: {
      'flex': '0 0 40px'
    },
    background: [],
    shopNumCar: 0, //购物车数量
    price: 0, // 商品单价
    titleName: '', // 商品名称
    shopImg: '', // 商品图片
    goods_id: 0, //商品编号
    shopNum: 0 //购买人数
  },
  handleChange3: function handleChange3(e) {
    var index = e.detail.index;
    this.setData({
      current3: index
    });
  },
  handleContentChange3: function handleContentChange3(e) {
    var current = e.detail.current;
    this.setData({
      current3: current
    });
  },
  swichload(e) {
    wx.switchTab({
      url: '../index/index',
    })
  },
  shopCarload(e) {
    wx.switchTab({
      url: '../shop/shop',
    })
  },
  onLoad(options) {
    let that = this;
    let goods_id = options.goods_id;
    that.setData({
      goods_id: options.goods_id
    })
    // 获取商品详情
    wx.request({
      url: `${app.globalData.url}goods/goods_detail`,
      data: {
        goods_id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      success(res) {
        that.setData({
          shopNum: res.data.data.sale_count,
          html: res.data.data.detail,
          price: res.data.data.price,
          titleName: res.data.data.name,
          shopInfo: res.data.data.intro,
          otherPrice: res.data.data.other_price,
          shopImg: res.data.data.image1,
          goods_id: res.data.data.goods_id,
          background: [res.data.data]
        })
      },
    });
    // 获取购物车列表数量
    wx.request({
      url: `${app.globalData.url}goods/shopcar_list`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token
      },
      success: res => {
        that.setData({
          shopNumCar: res.data.data.length
        })
      }
    })
    // 商品评价列表
    wx.request({
      url: `${app.globalData.url}goods/goods_discuss`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        goods_id
      },
      success: res => {
        console.log(res.data.data)
      }

    });
  },
  // 一键购买
  goToByf() {
    wx.navigateTo({
      url: `../settlement/settlement?shopCount=${app.globalData.shopCount}&totalPrice=${app.globalData.shopCount * this.data.price}&shopImg=${this.data.shopImg}&price=${this.data.price}&titleName=${this.data.titleName}&type_show=1&goods_id=${this.data.goods_id}`,
    })
  },
  // 加入购物车
  addShopCar() {
    wx.request({
      url: `${app.globalData.url}goods/add_shopcar`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        goods_id: this.data.goods_id,
        goods_count: app.globalData.shopCount
      },
      success: res => {
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        })
      }
    })
  }
});