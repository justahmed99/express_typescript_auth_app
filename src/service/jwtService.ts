import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken } from 'src/dto/DecodedToken';
import { JWT_SECRET_KEY } from '../config';

const secretKey = JWT_SECRET_KEY || ''

export const generateToken = (username: string, email: string, name: string) => {
    const token = jwt.sign(
        {
            username: username,
            email: email,
            name: name
        },
        secretKey,
        {
            expiresIn: '1 days'
        })
    return token
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    console.log(`auth header ${authHeader}`)
    const token = authHeader && authHeader.toString().split(' ')[1]

    if (!token) {
        return res.sendStatus(401)
    }

    try {
        const decodedToken = jwt.verify(token, secretKey) as DecodedToken
        req.body.username = decodedToken.username
        req.body.email = decodedToken.email
        req.body.name = decodedToken.name
        req.body.iat = decodedToken.iat
        req.body.exp = decodedToken.exp

        next()
    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
}

export const getUserData = async (req: Request, res: Response) => {
    return res.status(200).json({
        "username": req.body.username,
        "email": req.body.email,
        "name": req.body.name,
        "iat": req.body.iat,
        "exp": req.body.exp
    })
}