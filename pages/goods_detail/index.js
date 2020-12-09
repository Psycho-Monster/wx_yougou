// pages/goods_detail/index.js
import {
  request
} from '../../request/index'
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    goodsDetail: {},
    isCollect: false
  },
  goodsInfo: {},
  // onLoad: function (options) {
  //   const {
  //     goods_id
  //   } = options
  // },
  onShow() {
    const pages=getCurrentPages()
    const currentPage=pages[pages.length-1]
    const {goods_id}=currentPage.options
    this.getGoodsDetail(goods_id)
    const collectGoodsList = wx.getStorageSync('collectGoodsList') || []
    if (!collectGoodsList.length) {
      return
    }
    const flag = collectGoodsList.some(goods => {
      return goods.goods_id == goods_id
    })
    this.setData({
      isCollect:flag
    })
  },
  async getGoodsDetail(goods_id) {
    const result = await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })
    if (result.data.meta.status === 200) {
      const goodsDetail = result.data.message
      console.log(goodsDetail)
      this.goodsInfo = goodsDetail
      this.setData({
        goodsDetail: {
          goods_name: goodsDetail.goods_name,
          goods_price: goodsDetail.goods_price,
          goods_introduce: goodsDetail.goods_introduce,
          pics: goodsDetail.pics,
          goods_id: goodsDetail.goods_id
        }
      })
    }
  },
  previewImage(e) {
    const pics = this.data.goodsDetail.pics
    const urls = pics.map(item => item.pics_mid_url)
    const {
      current
    } = e.currentTarget.dataset
    wx.previewImage({
      urls,
      current
    })
  },
  onClickIcon() {
    Toast('点击图标');
  },

  onClickButton() {
    Toast('点击按钮');
  },
  collectGoods() {
    const {
      isCollect,
      goodsDetail
    } = this.data
    const {
      goods_id
    } = goodsDetail
    const collectGoodsList = wx.getStorageSync('collectGoodsList') || []
    if (!isCollect) {
      // 说明该商品未收藏过
      collectGoodsList.push(this.goodsInfo)
      this.setData({
        isCollect: true
      })
      wx.showToast({
        title: '收藏成功',
        mask: true
      })
    } else {
      // 该商品已经被收藏
      const index = collectGoodsList.findIndex(goods => goods.goods_id === goods_id)
      collectGoodsList.splice(index, 1)
      wx.showToast({
        title: '取消收藏',
        mask: true
      })
      this.setData({
        isCollect: false
      })
    }
    wx.setStorageSync('collectGoodsList', collectGoodsList)
  },
  addCart() {
    const cart = wx.getStorageSync('cart') || []
    const index = cart.findIndex(item => item.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      // 说明之前购物车里没存放过这个商品
      this.goodsInfo.num = 1
      this.goodsInfo.isChecked = false
      cart.push(this.goodsInfo)
    } else {
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户频繁点击该按钮
      mask: true
    })
  }
})