// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    loginState: null // 登录状态
  },
  // setmsg(e) {
  //   if(this.data.loginState == true){
  //     wx.navigateTo({
  //       url: '../setmsg/setmsg',
  //     })
  //   }
  // },
  // 收货地址
  addressadd() {
    wx.navigateTo({
      url: '../address/address?type_id=1',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo == ''){
      this.setData({
        loginState: false
      })
    }else{
      this.setData({
        loginState: true
      })
    }
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
    this.onLoad();
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
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

  },
  // 获取用户信息
  getUserInfo(e) {
    // console.log(e);
    let that = this;
    let encryptedData = e.detail.encryptedData,
      iv = e.detail.iv;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // 用户登录
      wx.login({
        success(res) {
          let code = res.code;
          // 用户登录
          wx.request({
            url: `${app.globalData.url}user/login`,
            method: 'POST',
            data: {
              code,
              encryptedData,
              iv
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
              if (res.data.state == 0) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              } else if (res.data.state == 2) {
                wx.setStorageSync('userInfo', res.data.data);
                app.globalData.userInfo = wx.getStorageSync('userInfo');
                app.globalData.token = res.data.data.token;
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  success() {
                    that.setData({
                      userInfo: wx.getStorageSync('userInfo')
                    });
                    setTimeout(function() {
                      wx.navigateTo({
                        url: `../login/login?token=${res.data.data.token}`,
                      })
                    }, 2000)
                  }
                })
              } else if (res.data.state === 1) {
                wx.setStorageSync('userInfo', res.data.data);
                app.globalData.userInfo = wx.getStorageSync('userInfo');
                app.globalData.token = res.data.data.token;
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                })
              }
            }
          })
        }
      });
    }
  },
  // 跳转到订单
  gotoOder() {
    app.globalData.types = 0;
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
  // 待付款
  payMent() {
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
  // 待签收
  signIn() {
    app.globalData.types = 2;
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
  // 已完成
  compLeted() {
    app.globalData.types = 4;
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
  // 已取消
  cancelled() {
    app.globalData.types = 5;
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
  // 分享
  shareSend() {
   wx.navigateTo({
     url: '../share/share',
   })
  },
  // 拨打电话
  tellPhone() {
    wx.makePhoneCall({
      phoneNumber: '13488698688',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }
})