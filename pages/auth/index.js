// pages/auth/index.js
import {request} from '../../request/index'
Page({

  data: {

  },

  onLoad: function (options) {

  },
  async getUserInfo(res){
    const {encryptedData,rawData,iv,signature}=res.detail
    const {code}=await wx.login()
    const needData={encryptedData,rawData,iv,signature,code}
    const {token}=await request({
      url:'/users/wxlogin',
      method:'post',
      data:needData
    })
    // msg: "Error: invalid code, hints: [ req_id: 6gHfiyNre-sv08aA ]
    // 原因因为是我appid不是企业级id，没资格获得支付权限
    // 所以以下的步骤都是假设我成功获得了token
    wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
    wx.navigateBack({
      delta: 1,
    })
  }
})