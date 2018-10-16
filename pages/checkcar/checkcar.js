// pages/checkcar/checkcar.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selectedone: false,
    seachiptBorder: false,
    saiChecked: true,
    saiCheckedtwo: false,
    saiCheckedthre: false,
    searchCarval: '',
    searchNmae: '',
    activeIndex: null,
    activethreIndex: null,
    curenName: '',
    items: [],
    carItems: [],
    yearItems: [],
  },
  selectedone(e) {
    this.setData({
      selected: false,
      selectedone: true
    })
  },
  selected(e) {
    this.setData({
      selected: true,
      selectedone: false
    })
  },
  checkedLei(e) {
    let that = this;
    that.setData({
      saiChecked: true
    })
    let items = that.data.items;
  },
  // 选择车系
  checkcarXi(e) {
    let that = this;
    that.setData({
      saiCheckedtwo: true,
      activeIndex: e.currentTarget.id
    })
    // 获取汽车型号列表
    wx.request({
      url: `${app.globalData.url}home/car_brand_type`,
      method: 'POST',
      data: {
        id: that.data.activeIndex
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        let carItems = that.data.carItems
        that.setData({
          carItems: res.data.data
        })
      }
    })
  },
  // 选择年款
  checkcaryear(e) {
    let that = this;
    that.setData({
      saiCheckedthre: true
    })
    // 获取汽车子型号列表
    wx.request({
      url: `${app.globalData.url}home/car_brand_son`,
      method: 'POST',
      data: {
        id: e.currentTarget.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        let yearItems = that.data.yearItems;
        that.setData({
          yearItems: res.data.data
        })
      }
    })
  },
  badDolond(e) {
    let that = this;
    if (that.data.activethreIndex == null) {
      wx.showToast({
        title: '请选择车型',
        icon:'none'
      })
    }else{
      wx.redirectTo({
        url: `../maintain/maintain?curenName=${that.data.curenName}&curentId=${that.data.activeIndex}`,
      })
    }
  },
  // 选择年款
  yearCheck(e) {
    let that = this;
    that.setData({
      activethreIndex: e.currentTarget.id,
      curenName: e.currentTarget.dataset.curenname
    })
  },
  // icon品牌
  checkPinoai(e) {
    this.setData({
      saiChecked: false
    })
  },
  // icon车系
  checkChexi(e) {
    this.setData({
      saiCheckedtwo: false
    })
  },
  // icon年款
  checYear(e) {
    this.setData({
      saiCheckedthre: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取汽车品牌列表
    wx.request({
      url: `${app.globalData.url}home/car_brand`,
      method: 'POST',
      success: (res) => {
        this.setData({
          items: res.data.data
        })
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