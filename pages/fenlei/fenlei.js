const app = getApp();
Page({
  data: {
    allName: '所有品牌',
    cateItems: [],
    curNav: 1,
    curIndex: 0,
    seachVal: '', //获取搜素关键字
  },
  // 获取input value
  getValue(e) {
    let that = this;
    that.setData({
      seachVal: e.detail.value
    })
  },
  // 关键字搜索
  seachIpt(e) {
    let that = this;
    let searchText = that.data.seachVal;
    if (searchText == '') {
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '加载中',
        icon:'loading',
        success(){
          wx.navigateTo({
            url: `../detailslei/detailslei?type_id=3&son_id=2&searchText=${searchText}`,
          })
        }
      })
    }
  },
  //  所有商品品牌
  allPname(e) {
    console.log(e)
    let that = this;
    // 获取商品品牌列表
    wx.request({
      url: `${app.globalData.url}home/brand_list`,
      method: "POST",
      success: (res) => {
        let arrCateitem = that.data.cateItems;
        console.log(arrCateitem)
        let arrSon = res.data.data;
        that.setData({
          cateItems: arrSon
        })
        console.log(res.data.data)
      }
    })
    that.setData({
      curNav: 1,
      name: e.currentTarget.dataset.catename
    })
  },
  onLoad: function(e) {
    // 获取商品主分类列表
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.url}home/type_list`,
      method: 'POST',
      success: (res) => {
        setTimeout(()=>{
          wx.hideLoading()
        },100)
        that.setData({
          returnData: res.data.data,
          name: "所有品牌"
        })
      }
    })
    //获取商品品牌列表
    wx.request({
      url: `${app.globalData.url}home/brand_list`,
      method: "POST",
      success: (res) => {
        let arrCateitem = that.data.cateItems;
        let arrSon = res.data.data;
        that.setData({
          cateItems: arrSon
        })
      }
    })
  },
  // 跳转商品列表
  goodList(e) {
    console.log(e.currentTarget.dataset)
    let type_ids = e.currentTarget.dataset.type_id;
    let brand_id = e.currentTarget.dataset.brand_id;
    let fatherid = e.currentTarget.dataset.fatherid;
    let sonId = e.currentTarget.dataset.sonid;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      success() {
        wx.navigateTo({
          url: `../detailslei/detailslei?type_id=${fatherid}&son_id=${sonId}&type_ids=${type_ids}&brand_id=${brand_id}`,
        })
      }
    })
  },
  //事件处理函数
  switchRightTab: function(e) {
    let that = this;
    // 获取item项的id，和数组的下标值
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index),
      name = e.currentTarget.dataset.catename;
    //获取商品子分类
    wx.request({
      url: `${app.globalData.url}home/typeson_list`,
      method: "POST",
      data: {
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        let arrCateitem = that.data.cateItems;
        let arrSon = res.data.data;
        that.setData({
          cateItems: arrSon
        })
      }
    })
    // 把点击到的某一项，设为当前index
    this.setData({
      curNav: id,
      curIndex: index,
      name: name,
    })
  }
})