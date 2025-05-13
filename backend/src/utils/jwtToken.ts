import jwt from "jsonwebtoken";

//define playload structure
type JwtPayload ={
    userId : number
}

//create JWT with user's id 
export const generateToken = (user: {id:number}) => {
    const secret = process.env.JWT_SECRET
    if(!secret){
        throw new Error('jwt_secret_key is not defined in environment variables')
    }
    return jwt.sign({userId: user.id},secret,{expiresIn:'1h'})
}

export const verifyToken = (token: string): JwtPayload | null => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  try {
    // jwt.verify returns "any" — we assert the expected payload shape
    return jwt.verify(token, secret) as JwtPayload
  } catch (error) {
    // If token is expired or invalid, return null
    return null
  }
}