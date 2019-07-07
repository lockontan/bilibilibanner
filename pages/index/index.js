//index.js
//获取应用实例
const app = getApp()

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  data: {
    avUrl: null,
    cvUrl: null,
    avImgs: null,
    cvImgs: null,
    transform: 'translate3d(0, 0, 0)',
    transformSection: 'translate3d(0, 0, 0)',
    barActive: 0
  },
  methods: {
    bindAvInput: function (e) {
      let value = e.detail.value
      this.setData({
        avUrl: value
      })
    },
    bindCvInput: function (e) {
      let value = e.detail.value
      this.setData({
        cvUrl: value
      })
    },
    // 提取封面
    avSubmit: function () {
      // 微信上报功能使用
      wx.reportAnalytics('fun_number', {
        type: '1',
      })
      if (!this.data.avUrl) return wx.showToast({
        title: '请输入av号或视频地址',
        icon: 'none'
      })
      let aid = ''
      if (this.data.avUrl.indexOf('bilibili') > -1) {
        const value = this.data.avUrl.match(/av(\d*)/)
        if (value) {
          aid = value[1]
        }
      } else if (this.data.avUrl.indexOf('av') > -1) {
        const value = this.data.avUrl.match(/\d.*/)
        if (value) {
          aid = value[0]
        }
      } else if (!isNaN(this.data.avUrl - 0)) {
        aid = this.data.avUrl - 0
      }
      if (!aid) return wx.showToast({
        title: '错误的av号或视频地址',
        icon: 'none'
      })
      wx.request({
        url: `https://m.bilibili.com/video/av${aid}.html`,
        header: {
          'content-type': 'text/html; charset=utf-8'
        },
        dataType: 'text/html',
        success: (res) => {
          try {
            var result = res.data.replace(/\r|\n|\s/g, '').match(/images":\["(.*?)@(.*?)\]/)
            if (result) {
              wx.previewImage({
                current: result[1],
                urls: [result[1]]
              })
              setTimeout(() => {
                this.setData({
                  avImgs: result[1]
                })
              }, 300)
            } else {
              wx.showToast({
                title: '视频不存在',
                icon: 'none'
              })
            }
          } catch (e) {
            wx.showToast({
              title: '提取失败，提取失败，请点击关于菜单进行反馈',
              icon: 'none',
              duration: 3000
            })
            // wx.reportAnalytics('get_img_error', {
            //   content: e.toString(),
            //   aid: aid - 0
            // })
          }
        }
      })
    },

    // 专栏封面
    cvSubmit: function () {
      // 微信上报功能使用
      wx.reportAnalytics('fun_number', {
        type: '2',
      })
      if (!this.data.cvUrl) return wx.showToast({
        title: '请输入cv号或专栏地址',
        icon: 'none'
      })
      let cid = ''
      if (this.data.cvUrl.indexOf('bilibili') > -1) {
        const value = this.data.cvUrl.match(/cv(\d*)/)
        if (value) {
          cid = value[1]
        }
      } else if (this.data.cvUrl.indexOf('cv') > -1) {
        const value = this.data.cvUrl.match(/\d.*/)
        if (value) {
          cid = value[0]
        }
      } else if (!isNaN(this.data.cvUrl - 0)) {
        cid = this.data.cvUrl - 0
      }
      if (!cid) return wx.showToast({
        title: '错误的cv号或专栏地址',
        icon: 'none'
      })
      wx.request({
        url: `https://www.bilibili.com/read/mobile/${cid}`,
        header: {
          'content-type': 'text/html; charset=utf-8'
        },
        dataType: 'text/html',
        fail: () => {
          wx.showToast({
            title: '专栏不存在',
            icon: 'none'
          })
        },
        success: (res) => {
          try {
            var str = res.data.replace(/\r|\n|\s/g, '')
            var result = str.match(/data-src="(.*?)"/g)
            if (!result) {
              return wx.showToast({
                title: '专栏不存在',
                icon: 'none'
              })
            }
            result = result.map(item => {
              var value = item.match(/data-src="(.*?)"/)
              var url = value[1]
              if (value[1].indexOf('https:') === -1 && value[1].indexOf('http:') === -1) {
                url = 'https:' + value[1]
              }
              return url
            })
            // banner图提取
            var bannerImg = str.match(/banner_url:"([https | http].*?)"/)
            if (bannerImg && bannerImg[1]) {
              result.unshift(bannerImg[1])
            }
            console.log(result)
            this.setData({
              cvImgs: result
            })
          } catch (e) {
            wx.showToast({
              title: '提取失败，请点击关于菜单进行反馈',
              icon: 'none',
              duration: 3000
            })
            // wx.reportAnalytics('get_img_error', {
            //   content: e.toString(),
            //   cid: cid - 0
            // })
          }
        }
      })
    },

    avPreview: function () {
      wx.previewImage({
        current: this.data.avImgs,
        urls: [this.data.avImgs]
      })
    },

    cvPreview: function (e) {
      wx.previewImage({
        current: e.target.dataset.url,
        urls: this.data.cvImgs
      })
    },

    // 进入文章封面提取
    go() {
      wx.navigateTo({
        url: '../article/article',
      })
    },

    bindchange: function (e) {
      this.setData({
        currentData: e.detail.current,
        barActive: e.detail.current,
        transform: `translate3d(${e.detail.current * 110}rpx, 0px, 0px)`,
      })
    },

    moveBar: function (e) {
      if (e.target.dataset.index == 0) {
        this.setData({
          transform: 'translate3d(0, 0, 0)',
          barActive: 0,
          transformSection: 'translate3d(0, 0, 0)',
        })
      } else {
        this.setData({
          transform: 'translate3d(110rpx, 0px, 0px)',
          barActive: 1,
          transformSection: 'translate3d(-50%, 0, 0)',
        })
      }
    }
  }
})
