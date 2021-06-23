import { sign } from 'jsonwebtoken'

export const createToken = user => {
  //console.log(process.env)
  const accessToken = sign({id: user._id, role: user.role}, process.env.ACCESS_KEY_SECRET, {expiresIn: "180d"})
  const refreshToken = sign({id: user._id, role: user.role, count: user.count || 1}, process.env.REFRESH_KEY_SECRET, {expiresIn: "180d"})

  return  {accessToken, refreshToken}
}