// pages/MassageList/MassageList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    masgList: [],
    showAndnone:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.showLoading({
      title: '加载中',
    })
    // 用户消息列表
    let _that = this;
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
    wx.request({
      url: `${app.globalData.url}user/user_msg`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token
      },
      success: res => {
        let masgData = res.data.data;
        if (masgData.length <= 0){
          _that.setData({
            showAndnone: false
          })
        }
        masgData.forEach((i, v) => {
          i.create_time = timetrans(i.create_time)
        })
        _that.setData({
          masgList: res.data.data
        })
        setTimeout(() => {
          wx.hideLoading();
        },100)
      }
    })

  },
  // 清空消息列表
  removeMsg() {
    wx.showModal({
      title: '提示',
      content: '清空消息列表',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            success() {
              wx.request({
                url: `${app.globalData.url}user/clear_msg`,
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                  token: app.globalData.token
                },
                success: res=>{
                  wx.showToast({
                    title: '操作成功',
                    icon:'success'
                  })
                }
              })
            }
          })
        }
      }
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

  }
})