// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'tets-gv0wq'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  return db.collection('url').where({
    date: event.date
  }).limit(event.limit || 10).get()
}