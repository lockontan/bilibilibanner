// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'tets-gv0wq'})

const db = cloud.database()
const _ = db.command

function formatDate(dateTime) {
  const date = dateTime ? new Date(dateTime) : new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
  return [year, month, day].join('-')
}

// 云函数入口函数
exports.main = async (event, context) => {
  const currentDate = formatDate()
  const yesterday = formatDate(Date.now() - 24 * 3600 * 1000)
  const data = await db.collection('url').where({
    date: _.or(_.eq(formatDate(currentDate)), _.eq(yesterday))
  }).limit(100).get()
  if (data.data.some(item => item.date == currentDate)) {
    data.data = data.data.filter(item => item.date == currentDate)
    return data
  } else {
    data.data = data.data.filter(item => item.date == yesterday)
    return data
  }
}