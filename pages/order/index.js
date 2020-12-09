// pages/order/index.js
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
        value: '全部订单',
      },
      {
        id: 1,
        value: '待付款',
      },
      {
        id: 2,
        value: '待发货',
      },
      {
        id: 3,
        value: '退款/退货',
      },
    ],
    currentIndex: 0,
    type: '0',
    orderList:[],
    orderType:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.type)
    this.setData({
      type: options.type,
      orderType:options.type*1-1,
    })
  },
  onShow() {
    const type = this.data.type
    this.getOrdersList(type)
  },
  async getOrdersList(type) {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    } else {
      const result = await request({
        url: '/my/orders/all',
        data: {
          type
        }
      })
      if(result.data.meta.status===200){
        let orderList=result.data.message.orders
        orderList.map(order=>{
          order.create_time=new Date(order.create_time*1000).toLocaleString()
          order.update_time=new Date(order.update_time*1000).toLocaleString()
        })
        this.setData({
          orderList
        })
      }
    }
  },
  getCurrentIndex(e) {
    const {
      currentIndex
    } = e.detail
    this.setData({
      currentIndex
    })
  }
})