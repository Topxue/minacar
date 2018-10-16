const app = getApp();
Page({
  data: {
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认全选
  },
  // 获取购物车商品列表
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.url}goods/shopcar_list`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token
      },
      success: res => {
        wx.hideLoading({
          
        })
        let resData = res.data.data;
        for (var i = 0; i < resData.length; i++) {
          resData[i].selected = false;
        }
        if (res.data.data.length > 0){
          this.setData({
            hasList: true,
            carts: resData,
          });
       }
        
      }
    })

    this.getTotalPrice();
  },
  onShow() {
    this.onLoad();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车选中商品
   */
  deleteList(e) {
    let _that = this;
    var totalPrice =_that.data.totalPrice;
    let cars = _that.data.carts;
    let sltedTrue = cars.filter(item => item.selected === true);
    console.log(sltedTrue)
    let goodCont = [];
    for (let gsid of sltedTrue) {
      goodCont.push(gsid.goods_id)
    }
    var num = 0;
    for(var i = 0;i<sltedTrue.length;i++){
      num += sltedTrue[i].price * sltedTrue[i].goods_count
    }
    let goods_ids = goodCont.join(",");
    wx.showModal({
      title: '提示',
      content: '是否删除选中商品',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.url}goods/remove_shopcar`,
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: app.globalData.token,
              goods_ids
            },
            success: res => {
              console.log(res.data)
              let slted = cars.filter(item => item.selected === false);
              _that.setData({
                carts: slted,
                totalPrice: totalPrice-num
              })
            }
          })

        }
      }
    })
    this.getTotalPrice();
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });

    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let goodsId = e.currentTarget.dataset.goodsid;
    let goods_count = carts[index].goods_count;
    goods_count = goods_count + 1;
    carts[index].goods_count = goods_count;
    this.setData({
      carts: carts
    });
    wx.request({
      url: `${app.globalData.url}goods/change_shopcar_count`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        goods_id: goodsId,
        goods_count: goods_count
      },
      success: res => {
        // let slted = cars.filter(item => item.selected === false);
        // _that.setData({
        //   carts: slted
        // })
      }
    })
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    const goods_id = e.currentTarget.dataset.goodsid;
    let carts = this.data.carts;
    let goods_count = carts[index].goods_count;
    if (goods_count <= 1) {
      return false;
    }
    goods_count = goods_count - 1;
    carts[index].goods_count = goods_count;
    this.setData({
      carts: carts
    });
    wx.request({
      url: `${app.globalData.url}goods/change_shopcar_count`,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: app.globalData.token,
        goods_id,
        goods_count: goods_count
      },
      success: res => {
        // let slted = cars.filter(item => item.selected === false);
        // _that.setData({
        //   carts: slted
        // })
      }
    })
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].selected) { // 判断选中才会计算价格
        total += carts[i].goods_count * carts[i].price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  // 去结算
  gotoBy() {
    const _that = this;
    const cars = _that.data.carts;
    let allPrice = _that.data.totalPrice
    let slted = cars.filter(item => item.selected === true);
    wx.setStorageSync('shopList', slted)
    if (_that.data.totalPrice == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return;
    } else {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        success() {
          wx.navigateTo({
            url: `../settlement/settlement?totalPrice=${allPrice}`,
          })
        }
      })
    }

  }

})