// pages/search/index.js
import {
  request
} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchGoodsList:[],
    isButtonShow:true,
    inputValue:''
  },
  searchGoods(e) {
    const query = e.detail.value.trim()
    clearTimeout(this.timerId)
    if (query.length) {
      this.setData({
        isButtonShow:false
      })
      this.timerId = setTimeout(async () => {
        const result = await request({
          url: '/goods/qsearch',
          data: {
            query
          }
        })
        if(result.data.meta.status===200){
          const searchGoodsList=result.data.message
          this.setData({
            searchGoodsList,
          })
        }
      }, 1000);
    }else{
      this.clearSearchData()
    }
  },
  clearSearchData(){
    this.setData({  
      searchGoodsList:[],
      isButtonShow:true,
      inputValue:''
    })
  }
})