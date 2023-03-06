import { Request, Response } from 'express';
import { randomUUID, pbkdf2Sync } from "crypto";
import { PrismaClient } from "@prisma/client";
import { OTP_LENGTH, PASSWORD_DIGEST, PASSWORD_ITERATION, PASSWORD_KEY_LENGTH, PASSWORD_SALT } from '../../src/config';

const prisma = new PrismaClient();

const salt = PASSWORD_SALT || ''
const iterations = parseInt(PASSWORD_ITERATION || '')
const keyLength = parseInt(PASSWORD_KEY_LENGTH || '')
const digest = PASSWORD_DIGEST || ''
const otpLength = parseInt(OTP_LENGTH || '')


export const register = async (req: Request, res: Response) => {
    const { email, username, password, name } = req.body

    const existingUser = await prisma.users.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    })

    if (existingUser != null) {
        res.status(400).json({ "message": "User with this email or username already exists" });
        return;
    }

    try {
        await prisma.$transaction(async (prisma) => {
            const user = await prisma.users.create({
                data: {
                    id: randomUUID(),
                    email: email,
                    username: username,
                    name: name,
                    password: pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex'),
                    is_active: false
                }
            })

            const otp = await prisma.activations.create({
                data: {
                    id: randomUUID(),
                    user_id: user.id,
                    otp_code: generateOTP(),
                    is_used: false
                }
            })

            res.status(200).json({
                "message": "User successfully created",
                "data": {
                    "email": user.email,
                    "username": user.username,
                    "otp": otp.otp_code
                }
            })

        })
    } catch (err) {
        console.error(err);
        res.status(400).json({ "message": "User creation failed" })
    }
}

export const activateUser = async (req: Request, res: Response) => {
    const { usernameOrEmail, otp } = req.body
    const user = await prisma.users.findFirst({
        where: {
            AND: [
                {
                    OR: [
                        { username: String(usernameOrEmail) },
                        { email: String(usernameOrEmail) }
                    ]
                },
                {
                    is_active: false
                }
            ]

        }
    })
    if (!user) {
        return res.status(401).json({ "message": "user not found" })
    }

    const activation = await prisma.activations.findFirst({
        where: {
            AND: [
                { user_id: user.id },
                { otp_code: otp },
                { is_used: false }
            ]
        }
    })

    if (!activation) {
        return res.status(401).json({ "message": "OTP code is not valid" })
    }

    try {
        await prisma.$transaction(async (prisma) => {
            const updateUser = await prisma.users.update({
                where: {
                    username: user.username
                },
                data: {
                    is_active: true
                }
            })

            const deactiveToken = await prisma.activations.update({
                where: {
                    id: activation.id
                },
                data: {
                    is_used: true
                }
            })
            res.status(200).json({
                "message": "Activation succeed",
                "data": {
                    "email": user.email,
                    "username": user.username
                }
            })
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({ "message": "Activation failed" })
    }
}

export const login = async (req: Request, res: Response) => {
    const { usernameOrEmail, password } = req.body
    const user = await prisma.users.findFirst({
        where: {
            AND: [
                {
                    OR: [
                        { username: String(usernameOrEmail) },
                        { email: String(usernameOrEmail) }
                    ]
                },
                {
                    is_active: true
                }
            ]

        }
    })
    if (!user) {
        return res.status(401).json({ "message": "user not found" })
    }

    const key = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");

    if (key != user.password) {
        return res.status(401).json({ message: "Invalid email / username or password" });
    }

    res.status(200).json({ message: "Login successful" });
}

const generateOTP = (): string => {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    var counter = 0;
    while (counter < otpLength) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}