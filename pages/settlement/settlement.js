// pages/settlement/ settlement.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressLIst: [],
    shopLists: [],
    piceNumber: 0,
    showList: false, //地址显示类型
    checkMove: 0,
    aId: null, //收货地址编号
    sId: null, //服务站收货地址编号
    beizhuCont: '', //订单备注
    username: '', //服务站收货姓名
    phone: '', //服务站收货电话
    type_show: 0, // 支付类型
    shopCount: 0, //商品数量
    goods_id: 0 //商品编号
  },
  // 新增地址
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 300)
    const _that = this;
    if (options.types == 2 || options.types == '2') {
      _that.setData({
        showList: true,
        checkMove: options.types
      })
    } else {
      _that.setData({
        showList: false
      })
    }
    let allPrice = options.totalPrice;
    this.setData({
      number: options.number,
      piceNumber: allPrice,
      price: options.price,
      shopCount: options.shopCount,
      shopImg: options.shopImg,
      titleName: options.titleName,
      goods_id: options.goods_id,
      type_show: options.type_show
    })
  },
  // 选择配送类型
  checkLei() {
    const _that = this;
    wx.showActionSheet({
      itemList: ['快递配送', '服务站领取'],
      success(e) {
        if (e.tapIndex == 1) {
          wx.navigateTo({
            url: '../address/address?type_id=2',
          })
          // _that.setData({
          //   checkMove: 2
          // })
        } else if (e.tapIndex == 0) {
          _that.setData({
            checkMove: 1
          })
          if (_that.data.aId == '' || _that.data.aId == undefined) {
            wx.showToast({
              title: '请选择快递配送地址',
              icon: 'none'
            })
            return false
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const _that = this;
    // 获取已选商品
    let shopList = wx.getStorageSync('shopList');
    _that.setData({
      shopLists: shopList
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取收货地址
    const _that = this;
    // console.log(app.globalData.types_id)
    _that.setData({
      checkMove: app.globalData.types_id
    })
    let addressDate = wx.getStorageSync('address');
    if (addressDate.s_id == '' || addressDate.s_id == undefined) {
      _that.setData({
        showList: false
      })
    } else {
      _that.setData({
        showList: true
      })
    }
    _that.setData({
      addressLIst: addressDate,
      aId: addressDate.a_id,
      sId: addressDate.s_id,
      username: addressDate.name,
      phone: addressDate.phone
    })
    console.log(_that.data.aId, _that.data.sId)
    console.log(addressDate)
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

  },
  // 提交订单备注
  beizVal(e) {
    this.setData({
      beizhuCont: e.detail.value
    })
  },
  // 去结算
  goToBy() {
    const _that = this;
    console.log(_that.data.checkMove)
    let addressDate = wx.getStorageSync('address');
    if (addressDate == '' || addressDate == undefined) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return;
    } else if (_that.data.checkMove == 0) {
      wx.showToast({
        title: '请选择配送类型',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      icon: 'loadding'
    })
    if (_that.data.type_show == 1) {
      //商品详情提交订单
      wx.request({
        url: `${app.globalData.url}order/create_order_bygoods`,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          token: app.globalData.token,
          goods_id: _that.data.goods_id,
          goods_count: _that.data.shopCount,
          sendtype: _that.data.checkMove,
          send_id: _that.data.aId || _that.data.sId,
          username: _that.data.username,
          phone: _that.data.phone,
          remark: _that.data.beizhuCont
        },
        success: res => {
          console.log(res.data)
          console.log(res.data.data.order_id)
          // 支付订单
          wx.request({
            url: `${app.globalData.url}order/order_pay`,
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: app.globalData.token,
              order_id: res.data.data.order_id
            },
            success: res => {
              wx.hideLoading()
              wx.requestPayment({
                'appId': res.data.data.appId,
                'timeStamp': res.data.data.timeStamp,
                'nonceStr': res.data.data.nonceStr,
                'package': res.data.data.package,
                'signType': 'MD5',
                'paySign': res.data.data.paySign,
                'success': (res) => {
                  console.log(res)
                },
                'fail': (res) => {
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    wx.showToast({
                      title: '取消支付',
                      icon: 'none'
                    })
                  } else if (res.errMsg == 'requestPayment:fail (detail message)') {
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none'
                    })
                  }
                },
                'complete': function (res) { }
              })
              console.log(res.data.data)
            }
          })
        }
      })
      return;
    } else {
      let shopCont = _that.data.shopLists;
      let good_id = [];
      if (_that.data.checkMove == 1 || _that.data.checkMove == '1') {
        for (let gsid of shopCont) {
          good_id.push(gsid.goods_id);
        }
        let goods_id_str = good_id.join(',')
        console.log(goods_id_str)
        wx.request({
          url: `${app.globalData.url}order/create_order_bycar`,
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            token: app.globalData.token,
            goods_id_str: goods_id_str,
            sendtype: _that.data.checkMove,
            send_id: _that.data.aId,
            remark: _that.data.beizhuCont
          },
          success: res => {
            if (res.data.state == 0) {
              setTimeout(() => {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }, 100)
            } else {
              setTimeout(() => {
                console.log(res.data.data.order_id)
                // 支付订单
                wx.request({
                  url: `${app.globalData.url}order/order_pay`,
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    token: app.globalData.token,
                    order_id: res.data.data.order_id
                  },
                  success: res => {
                    wx.hideLoading()
                    wx.requestPayment({
                      'appId': res.data.data.appId,
                      'timeStamp': res.data.data.timeStamp,
                      'nonceStr': res.data.data.nonceStr,
                      'package': res.data.data.package,
                      'signType': 'MD5',
                      'paySign': res.data.data.paySign,
                      'success': (res) => {
                        console.log(res)
                      },
                      'fail': (res) => {
                        if (res.errMsg == 'requestPayment:fail cancel') {
                          wx.showToast({
                            title: '取消支付',
                            icon: 'none'
                          })
                        } else if (res.errMsg == 'requestPayment:fail (detail message)') {
                          wx.showToast({
                            title: '支付失败',
                            icon: 'none'
                          })
                        }
                      },
                      'complete': function (res) { }
                    })
                    console.log(res.data.data)
                  }
                })
              }, 100)
            }
            // console.log(res.data)
          }
        })
        console.log('This is 1')
        return;
      } else if (_that.data.checkMove == 2 || _that.data.checkMove == '2') {
        console.log('This is 2')
        for (let gsid of shopCont) {
          good_id.push(gsid.goods_id);
        }
        let goods_id_str = good_id.join(',')
        wx.request({
          url: `${app.globalData.url}order/create_order_bycar`,
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            token: app.globalData.token,
            goods_id_str: goods_id_str,
            sendtype: _that.data.checkMove,
            send_id: _that.data.sId,
            username: _that.data.username,
            phone: _that.data.phone,
            remark: _that.data.beizhuCont || ''
          },
          success: res => {
            if (res.data.state == 0) {
              setTimeout(() => {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }, 100)
            } else {
              setTimeout(() => {
                wx.hideLoading()
              }, 100)
              // 支付订单
              wx.request({
                url: `${app.globalData.url}order/order_pay`,
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                  token: app.globalData.token,
                  order_id: res.data.data.order_id
                },
                success: res => {
                  wx.hideLoading()
                  wx.requestPayment({
                    'appId': res.data.data.appId,
                    'timeStamp': res.data.data.timeStamp,
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data.package,
                    'signType': 'MD5',
                    'paySign': res.data.data.paySign,
                    'success': (res) => {
                      console.log(res)
                    },
                    'fail': (res) => {
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '取消支付',
                          icon: 'none'
                        })
                      } else if (res.errMsg == 'requestPayment:fail (detail message)') {
                        wx.showToast({
                          title: '支付失败',
                          icon: 'none'
                        })
                      }
                    },
                    'complete': function (res) { }
                  })
                  console.log(res.data.data)
                }
              })
            }
            console.log(res.data)
          }
        })
        console.log('This is 2')
        return;
      }
    }


  }
})