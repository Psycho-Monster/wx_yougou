export const request = (params) => {
  wx.showLoading({
    title: '加载中',
  })
  // 获取可能传来的自定义的请求头
  const header = {
    ...params.header
  }
  if (params.url.includes('/my/')) {
    header['Authorization'] = wx.getStorageSync('token')
  }
  return new Promise((resolve, reject) => {
    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
    wx.request({
      ...params,
      url: baseUrl + params.url,
      header,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      complete() {
        wx.hideLoading()
      }
    });
  })
}