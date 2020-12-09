//index.js
import { request } from '../../request/index'
Page({
  data: {
    swiperList: [],
    categoryList: [],
    floorList:[],
  },
  onLoad() {
    this.getSwiperList()
    this.getCategoryItems()
    this.getFloorList()
  },
  async getSwiperList() {
    const result = await request({
      url: '/home/swiperdata'
    })
    if (result.data.meta.status === 200) {
      const swiperList = result.data.message
      swiperList.forEach(swiper=>{
        // 现在接口是/pages/goods_detail/main?goods_id=129
        // 和我当前创建目录的文件名有冲突，所以得将main全部变成index
        swiper.navigator_url=swiper.navigator_url.replace('main','index')
      })
      this.setData({
        swiperList
      })
    }
  },
  async getCategoryItems() {
    const result = await request({
      url: '/home/catitems'
    })
    if (result.data.meta.status === 200) {
      const categoryList = result.data.message
      this.setData({
        categoryList
      })
    }
  },
  async getFloorList(){
    const result = await request({
      url: '/home/floordata'
    })
    console.log(result)
    if (result.data.meta.status === 200) {
      const floorList = result.data.message
      // 新接口的product_list 每一项的navigator_url都少个index,导致无法进行路由跳转
      floorList.forEach(list=>{
        list.product_list.forEach(product=>{
          product.navigator_url=product.navigator_url.replace('?','/index?')
        })
      })
      this.setData({
        floorList
      })
    }
  }
})
