// pages/setmsg/setmsg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    myPhone:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    wx.showLoading({
      title: '加载中',
    })
    let token = app.globalData.token;
    let _that = this;
    let userInfo = _that.data.userInfo;
    wx.request({
      url: `${app.globalData.url}user/user_info`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token
      },
      success: res=>{
        let userInfo = _that.data.userInfo;
        let myphone = res.data.phone;
        userInfo.push(res.data.data);
        if (myphone == undefined || myphone == ''){
          _that.setData({
            myPhone: true
          })
        }
        _that.setData({
          userInfo: userInfo
        })
        setTimeout(() => {
          wx.hideLoading();
        },100)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})