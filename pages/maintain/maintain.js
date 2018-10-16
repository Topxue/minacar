// pages/maintain/maintain.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    curNav: 3,
    curIndex: 0,
    show2: false,
    iconSlement: false,
    btnDisable: true,
    shopNums: 0,
    moneyNums: 0,
    curenNmaes: '',
    shoppingCart: [],
    navLeft: [],
    car_id: null,
    id: null,
    cateItems: [],
    nameItems: [],
    check_bgs: 0 //品牌背景色
  },
  switchRightTab: function(e) {
    let that = this;
    // 获取item项的id，和数组的下标值
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    let car_id = that.data.car_id;
    that.setData({
      id: id
    })
    // 根据主分类获取品牌列表
    wx.request({
      url: `${app.globalData.url}home/brand_bytype`,
      method: 'POST',
      data: {
        id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data.data)
        that.setData({
          nameItems: res.data.data
        })
      }
    })
    // 根据汽车型号获取适用商品列表
    wx.request({
      url: `${app.globalData.url}goods/goods_bycar`,
      method: 'POST',
      data: {
        type_id: id,
        car_id,
        brand_id: 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data.data);
        that.setData({
          cateItems: res.data.data
        })
      }
    })
    // 把点击到的某一项，设为当前index
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  // 点击切换
  checkcarLoad(e) {
    wx.navigateTo({
      url: '../checkcar/checkcar',
    })
  },
  // 
  // 商品加入购物车
  addShopping(e) {
    console.log(e);
    let that = this;
    let id = e.currentTarget.dataset.goods_id;
    let cateItems = that.data.cateItems;
    let curNav = that.data.curNav;
    let moneyNums = that.data.moneyNums;
    let shoppingCart = that.data.shoppingCart;
    //商品加入购物车
    wx.request({
      url: `${app.globalData.url}goods/add_shopcar`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        goods_id: id,
        goods_count: 1
      },
      success: res => {
        if (res.data.state == 1) {
          return;
        } else {
          wx.showToast({
            title: res.data.msg
          })
        }
      }
    })
    for (let i = 0; i < cateItems.length; i++) {
      if (cateItems[i].goods_id == id) {
        let shopNum = ++that.data.shopNums;
        let moneyNum = cateItems[i].price;
        let ArrayIndexOf = that.ArrayIndexOf(shoppingCart, id);
        if (ArrayIndexOf == -1) {
          cateItems[i].num = 1;
          shoppingCart.push(cateItems[i])
        } else {
          shoppingCart[ArrayIndexOf].num = shoppingCart[ArrayIndexOf].num + 1;
        }
        that.setData({
          shopNums: shopNum,
          shoppingCart: shoppingCart,
          moneyNums: moneyNums + moneyNum,
          iconSlement: true,
          btnDisable: false
        })

      }
    }
  },
  openPopup2: function openPopup2(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      show2: show
    });
  },
  handleShow2: function handleShow2() {
    let that = this;
    if (that.data.shoppingCart.length == 0) {
      return;
    }
    wx.showModal({
      title: '提示',
      content: '是否清空吗？',
      success: function(res) {
        let shopCatlist = that.data.shoppingCart;
        let goods_id = [];
        if (res.confirm) {
          shopCatlist.forEach((i, v) => {
            return goods_id.push(i.goods_id)
          })
          let goods_ids = goods_id.join(',');
          // 从购物车删除商品
          wx.request({
            url: `${app.globalData.url}goods/remove_shopcar`,
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: app.globalData.token,
              goods_ids,
            },
            success: res => {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              that.setData({
                show2: false,
                shoppingCart: [],
                moneyNums: 0,
                shopNums: 0,
                iconSlement: false,
                btnDisable: true
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  ArrayIndexOf: function(arr, value) {
    // 检测value在arr中出现的位置
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].goods_id === value) {
        return i;
      }
    }
    return -1;
  },
  // add++
  prevNum(e) {
    const that = this;
    let goods_id = e.target.dataset.goods_id;
    console.log(goods_id)

    const shoppingCartI = that.data.shoppingCart;
    let curenIdex = e.currentTarget.dataset.index;
    let num = shoppingCartI[curenIdex].num;
    let pice = shoppingCartI[curenIdex].price;
    let shopNums = that.data.shopNums;
    let moneyNums = that.data.moneyNums;
    num = num + 1;
    shoppingCartI[curenIdex].num = num;
    // 更改购物车数量
    wx.request({
      url: `${app.globalData.url}goods/change_shopcar_count`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        goods_id,
        goods_count: 1
      },
      success: res => {
        console.log(res.data)
      }
    })
    that.setData({
      shoppingCart: that.data.shoppingCart,
      shopNums: ++shopNums,
      moneyNums: moneyNums + pice
    });
  },
  // down--
  nextNum(e) {
    const that = this;
    const shoppingCartI = that.data.shoppingCart;
    let curenIdex = e.currentTarget.dataset.index;
    let pice = shoppingCartI[curenIdex].price;
    let shopNums = that.data.shopNums;
    let num = shoppingCartI[curenIdex].num;
    if (num == 1) {
      return false;
    }
    num = num - 1;
    shoppingCartI[curenIdex].num = num;
    // 更改购物车数量
    wx.request({
      url: `${app.globalData.url}goods/change_shopcar_count`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        goods_id,
        goods_count: 1
      },
      success: res => {
        console.log(res.data)
      }
    })
    this.setData({
      shoppingCart: that.data.shoppingCart,
      shopNums: --shopNums,
      moneyNums: that.data.moneyNums + (-pice)
    });
  },
  // 去结算
  goSlement(e) {
    // console.log(this.data.shoppingCart)
    wx.setStorageSync('shopList', this.data.shoppingCart)
    wx.navigateTo({
      url: `../settlement/settlement?totalPrice=${this.data.moneyNums}`,
    })
  },
  // 根据汽车型号获取适用商品列表
  brandTab(e) {
    const _that = this;
    this.setData({
      check_bgs: e.currentTarget.dataset.goods_id
    })
    // 根据汽车型号获取适用商品列表
    wx.request({
      url: `${app.globalData.url}goods/goods_bycar`,
      method: 'POST',
      data: {
        type_id: _that.data.id,
        car_id: _that.data.car_id,
        brand_id: e.currentTarget.dataset.goods_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        _that.setData({
          cateItems: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let car_ids = options.curentId; //汽车品牌编号
    let curenName = options.curenName;
    that.setData({
      curenNmaes: curenName,
      car_id: car_ids
    })
    // 获取商品主分类列表
    wx.request({
      url: `${app.globalData.url}home/type_list`,
      method: 'POST',
      success: (res) => {
        setTimeout(() => {
          wx.hideLoading();
        }, 300)
        let cateItems = that.data.cateItems;
        that.setData({
          navLeft: res.data.data,
        })
      }
    });
    // 根据主分类获取品牌列表
    wx.request({
      url: `${app.globalData.url}home/brand_bytype`,
      method: 'POST',
      data: {
        id: 3
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data.data)
        that.setData({
          nameItems: res.data.data
        })
      }
    });
    // 根据汽车型号获取适用商品列表
    wx.request({
      url: `${app.globalData.url}goods/goods_bycar`,
      method: 'POST',
      data: {
        type_id: 3,
        car_id: car_ids,
        brand_id: 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        that.setData({
          cateItems: res.data.data
        })
      }
    });
  },
  // 根据品牌
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
    let that = this;
    app.globalData.carCheck = that.data.curenNmaes
    wx.switchTab({
      url: '../index/index',
    })
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

})