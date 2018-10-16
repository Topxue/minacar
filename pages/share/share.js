// pages/setting/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
        title: '正久车服邦',
        path: '/pages/index/index',
        success: function (res) {
          // 转发成功
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (res) {
          // 转发失败
        }
    } 
  }
})