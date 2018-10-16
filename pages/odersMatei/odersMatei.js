// pages/odersMatei/odersMatei.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    odersDateil: [], //订单详情
    states: '', //订单状态
    ogList: [], //商品详情
    orderId: '' // 订单编号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderId: options.order_id
    })
    wx.showLoading({
      title: '加载中',
    })
    // 时间戳转化为时间
    const timetrans = (date) => {
      var date = new Date(date * 1000); //如果date为10位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m + s;
    }
    // 获取订单详情
    wx.request({
      url: `${app.globalData.url}order/order_detail`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        order_id: options.order_id
      },
      success: res => {
        let statsOder = res.data.data.state; // 订单状态
        res.data.data.create_time = timetrans(res.data.data.create_time);
        switch (statsOder) {
          case 1:
            this.setData({
              states: '待付款'
            })
            break;
          case 2:
            this.setData({
              states: '待接单'
            })
            break;
          case 3:
            this.setData({
              states: '进行中'
            })
            break;
          case 4:
            this.setData({
              states: '已完成'
            })
            break;
          case 5:
            this.setData({
              states: '已取消'
            })
            break;
          case 6:
            this.setData({
              states: '退款中'
            })
            break;
          case 7:
            this.setData({
              states: '已退款'
            })
            break;
        }
        this.setData({
          odersDateil: [res.data.data],
          ogList: res.data.data.ogList
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 100)
        console.log(this.data.ogList)
      }
    })
  },
  // 支付
  goToBys() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.url}order/order_pay`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        order_id: this.data.orderId
      },
      success: res => {
        console.log(res.data.data)
        if (res.data.state == 1){
          setTimeout(() => {
            wx.hideLoading()
            wx.requestPayment(
              {
                'appId': res.data.data.appId,
                'timeStamp': res.data.data.timeStamp,
                'nonceStr': res.data.data.nonceStr,
                'package': res.data.data.package,
                'signType': 'MD5',
                'paySign': res.data.data.paySign,
                'success': function (res) { 
                  console.log(res)
                },
                'fail': function (res) { },
                'complete': function (res) { }
              })
          }, 200)
        }else{
          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }, 200)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})