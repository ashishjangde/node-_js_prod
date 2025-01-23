import jwt from 'jsonwebtoken';
import { IUser } from '../types';
import {IAccessTokenPayload} from '../types'
import {IRefreshTokenPayload} from '../types';

let SECRET: string =  "asdasd";  

export const JwtService = {

    generateAccessToken: (User: IUser) : string =>  {
        return jwt.sign(
        {
            id : User.id,
            email : User.email,
            username : User.username,
            isVerified : User.isVerified
        },
             SECRET,
        {
            expiresIn: '15m'
        });
    },

    generateRefreshToken: (User: IUser) : string => {
        return jwt.sign(
        {
            id : User.id,
        },
             SECRET,
        {
            expiresIn: '1y'
        });
    },

    verifyAccessToken: (token: string): IAccessTokenPayload => {
        try {
            return jwt.verify(token, SECRET) as IAccessTokenPayload;
        } catch (err) {
            throw new Error('Invalid or expired access token');
        }
    },

    verifyRefreshToken: (token: string): IRefreshTokenPayload => {
        try {
            return jwt.verify(token, SECRET) as IRefreshTokenPayload;
        } catch (err) {
            throw new Error('Invalid or expired refresh token');
        }
    },
 };