App({
  onLaunch: function () {
  },
  globalData:{
    url:'https://www.chefubang.com.cn/app/', // 全局参数
    carCheck:'',
    userInfo: wx.getStorageSync('userInfo'),
    token: wx.getStorageSync('userInfo').token, // 用户token
    types:0, // 跳转订单类型
    types_id: 0, // 支付订单类型
    s_id: null, // 服务站领取地址编号
    shopCount: 1 // 商品详情购买数量
  }
})
