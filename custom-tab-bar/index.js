Component({
  data: {
    selected: 0,
    color: "#787878",
    selectedColor: "#fb7598",
    list: [
      {
        "pagePath": "/pages/index/index",
        "text": "封面",
        "iconPath": "/assets/home.png",
        "selectedIconPath": "/assets/home-active.png"
      },
      {
        "pagePath": "/pages/image/index",
        "text": "图集",
        "iconPath": "/assets/imgs.png",
        "selectedIconPath": "/assets/imgs-active.png"
      },
      {
        "pagePath": "/pages/about/about",
        "text": "关于",
        "iconPath": "/assets/about.png",
        "selectedIconPath": "/assets/about-active.png"
      }
    ]
  },
  onLoad () {},
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      if (url == '/pages/image/index') {
        wx.navigateToMiniProgram({
          appId: 'wx7cd2b70b356b893b'
        })
      } else {
        wx.switchTab({
          url: url
        })
      }
    }
  }
})