const app = getApp()
Page({
  data: {
    background: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    removeIocn: true,
    carCheckNmae: '请选择车型匹配爱车服务',
    seachText: '',
    hostShoplist: [] //获取热销商品
  },
  // 删除checkcar
  removeCheckcar(e) {
    this.setData({
      carCheckNmae: '请选择车型匹配爱车服务',
      removeIocn: true
    })
    app.globalData.carCheck = '';
  },
  openWindow(e) {
    if (app.globalData.carCheck == '') {
      wx.showToast({
        title: '加载中',
        icon:'loading',
        success(){
          wx.navigateTo({
            url: '../checkcar/checkcar',
          })
        }
      })
    } else {
     wx.showToast({
       title: '加载中',
       icon:'loading',
       success() {
         wx.navigateTo({
           url: `../maintain/maintain?curenName=${app.globalData.carCheck}`,
         })
       }
     })
    }

  },
  // 商品详情
  loetOderdail(e) {
    let goods_id = e.currentTarget.dataset.goods_id;
    wx.showToast({
      title: '加载中',
      icon:'loading',
      success() {
        wx.navigateTo({
          url: `../orderdetails/orderdetails?goods_id=${goods_id}`,
        })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取商品主分类列表
    wx.request({
      url: `${app.globalData.url}home/type_list`,
      method: 'POST',
      success: (res) => {
        that.setData({
          returnData: res.data.data,
        })
      }
    })
    // 轮播图列表
    wx.request({
      url: `${app.globalData.url}home/banner_list`,
      method: 'POST',
      data: {},
      success: res => {
        that.setData({
          background: res.data.data
        })
      }
    })
    // 获取热销商品
    wx.request({
      url: `${app.globalData.url}home/hot_list`,
      method:'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {},
      success: res=>{
        that.setData({
          hostShoplist: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (app.globalData.carCheck == '') {
      return;
    } else {
      that.setData({
        carCheckNmae: app.globalData.carCheck,
        removeIocn: false
      })
    }
  },
  // 获取搜索input Value
  getValue(e) {
    const _that = this;
    _that.setData({
      seachText: e.detail.value
    })
  },
  // 搜索商品
  seachShop() {
    const _that = this;
    let searchText = _that.data.seachText;
    if (searchText == '' || searchText == undefined) {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        success() {
          _that.setData({
            seachText: ''
          })
          wx.navigateTo({
            url: `../detailslei/detailslei?searchText=${searchText}&son_id=0&type_id=0`,
          })
        }
      })
    }
  },
  // 我的
  myCnter() {
    wx.switchTab({
      url: '../my/my',
    })
  }
})