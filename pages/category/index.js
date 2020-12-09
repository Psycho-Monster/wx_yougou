//index.js
import { request } from '../../request/index'
Page({
  data: {
    leftMenuList: [],
    rightMenuList: [],
    currentIndex:0,
    scrollTop:0
  },
  list:[],
  onLoad() {
    const data= wx.getStorageSync('categoryList')
    if(!data){
      console.log('123')
      this.getCategoryList()
    }else{
      // 设置过期时间为一天
      if(Date.now()-data.date>24*60*60*1000){
        this.getCategoryList()
      }else{
        this.list=data.list
        const leftMenuList = this.list.map(item => item.cat_name)
        const rightMenuList = this.list[0].children
        this.setData({
          leftMenuList,
          rightMenuList
        })
      }
    }
  },
  async getCategoryList() {
    const result = await request({
      url: '/categories'
    })
    if (result.data.meta.status === 200) {
      this.list = result.data.message
      wx.setStorageSync('categoryList', {date:Date.now(),list:this.list})
      const leftMenuList = this.list.map(item => item.cat_name)
      const rightMenuList = this.list[0].children
      this.setData({
        leftMenuList,
        rightMenuList
      })
    }
  },
  updateRightMenuList(e){
    const currentIndex=e.currentTarget.dataset.index
    const rightMenuList = this.list[currentIndex].children
    this.setData({
      currentIndex,rightMenuList,scrollTop:0
    })
  }
})
