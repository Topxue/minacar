// pages/address/addAddr.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getAddress: {},
    sex: 1,
    card: 0,
    isDefault: 0,
    setSite: null,
    xianz: 1,
    aid: 0,
    types_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    let a_id = options.a_id;
    let types_id = options.typs_id;
    that.setData({
      types_id: types_id
    })
    if (options.aid != undefined) {
      var aid = options.aid;
      that.setData({
        aid: aid
      })
      if (JSON.stringify(options) != '{}') {
        wx.request({
          url: `${app.globalData.url}user/address_detail`,
          method: 'POST',
          data: {
            token: app.globalData.token,
            a_id: aid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var setSite = res.data.data;

            that.setData({
              getAddress: setSite,
              isDefault: setSite.isDefault,
            })
          }
        })
      }
    } else {
      this.setData({
        xianz: 0
      })
    }
    // 收件地址详情
    if (types_id == 1 || types_id == '1') {
      wx.request({
        url: `${app.globalData.url}user/address_detail`,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: app.globalData.token,
          a_id
        },
        success: res => {
          that.setData({
            getAddress: res.data.data
          })
        }

      })
    }

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

  },

  /**
   * 获取文本框内容
   */
  getInputVal: function (e) {
    var key = e.currentTarget.dataset.key;
    var val = e.detail.value;
    this.setData({
      [key]: val
    })
  },

  /**
   * 选择地址
   */
  chooseAddr: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var getAddress = that.data.getAddress;
        getAddress.lat = res.latitude;
        getAddress.lng = res.longitude;
        var addr = res.address;
        addr = addr.substring(addr.indexOf("市") + 1);
        addr = res.name + " " + addr
        getAddress.addr_name = addr;
        that.setData({
          getAddress: getAddress
        })
      }
    })
  },

  /**
   * 由于文本框失去焦点赋值有可能晚于按钮点击事件 延迟100毫秒执行保存
   */
  timeOutMethod: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading();
      that.saveAddress();
    }, 100)
  },

  /**
   * 保存添加
   */
  saveAddress: function () {
    var that = this;
    var addr = that.data.getAddress;
    console.log(addr);
    if (addr.username == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: "none"
      })
      return;
    }
    if (addr.phone.length != 11) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: "none"
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var url = ""
    console.log(that.data.xianz);
    if (that.data.xianz == 1) {
      url = "user/set_address"
      if (addr.addr_detail == undefined) {
        addr.addr_detail = ""
      }
      wx.request({
        url: `${app.globalData.url}${url}`,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          token: app.globalData.token,
          lng: addr.lng,
          lat: addr.lat,
          username: addr.username,
          phone: addr.phone,
          addr_name: addr.addr_name,
          addr_detail: addr.addr_detail,
          isDefault: that.data.isDefault,
          a_id: that.data.aid
        },
        success: function (obj) {
          console.log(obj);
          setTimeout(() => {
            wx.hideLoading();
          }, 100)
          if (obj.data.state == 1 || obj.data.state == "1") {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
      url = "user/add_address";
      if (addr.addr_detail == undefined) {
        addr.addr_detail = ""
      }
      wx.request({
        url: app.globalData.url + url,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          token: app.globalData.token,
          lng: addr.lng,
          lat: addr.lat,
          username: addr.username,
          phone: addr.phone,
          addr_detail: addr.addr_name,
          addr_detail: addr.addr_detail,
          isDefault: that.data.isDefault
        },
        success: function (obj) {
          console.log(obj.data);
          setTimeout(() => {
            wx.hideLoading();
          }, 100)
          if (obj.data.state == 1 || obj.data.state == "1") {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }

  },
  setCard: function () {
    var that = this;
    if (that.data.isDefault == 0) {
      that.setData({
        isDefault: 1
      })
    } else {
      that.setData({
        isDefault: 0
      })
    }
    console.log(that.data.isDefault)
  }
})