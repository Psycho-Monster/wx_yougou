// pages/user/index.js
Page({

  data: {
    userInfo:{},
    collectGoodsListCount:0
  },
  onLoad: function () {
    const userInfo=wx.getStorageSync('userInfo')
    const collectGoodsList=wx.getStorageSync('collectGoodsList')
    this.setData({
      userInfo,
      collectGoodsListCount:collectGoodsList.length
    })
  },
  login(){
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },

})