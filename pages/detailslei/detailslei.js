// index/list.js
const app = getApp();
let page = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: ['默认', '价格'], //分类
    tab: [true, true, true],
    pinpaiList: [{
      'id': '0',
      'title': '默认'
    }, {
      'id': '1',
      'title': '评分'
    }, {
      'id': '2',
      'title': '销量'
    }],
    pinpai_id: 0, //品牌
    pinpai_txt: '',
    jiage_id: 0, //价格
    jiage_txt: '',
    xiaoliang_txt: '',
    seachVal: '', //关键字搜索
    type_id: null, //主分类编号
    son_id: null, //子分类编号
    dataList: [],
    brand_id:0,
    shopNum: false, //购物车数量显示
    shopsnum: 0

  },
  // 选项卡
  filterTab: function(e) {
    let data = [true, true, true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },
  // 跳转购物详情
  goShopdateli(e) {
    let goodsid = e.currentTarget.dataset.goodsid;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      success() {
        wx.navigateTo({
          url: `../orderdetails/orderdetails?goods_id=${goodsid}`,
        })
      }
    })
  },
  //筛选项点击操作
  filter: function(e) {
    let self = this,
      id = e.currentTarget.dataset.id,
      txt = e.currentTarget.dataset.txt,
      tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          pinpai_id: id,
          pinpai_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          jiage_id: id,
          jiage_txt: txt
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          xiaoliang_id: id,
          xiaoliang_txt: txt
        });
        break;
    }
    //数据筛选
    self.getDataList();
    // 筛选获取商品列表
    wx.request({
      url: `${app.globalData.url}goods/goods_list`,
      method: 'POST',
      data: {
        type_id: self.data.type_id,
        son_id: self.data.son_id,
        searchText: '',
        sort: id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        self.setData({
          dataList: res.data.data
        })
      }
    })
  },
  // 获取关键字input,value
  getVal(e) {
    let that = this;
    that.setData({
      seachVal: e.detail.value
    })
  },
  // 关键字搜索
  sechShaixuan(e) {
    let that = this;
    let searchText = that.data.seachVal;
    if (searchText == '') {
      wx.showToast({
        title: '请输入搜素关键字',
        icon: 'none'
      })
    } else {
      // 搜索获取商品列表
      wx.request({
        url: `${app.globalData.url}goods/goods_list`,
        method: 'POST',
        data: {
          type_id: that.data.type_id,
          son_id: that.data.son_id,
          searchText,
          sort: 0
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          that.setData({
            dataList: res.data.data
          })
        }
      })
    }
  },
  onLoad: function(options) {
    let that = this;
    console.log(options)
    if (options.type_id == 'undefined'){
      that.setData({
        type_id: options.type_ids,
        son_id: 0,
        brand_id: options.brand_id
      })
    } else if (options.type_id != 'undefined'){
      that.setData({
        type_id: options.type_id,
        son_id: options.son_id,
        seachVal: options.searchText,
        searchText: options.searchText
      })
    }
    // 获取商品列表
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.url}goods/goods_list`,
      method: 'POST',
      data: {
        type_id: that.data.type_id,
        son_id: that.data.son_id,
        brand_id: that.data.brand_id,
        searchText: that.data.searchText || '',
        page: 0,
        sort: 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        setTimeout(() => {
          wx.hideLoading()
        }, 100)
        that.setData({
          dataList: res.data.data
        })
      }
    })
  },
  // 上拉加载
  onReachBottom() {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    let dataList = that.data.dataList;
    page += 1;
    wx.request({
      url: `${app.globalData.url}goods/goods_list`,
      method: 'POST',
      data: {
        type_id: that.data.type_id,
        son_id: that.data.son_id,
        brand_id: that.data.brand_id,
        searchText: that.data.searchText || '',
        page: page,
        sort: 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '无更多内容',
            icon: 'none'
          })
        } else {
          setTimeout(() => {
            wx.hideLoading()
          }, 100)
          res.data.data.forEach(item => {
            dataList.push(item)
          })
          that.setData({
            dataList: dataList
          })
        }
      }
    })
  },
  // 加入购物车
  addToshop(e) {
    let that = this;
    let token = app.globalData.token;
    let goods_id = e.currentTarget.dataset.goodsid;
    wx.request({
      url: `${app.globalData.url}goods/add_shopcar`,
      method: 'POST',
      data: {
        token,
        goods_id,
        goods_count: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res.data);
        if (res.data.state == 1) {
          that.setData({
            shopNum: true,
            shopsnum: that.data.shopsnum + 1
          });
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 跳转到购物车
  shopCardatile() {
    let _that = this
    if (_that.data.shopNum == false) {
      return;
    } else {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        success() {
          wx.switchTab({
            url: '../shop/shop'
          })
        }
      })
    }

  },
  //加载数据
  getDataList: function() {
    //调用数据接口，获取数据


  }

})