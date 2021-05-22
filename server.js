const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const UserRoute = require('./routes/users')
const AuthRoute = require('./routes/auth')
const UploadRoute = require('./routes/upload')
const ejs = require('ejs')
const path = require('path')


dotenv.config()

mongoose.connect(process.env.MONGO_URL,
     {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true},
      ()=>{
    console.log('MONGODB ham ishladi')
});
  
app.use(express.json())
app.use(morgan("common"))

app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'ejs')

// var pathh = path.resolve(__dirname, 'uploads')
// app.use(express.static(pathh))

app.use("/", UserRoute)
app.use("/", AuthRoute)
app.use("/",  UploadRoute)


app.listen(8800, ()=>{
    console.log('server 8800da ishladi')
})