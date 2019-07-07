//image.js
//获取应用实例
const app = getApp()
const cloud = wx.cloud
cloud.init()

function getLastDate() {
  const date = new Date(new Date().valueOf() - 24 * 60 * 60 * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  const day = date.getDate() + 1 > 9 ? date.getDate() : '0' + date.getDate()
  return [year, month, day].join('-')
}

const date = getLastDate()

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      if (this.data.imageArr.length === 0 || date !== getLastDate()) {
        cloud.callFunction({
          // 云函数名称
          name: 'getUrl',
          // 传给云函数的参数
          data: {
            date: getLastDate(),
            limit: 10
          },
        }).then(res => {
          const data = res.result.data
          this.setData({
            imageArr: data.map(item => item.url)
          })
        })
      }
    }
  },
  data: {
    imageArr: []
  },
  methods: {
    preview (e) {
      wx.previewImage({
        current: e.target.dataset.url,
        urls: this.data.imageArr
      })
    }
  }
})
