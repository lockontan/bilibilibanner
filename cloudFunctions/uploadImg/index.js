// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database({
  env: 'tets-gv0wq'
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection('url').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        url: event.url,
        date: event.date,
        name: event.name
      }
    })
    return {
      code: 200
    }
  } catch (e) {
    console.error(e)
  }
}