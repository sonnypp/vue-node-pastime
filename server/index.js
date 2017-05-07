const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoutes = require('./api/user')
const videoRoutes = require('./api/video')
const commentRoutes = require('./api/comment')

// 初始化数据引入model和data
const usersData = require('./data/user')
const videoData = require('./data/video')
const commentData = require('./data/comment')
const User = require('./models/user')
const Video = require('./models/video')
const Comment = require('./models/comment')

const app = express()

// connect db
mongoose.connect('mongodb://localhost:27017/vnpastime')
mongoose.Promise = global.Promise

app.set('port', process.env.PORT || 8080)

app.use(bodyParser.json())

app.use('/api', userRoutes)
app.use('/api', videoRoutes)
app.use('/api', commentRoutes)

// 初始化数据
usersData.forEach(user => {
  let userId = user.userId
  User.find({userId: userId}).then(u => {
    !u.length && User.create(user)
  })
})

videoData.forEach(video => {
  let videoId = video.videoId
  Video.find({videoId: videoId}).then(v => {
    !v.length && Video.create(video)
  })
})

commentData.forEach(comment => {
  let commentId = comment.commentId
  Comment.find({commentId: commentId}).then(c => {
    !c.length && Comment.create(comment)
  })
})


// 错误处理
app.use((err, req, res, next) => {
  res.status(442).send({ error: err.message })
})

app.listen(app.get('port'), () => {
  console.log(`Express started in ${app.get('env')} mode on http://localhsot:${app.get('port')}`)
})