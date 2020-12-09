// pages/goods_list/index.js
import {
  request
} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
      id: 0,
      value: '综合',
    },
    {
      id: 1,
      value: '销量',
    },
    {
      id: 2,
      value: '价格',
    },
    ],
    currentIndex: 0,
    goodsList: [],
    defaultImageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605427644226&di=4ad2de473e375f9ded43834cb02d61d7&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F65%2F89%2F5957eaa9a9eea_610.jpg',
    totalPageSize: 0
  },
  pagenum: 1,
  pagesize: 20,
  onLoad: function (options) {
    const {query}=options
    this.getShopList(query)
  },
  getCurrentIndex(e) {
    const {
      currentIndex
    } = e.detail
    this.setData({
      currentIndex
    })
  },
  async getShopList(query,pagenum = 1, pagesize = 20) {
    const result = await request({
      url: '/goods/search',
      data: {
        pagenum,
        pagesize,
        query
      }
    })
    const totalPageSize = Math.ceil(result.data.message.total / pagesize)
    if (result.data.meta.status === 200) {
      const goodsList = this.data.goodsList.concat(result.data.message.goods)
      this.setData({
        goodsList,
        totalPageSize
      })
      wx.stopPullDownRefresh()
    }
  },
  onReachBottom() {
    if (++this.pagenum > this.data.totalPageSize) {
      return
    }
    this.getShopList(this.pagenum)
  },
  onPullDownRefresh() {
    this.pagenum = 1
    this.setData({
      goodsList: []
    })
    this.getShopList()
  }
})