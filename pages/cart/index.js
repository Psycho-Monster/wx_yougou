// pages/cart/index.js
Page({

  data: {
    // 判断用户是否拒绝获取收货地址的权限
    denyChooseAddress: false,
    firstTime: true,
    addressInfo:{},
    addressDetail:'',
    cart:[],
    totalPrice:0,
    checkedAll:false,
    payGoodsLength:0
  },
  onLoad: function () {
    const addressInfo = wx.getStorageSync('addressInfo')
    const cart=wx.getStorageSync('cart')
    const {provinceName,cityName,countyName,detailInfo}=addressInfo
    const checkedAll=cart.length && cart.every(item=>item.isChecked)
    const payGoodsLength=cart.reduce((prev,item)=>{
      return prev+(item.isChecked?1:0)
    },0)
    if (addressInfo) {
      this.setData({
        firstTime: false,
      })
    }
    this.setData({
      addressDetail:`${provinceName}${cityName}${countyName}${detailInfo}`,
      cart,
      checkedAll,
      payGoodsLength
    })
    this.getTotalPrice()
  },
  onShow(){
    const addressInfo=wx.getStorageSync('addressInfo')
    this.setData({
      addressInfo,
    })
  },
  checkAddressAuth() {
    this.getAddress()
    if (this.data.denyChooseAddress) {
      wx.openSetting({
        success: () => {
          this.setData({
            denyChooseAddress: false,
            cart
          })
        },
      })
    }
  },
  getAddress() {
    wx.chooseAddress({
      success: (result) => {
        console.log(result)
        wx.setStorageSync('addressInfo', result)
      },
      fail: (err) => {
        if (this.data.firstTime) {
          console.log(err)
          // 只需要第一次进来的时候将denyChooseAddress设为true
          // 而不是当用户 第一次拒绝，第二次打开设置已经允许获取地址
          // 然后接下来在选择地址界面取消的时候还能进入这个错误判断
          this.setData({
            denyChooseAddress: true,
            firstTime: false
          })
        }
      }
    })
  },
  changeGoodsNum(e){
    const {type,index}=e.currentTarget.dataset
    const newCart=this.data.cart[index]
    if(type==='increment'){
      if(!newCart.num){
        newCart.num=1
      }else{
        newCart.num++
      }
    }else{
      if(newCart.num>1){
        newCart.num--
      }else{
        wx.showToast({
          title: '宝贝数量不能再减少了',
          icon:'none'
        })
      }
    }
    this.data.cart[index]=newCart
    this.getTotalPrice()
    this.setData({
      cart:this.data.cart
    })
    wx.setStorageSync('cart', this.data.cart)
  },
  getTotalPrice(){
    const totalPrice=this.data.cart.reduce((prev,item)=>{
      if(item.isChecked){
        return prev+(item.goods_price*item.num)
      }else{
        return prev
      }
    },0)
    this.setData({
      totalPrice:totalPrice*100
    })
  },
  checkGoods(e){
    const currentIndex=e.currentTarget.dataset.index
    const currentGoods=this.data.cart[currentIndex]
    currentGoods.isChecked=!currentGoods.isChecked
    const payGoodsLength=this.data.cart.reduce((prev,item)=>{
      return prev+(item.isChecked?1:0)
    },0)
    const checkedAll=this.data.cart.length && this.data.cart.every(item=>item.isChecked)
    this.setData({
      cart:this.data.cart,
      checkedAll,
      payGoodsLength
    })
    this.getTotalPrice()
    wx.setStorageSync('cart', this.data.cart)
  },
  checkAllGoods(){
    this.data.checkedAll=!this.data.checkedAll
    this.data.cart.forEach(item=>item.isChecked=this.data.checkedAll)
    const payGoodsLength=this.data.cart.reduce((prev,item)=>{
      return prev+(item.isChecked?1:0)
    },0)
    this.setData({
      cart:this.data.cart,
      payGoodsLength
    })
    this.getTotalPrice()
    wx.setStorageSync('cart', this.data.cart)
  },
  submitOrder(){
    if(!this.data.payGoodsLength){
      wx.showToast({
        title: '您还没有选择宝贝哦',
        icon:'none',
        mask: true,
      })
    }else{
      wx.navigateTo({
        url: '/pages/pay/index',
      })
    }
  }
})