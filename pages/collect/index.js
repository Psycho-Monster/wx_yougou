// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
        id: 0,
        value: '商品收藏',
      },
      {
        id: 1,
        value: '品牌收藏',
      },
      {
        id: 2,
        value: '店铺收藏',
      },
      {
        id: 3,
        value: '浏览器足迹',
      },
    ],
    currentIndex: 0,
    collectGoodsList:[]
  },
  onLoad(){
    const collectGoodsList=wx.getStorageSync('collectGoodsList') || []
    if(!collectGoodsList.length){
      return
    }
    this.setData({
      collectGoodsList
    })
  }
})