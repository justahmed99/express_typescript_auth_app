import { generateToken } from './../service/jwtService';
import { findUserByEmailOrUsername, createNewUser, findNonActiveUserByEmailOrUsername, findActiveUserByEmailOrUsername, getActivationCode, markUsedOTP, verifyPassword } from './../repository/userRepository';
import { Request, Response } from 'express';

export const hello = async (req: Request, res: Response) => {
    res.json({
        "message": "Hello World! Welcome to the auth app template!"
    })
}

export const register = async (req: Request, res: Response) => {
    const { email, username, password, name } = req.body

    const existingUser = await findUserByEmailOrUsername(email, username)

    if (existingUser != null) {
        res.status(400).json({ "message": "User with this email or username already exists" });
        return;
    }

    try {
        const user = await createNewUser(email, username, name, password)
        res.status(200).json({
            "message": "User successfully created",
            "data": user
        })

    } catch (err) {
        console.error(err);
        res.status(400).json({ "message": "User creation failed" })
    }
}

export const activateUser = async (req: Request, res: Response) => {
    const { usernameOrEmail, otp } = req.body

    const user = await findNonActiveUserByEmailOrUsername(usernameOrEmail, usernameOrEmail)
    if (!user) {
        return res.status(401).json({ "message": "user not found" })
    }

    const activation = await getActivationCode(user.id, otp)
    if (!activation) {
        return res.status(401).json({ "message": "OTP code is not valid" })
    }

    try {
        const useOtp = await markUsedOTP(user.username, activation.id)
        res.status(200).json({
            "message": "Activation succeed",
            "data": useOtp
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({ "message": "Activation failed" })
    }
}

export const login = async (req: Request, res: Response) => {
    const { usernameOrEmail, password } = req.body
    const user = await findActiveUserByEmailOrUsername(usernameOrEmail, usernameOrEmail)
    if (!user) {
        return res.status(401).json({ "message": "user not found" })
    }

    const keyVerification: boolean = verifyPassword(password, user.password)
    if (keyVerification) {
        return res.status(401).json({ "message": "Invalid email / username or password" });
    }

    const token = generateToken(user.username, user.email, user.name)

    res.status(200).json({
        "message": "Login successful",
        "access_token": token
    });
}