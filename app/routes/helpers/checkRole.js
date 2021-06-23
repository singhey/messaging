const rolesValue = {
    ADMIN: 1,
    USER: 2,
    BLOGGER: 3
  }
  
  const checkRole = (req, roles) => {
    if(!req.user){
      throw new Error("Please login to send message")
    }
    let grant = false
    // console.log(roles, roles.length)
    for(let i = 0; i < roles.length; i++){
      // console.log(rolesValue[roles[i]], req.user.role)
      if(rolesValue[roles[i]] === req.user.role){
        grant = true
        break
      }
    }
    if(!grant){
      throw new Error("Access is not granted")
    }
  }
  
  export default checkRole