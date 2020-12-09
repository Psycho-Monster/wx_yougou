// pages/login/index.js
Page({

  data: {

  },

  onLoad: function (options) {

  },
  getUserInfo(res){
    const userInfo=res.detail.userInfo
    wx.setStorageSync('userInfo', userInfo)
    wx.navigateBack({
      delta: 1,
    })
  }
})