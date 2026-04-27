import jwt from 'jsonwebtoken'
import userModel from '../models/usersModel.js'

const generateRefreshToken = async (userId)=>{
    const token = await jwt.sign(
        {
            id:userId,
        },
        process.env.SECRET_KEY_ACCESS_TOKEN,
        {
            expiresIn: '7d'
        }
    )

    const updateRefreshTokenUser = await userModel.updateOne(
        {_id:userId},
        {
            refresh_token: token
        }
    )
    return token
}

export default generateRefreshToken