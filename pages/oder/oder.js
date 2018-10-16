const app = getApp();
let page = 0;
let sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: [{
        "conten": '全部'
      },
      {
        "conten": '待付款'
      },
      {
        "conten": '待接单'
      },
      {
        "conten": '进行中'
      },
      {
        "conten": '已完成'
      },
      {
        "conten": '已取消'
      },
    ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    odersLIst: [],
    ogListder: [],
  },
  // 获取订单列表
  onLoad: function(options) {
    const _that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.url}order/order_list`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        state: app.globalData.types,
        page: 0
      },
      success: res => {
        _that.setData({
          odersLIst: res.data.data
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 100)
        _that.data.odersLIst.forEach((item) => {
          _that.setData({
            ogListder: item.ogList
          })
        })
        // console.log(_that.data.ogListder)
      }
    })
  },
  onShow() {
    var that = this;
    that.onLoad();
    let typesNum = app.globalData.types;
    if (typesNum != '' || typesNum != undefined) {
      that.setData({
        activeIndex: typesNum
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 55) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  // 上拉加载
  onReachBottom() {
    let _that = this;
    let odersLIst = _that.data.odersLIst;
    page += 1;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.url}order/order_list`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        state: _that.data.state || 0,
        page: page
      },
      success: res => {
        if (res.data.data.length == 0) {
          wx.hideLoading();
          wx.showToast({
            title: '无更多内容',
            icon: 'none'
          })
          return;
        } else {
          res.data.data.forEach(item => {
            odersLIst.push(item)
          })
          _that.setData({
            odersLIst: odersLIst
          })
          wx.hideLoading();
        }
      }

    })
  },
  tabClick: function(e) {
    // console.log(e.currentTarget.id)
    const _that = this;
    _that.setData({
      state: e.currentTarget.id
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.url}order/order_list`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        state: _that.data.state,
        page: 0
      },
      success: res => {
        _that.setData({
          odersLIst: res.data.data
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 100)
        _that.data.odersLIst.forEach((item) => {
          _that.setData({
            ogListder: item.ogList
          })
        })
        // console.log(_that.data.ogListder)
      }
    })
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 取消订单
  removeOder() {
    wx.request({
      url: `${app.globalData.url}order/cancel_order`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        order_id: this.data.ogListder[0].order_id,
      },
      success: res => {
        setTimeout(() => {
          wx.hideLoading()
        }, 100)
        wx.showToast({
          title: res.data.msg,
        })
        console.log(res.data)
      }
    })
  },
  // 提醒发货
  remindSend() {
    wx.request({
      url: `${app.globalData.url}order/alert_order`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        order_id: this.data.ogListder[0].order_id,
      },
      success: res => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 用户确认收货
  sureCollect() {
    wx.request({
      url: `${app.globalData.url}order/finish_order`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        order_id: this.data.ogListder[0].order_id,
      },
      success: res => {
        if (res.data.state == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 支付订单
  goToByoder(e) {
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: `${app.globalData.url}order/order_pay`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        order_id: this.data.ogListder[0].order_id,
      },
      success: res => {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.state == 1) {
          wx.requestPayment({
            'appId': res.data.data.appId,
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': (res) => {
              app.globalData.types = 3;
              wx.showToast({
                title: '加载中',
                icon: 'loading',
                success() {
                  wx.switchTab({
                    url: '../oder/oder',
                  })
                }
              })
            },
            'fail': (res) => {
              app.globalData.types = 1;
              wx.showToast({
                title: '加载中',
                icon: 'loading',
                success() {
                  wx.switchTab({
                    url: '../oder/oder',
                  })
                }
              })
            },
            'complete': function(res) {}
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      }
    })
  }
});