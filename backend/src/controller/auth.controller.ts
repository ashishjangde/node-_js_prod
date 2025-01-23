import { asyncHandler } from "../utils/asyncHandler";
import { SignupSchema } from "../schema/SignupSchema";
import formatValidationErrors from "../utils/formatValidationErrors";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import UserRepository from "../repositories/user.repository";
import { IUser } from "../types";
import bcryptjs from "bcryptjs";
import { generateVerificationCode } from "../utils/VerificationCode";
import { JwtService } from "../utils/JwtService";
import { VerifyUserSchema } from "../schema/VerifyUserSchema";

const userRepository = new UserRepository();

function sanitizeUser(user: IUser) {
    const { password, verificationCode, ...sanitized } = user;
    return sanitized;
}

export const signup = asyncHandler(async (req, res) => {
    const result = SignupSchema.safeParse(req.body);
    if (!result.success) {
        const errors = formatValidationErrors(result.error);
        throw new ApiError(400, "Validation Error", errors);
    }

    const { name, email, username, password } = result.data;

    // Check if username is already in use
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername.isVerified) {
        throw new ApiError(400, "Username is already taken");
    }

    // Check if email is already in use
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser && existingUser.isVerified) {
        throw new ApiError(400, "Email is already registered and verified");
    }

    const verificationCode = generateVerificationCode();
    const hashedPassword = await bcryptjs.hash(password, 10);

    let user:IUser;
    let isUpdate = false;

    if (existingUser) {

        user = await userRepository.updateUser(existingUser.id, {
            name,
            username,
            password: hashedPassword,
            verificationCode,
        });
        isUpdate = true;
    } else {

        user = await userRepository.create({
            name,
            email,
            username,
            password: hashedPassword,
            isVerified: false,
            verificationCode,
        }) ;
    }

    const sanitizedUser = sanitizeUser(user);
    res.status(isUpdate ? 200 : 201).json(new ApiResponse(sanitizedUser));
});

export const verifyUser = asyncHandler(async (req, res) => {
    const result = VerifyUserSchema.safeParse(req.body);
    if (!result.success) {
        const errors = formatValidationErrors(result.error);
        throw new ApiError(400, "Validation Error", errors);
    }
    const { email, verificationCode } = result.data;

    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError(400, "Invalid verification code");
    }
    if (user.isVerified) {
        throw new ApiError(400, "User is already verified");
    }

    if (user.verificationCode !== verificationCode) {
        throw new ApiError(400, "Invalid verification code");
    }


    const updatedUser = await userRepository.updateUser(user.id, {
        isVerified: true,
        verificationCode: undefined,
    });

    const sanitizedUser = sanitizeUser(updatedUser);
    res.json(new ApiResponse(sanitizedUser));
});


export const login = asyncHandler(async (req, res) => {
    const result = SignupSchema.safeParse(req.body);
    if (!result.success) {
        const errors = formatValidationErrors(result.error);
        throw new ApiError(400, "Validation Error", errors);
    }

    const { email, password } = result.data;

    // Find the user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    };

    // Check if the user is verified
    if (!user.isVerified) {
        throw new ApiError(400, "User is not verified");
    };

    // Verify the password
    const isPasswordValid = await bcryptjs.compare(password, user.password!);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    };

    // Generate tokens
    const accessToken = JwtService.generateAccessToken(user);
    const refreshToken = JwtService.generateAccessToken(user);

    const sanitizedUser = sanitizeUser(user);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        path: "/",
        secure: true,
    }).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        secure: true,
    }).status(200).json(new ApiResponse(sanitizedUser));
});

export const logout = asyncHandler(async (req, res) => {

    res.clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse({
        message: "Logged out successfully"
    }));
});

export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized");
    }

    const payload = JwtService.verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(payload.id);
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const accessToken = JwtService.generateAccessToken(user);

    const sanitizedUser = sanitizeUser(user);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
    }).status(200).json(new ApiResponse(sanitizedUser));    

});