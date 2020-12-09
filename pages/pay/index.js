// pages/cart/index.js
import {request} from '../../request/index'
Page({

  data: {
    addressInfo:{},
    addressDetail:'',
    cart:[],
    totalPrice:0,
  },
  onLoad: function () {
    const addressInfo = wx.getStorageSync('addressInfo')
    const cart=wx.getStorageSync('cart').filter(item=>item.isChecked)
    const {provinceName,cityName,countyName,detailInfo}=addressInfo
    if (addressInfo) {
      this.setData({
        firstTime: false,
      })
    }
    this.setData({
      addressDetail:`${provinceName}${cityName}${countyName}${detailInfo}`,
      cart,
    })
    this.getTotalPrice()
  },
  onShow(){
    const addressInfo=wx.getStorageSync('addressInfo')
    this.setData({
      addressInfo,
    })
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
  async submitOrder(){
    try {
      const token=wx.getStorageSync('token')
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index',
        })
      }else{
        const order_price=this.data.totalPrice/100
        const consignee_addr=this.data.addressDetail
        const goods=this.data.cart.map(item=>({
          goods_id:item.goods_id,
          goods_number:item.num,
          goods_price:item.goods_price
        }))
        const needData={order_price,consignee_addr,goods}
        const result=await request({
          url:'/my/orders/create',
          data:needData,
          method:'post'
        })
        if(result.data.meta.status===200){
          const {order_number}=result.data.message
          const payParams=await request({
            url:'/my/orders/req_unifiedorder',
            header,
            method:'post',
            data:{order_number}
          })
          if(result.data.meta.status===200){
            // const paymentObj=payParams.data.message.pay
            // {"errMsg":"requestPayment:fail no permission"}
            // 和之前一样，没有企业appid，无支付权限
            // const res=await wx.requestPayment(paymentObj)
            // console.log(res)
            // const isSuccessPay=request({
            //   url:'/my/orders/chkOrder',
            //   method:'post',
            //   header,
            //   data:{order_number}
            // })
            // if(isSuccessPay.meta.status===200){
            //   // 说明支付成功了
            //   wx.showToast({
            //     title: '支付成功',
            //   });
            // }
            // 当支付成功后，将缓存购物车里支付成功的商品给清除
            let newCart=wx.getStorageSync('cart')
            newCart=newCart.filter(item=>!item.isChecked)
            wx.setStorageSync('cart', newCart)
          }
        }
      }
    } catch (error) {
      wx.showToast({
        title: '支付失败',
        icon: 'none',
      });
    }
  }
})