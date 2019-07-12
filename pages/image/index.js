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
        this.getImgData({mode: this.data.typeArr[this.data.type]})
      }
    }
  },
  data: {
    imageWidth: wx.getSystemInfoSync().windowWidth / 2,
    imageArr: [],
    typeNameArr: ['今日', '本周', '本月'],
    typeArr: ['daily', 'weekly', 'monthly'],
    type: 0
  },
  methods: {
    getImgData (data) {
      wx.showLoading({
        title: '加载中',
      })
      cloud.callFunction({
        // 云函数名称
        name: 'getUrl',
        // 传给云函数的参数
        data: data || ''
      }).then(res => {
        wx.hideLoading()
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
    },

    // 切换排行类型
    bindTypeChange (e) {
      const value = e.detail.value
      this.setData({
        type: value
      })
      this.getImgData({mode: this.data.typeArr[value]})
    },
    preview (e) {
      let item = e.target.dataset.item
      let imgItem = item.imgs[0]
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
