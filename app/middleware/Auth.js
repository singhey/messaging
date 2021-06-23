import { verify } from 'jsonwebtoken'
import { createToken } from './token';
import dotenv from 'dotenv'
dotenv.config()

const User = {}

function setToken(res, accessToken, refreshToken){
  res.set({
    accessToken,
    refreshToken
  })
}

export default  async (req, res, next) => {
  const accessToken = req.headers['authorization'] || req.body.authorization
  const refreshToken = req.headers['refreshtoken'] || req.body.refreshToken
//   console.log(accessToken, refreshToken)
  if(!accessToken){
    return next()
  }
  //console.log(accessToken, refreshToken)
  try{
    const token = accessToken.split(" ")[1]
    const data = verify(token, process.env.ACCESS_KEY_SECRET)
    req.user = {
      ...data,
      token
    }
    return next()
  }catch(err){
    // console.log(err)
  }
  //console.log(req.headers, res.headersSent)
  if(!refreshToken){
    return next()
  }
  //console.log("Refresh token found")
  let data = ""
  try{
    data = verify(refreshToken, process.env.REFRESH_KEY_SECRET)
  }catch{
    return next()
  }

  const user = await User.findOne(data.userId)
  if(!user){
    return next()
  }
  const tokens = createToken(user);
  setToken(res, tokens.accessToken, tokens.refreshToken)
  req.user = {id: user._id, role: user.role}
  res.append('accesstoken', tokens.accessToken)
  res.append('refreshtoken', tokens.refreshToken)
  //console.log(res)
  next()
}