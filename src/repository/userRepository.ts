import { PrismaClient } from '@prisma/client';
import { pbkdf2Sync, randomUUID } from 'crypto';
import { OTP_LENGTH, PASSWORD_DIGEST, PASSWORD_ITERATION, PASSWORD_KEY_LENGTH, PASSWORD_SALT } from '../../src/config';


const prisma = new PrismaClient();

const salt = PASSWORD_SALT || ''
const iterations = parseInt(PASSWORD_ITERATION || '')
const keyLength = parseInt(PASSWORD_KEY_LENGTH || '')
const digest = PASSWORD_DIGEST || ''
const otpLength = parseInt(OTP_LENGTH || '')

export const findUserByEmailOrUsername = async (email: string, username: string) => {
    return await prisma.users.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    })
}

export const findNonActiveUserByEmailOrUsername = async (email: string, username: string) => {
    return await prisma.users.findFirst({
        where: {
            AND: [
                {
                    OR: [
                        { username: String(username) },
                        { email: String(email) }
                    ]
                },
                {
                    is_active: false
                }
            ]

        }
    })
}

export const findActiveUserByEmailOrUsername = async (email: string, username: string) => {
    return await prisma.users.findFirst({
        where: {
            AND: [
                {
                    OR: [
                        { username: String(username) },
                        { email: String(email) }
                    ]
                },
                {
                    is_active: true
                }
            ]

        }
    })
}

export const createNewUser = async (email: string, username: string, name: string, password: string) => {
    return await prisma.$transaction(async (prisma) => {
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

        return {
            "email": user.email,
            "username": user.username,
            "otp": otp.otp_code

        }

    })
}

export const getActivationCode = async (userId: string, otp: string) => {
    return await prisma.activations.findFirst({
        where: {
            AND: [
                { user_id: userId },
                { otp_code: otp },
                { is_used: false }
            ]
        }
    })
}

export const markUsedOTP = async (username: string, tokenId: string) => {
    return await prisma.$transaction(async (prisma) => {
        const updateUser = await prisma.users.update({
            where: {
                username: username
            },
            data: {
                is_active: true
            }
        })

        const deactiveToken = await prisma.activations.update({
            where: {
                id: tokenId
            },
            data: {
                is_used: true
            }
        })
        return {
            "email": updateUser.email,
            "username": updateUser.username
        }
    })
}

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
    const key = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");
    return key == hashedPassword
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