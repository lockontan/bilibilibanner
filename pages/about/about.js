//about.js
//获取应用实例
// const app = getApp()

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  },

  data: {
    // 是否管理员
    admin: false,
    clickNumber: 0,
    timer: null
  },

  methods: {
    getDesc () {
      wx.showModal({
        content: '1.提取b站视频封面 2.提取b站专栏图片',
        showCancel: false
      })
    },

    getImgDesc () {
      wx.showModal({
        content: 'pixiv(p站)最新插画排行',
        showCancel: false
      })
    },

    // 显示上传按钮
    showUpload () {
      const clickNumber = this.data.clickNumber
      this.setData({
        clickNumber: clickNumber + 1
      })
      if (this.data.timer) {
        clearTimeout(this.data.timer)
      }
      this.data.timer = setTimeout(() => {
        if (this.data.clickNumber === 3) {
          this.setData({
            admin: true
          })
        } else {
          this.setData({
            admin: false
          })
          this.setData({
            clickNumber: 0
          })
        }
      }, 1000)
    },

    upload () {
      wx.navigateTo({
        url: '/pages/upload/upload'
      })
    }
  }
})
