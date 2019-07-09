//image.js
Page({
  data: {
    imageArr: []
  },
  onLoad (options) {
    wx.getStorage({
      key: 'topData',
      success: (res) => {
        this.setData({
          imageArr: res.data.find(item => item.id == options.id).imgs
        })
      }
    })
  },
  preview (e) {
    let imgItem = e.target.dataset.item
    wx.previewImage({
      current: imgItem.url_middle,
      urls: [imgItem.url_middle, imgItem.url]
    })
  }
})
