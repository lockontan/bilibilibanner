//image.js
//获取应用实例
// const app = getApp()
const cloud = wx.cloud
cloud.init()

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      if (this.data.imageArr.length === 0) {
        cloud.callFunction({
          // 云函数名称
          name: 'getUrl',
          // 传给云函数的参数
        }).then(res => {
          const data = res.result.data
          const imageArr = data.map(item => {
            item.length = item.imgs.length
            item.url = item.imgs[0].url
            item.url_middle = item.imgs[0].url_middle
            item.url_small = item.imgs[0].url_small
            return item
          })
          this.setData({
            imageArr: imageArr
          })
          wx.setStorage({
            key: 'topData',
            data: imageArr,
          })
        })
      }
    }
  },
  data: {
    imageWidth: wx.getSystemInfoSync().windowWidth / 2,
    imageArr: []
  },
  methods: {
    preview (e) {
      let item = e.target.dataset.item
      let imgItem = item.imgs[0]
      console.log(item.length)
      if (item.length == 1) {
        wx.previewImage({
          current: imgItem.url_middle,
          urls: [imgItem.url_middle, imgItem.url]
        })
      } else {
        wx.navigateTo({
          url: '/pages/image/image?id=' + item.id,
        })
      }
    }
  }
})