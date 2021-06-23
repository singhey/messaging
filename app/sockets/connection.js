

const connection = (soc) => {
    console.log("User connected")
    const userId = soc.handshake.query.clientId
    console.log(soc.handshake.query.clientId)
    soc.join(userId)
    // users.push(userId)
    soc.on("message", (data) => {
      console.log(data)
      soc.to(data.toUser).emit('message', data)
    })
  
    soc.on('disconnect', () => {
      console.log("User disconnected")
    })
}

module.exports = connection