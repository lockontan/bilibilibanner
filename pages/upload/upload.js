//index.js
//获取应用实例
//const app = getApp()

function getLastDate() {
  const date = new Date(new Date().valueOf() - 24 * 60 * 60 * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  const day = date.getDate() + 1 > 9 ? date.getDate() : '0' + date.getDate()
  return [year, month, day].join('-')
}

const cloud = wx.cloud
cloud.init()

Component({
  pageLifetimes: {},
  data: {
    name: null
  },
  methods: {
    bindFileInput: function (e) {
      let value = e.detail.value
      this.setData({
        name: value
      })
    },
    upload () {
      const filleName = this.data.name
      const date = getLastDate()
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths[0]
          const tempFilePathsArr = tempFilePaths.split('/')
          const path = tempFilePathsArr[tempFilePathsArr.length - 1]
          const ext = path.split('.')[path.split('.').length - 1]
          const cloudPath = date + '/' + filleName + '.' + ext
          wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: tempFilePaths, // 文件路径
            success: res => {
              // get resource ID
              wx.cloud.getTempFileURL({
                fileList: [res.fileID]
              }).then(res => {
                console.log(res.fileList)
                cloud.callFunction({
                  // 云函数名称
                  name: 'uploadImg',
                  // 传给云函数的参数
                  data: {
                    url: res.fileList[0].tempFileURL,
                    date: date,
                    name: filleName + '.' + ext,
                  },
                }).then(res => {
                  if (res.result.code == 200) {
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              }).catch(error => {
                wx.showToast({
                  title: '上传失败',
                  icon: 'none',
                  duration: 2000
                })
              })
            },
            fail: err => {
              // handle error
            }
          })
        }
      })
    }
  }
})
