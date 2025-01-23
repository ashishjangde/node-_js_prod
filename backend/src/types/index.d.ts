export interface IUser {
    id: string;
    name: string;
    email: string;
    username: string;
    password: string | null;
    isVerified: boolean;
    verificationCode: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface IAccessTokenPayload {
    id: string;
    username: string;
    isVerified: boolean;
}

// Payload for Refresh Token
export interface IRefreshTokenPayload {
    id: string;
}

interface IDbUser{
    name: string;
    email: string;
    username: string;
    password: string ;
    isVerified: boolean;
    verificationCode: string;
}