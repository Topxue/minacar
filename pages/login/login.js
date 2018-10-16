// pages/login/login.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dublBtn: false,
    codeDis: false,
    number: 120,
    sendCode: '发送验证码',
    iponeVal: '',
    codeVal: '',
    loading: false,
  },
  sendCodes(e) {
    let iponeVal = this.data.iponeVal;
    if (iponeVal.length != 11 || isNaN(iponeVal)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    } else {
      // 获取验证码
      console.log(iponeVal, iponeVal.length);
      wx.request({
        url: `${app.globalData.url}user/code_byphone`,
        method: 'POST',
        data: {
          phone: iponeVal
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success(res) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
      let stop_set = setInterval(() => {
        if (this.data.number > 0) {
          this.setData({
            sendCode: this.data.number-- + 's',
            codeDis: true
          })
        } else if (this.data.number == 0) {
          clearInterval(stop_set);
          this.setData({
            sendCode: '重新发送',
            number: 120,
            codeDis: false
          })
        }
      }, 1000);
    }
  },
  phoneinput(e) {
    this.setData({
      iponeVal: e.detail.value,
    })
  },
  send_code(e) {
    this.setData({
      codeVal: e.detail.value,
    })
  },
  logingo(e) {
    let iponeVal = this.data.iponeVal,
      codeVal = this.data.codeVal;
    if (iponeVal.length != 11 || isNaN(iponeVal)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    } else if (codeVal.length != 6 || isNaN(codeVal)) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else {
      this.setData({
        loading: true
      })
      // 绑定手机号
      wx.request({
        url: `${app.globalData.url}user/bind_phone`,
        method:'POST',
        data:{
          token: app.globalData.token,
          ipone: iponeVal,
          code: codeVal
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success(res){
          wx.showToast({
            title: res.msg,
            icon: none
          })
        }
      })
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        success() {
          wx.switchTab({
            url: '../my/my'
          });
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      token: options.token
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