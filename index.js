const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const cors = require('cors')
const Socket = require('socket.io')
const {signal} = require("nodemon/lib/config/defaults");

app.use(cors());
const io =  Socket(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})


io.on("connection", (socket) => {
    console.log(`Connect to ${socket.id}`)
    socket.emit("me", socket.id)

    socket.on("disconnect", () => {
        socket.broadcast.emit("call end")
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {signal: data.signal, from: data.from, name: data.name})
    })

    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("callAccept",data.signal);
    })

})


server.listen(3600, () => {
    console.log('Server is running on port 3600')
})