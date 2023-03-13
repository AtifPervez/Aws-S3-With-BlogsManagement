const express=require('express')
const router=require('./router/route')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const app=express()

app.use(bodyParser.json())
mongoose.connect('mongodb+srv://atifpervez:34BmDa5XVvtznQvO@code.8mvlc.mongodb.net/blogManagement')
.then(()=>console.log("mongoDb is connected"))
.catch((err)=>console.log(err))
app.use('/',router)

app.listen(3000,()=>console.log("Express server is running on port",3000))



