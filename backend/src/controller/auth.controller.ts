import { asyncHandler } from "../utils/asyncHandler";
import { SignupSchema } from "../schema/SignupSchema";
import formatValidationErrors from "../utils/formatValidationErrors";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import UserRepository from "../repositories/user.repository";
import {  IDbUser } from "../types";
import bcryptjs from "bcryptjs";
import { generateVerificationCode } from "../utils/VerificationCode";

const userRepository = new UserRepository();

export const signup = asyncHandler(async (req, res) => {
    const result = SignupSchema.safeParse(req.body);
    if (!result.success) {
        const errors = formatValidationErrors(result.error);
        throw new ApiError(400, "Validation Error", errors);
    }

    const { name, email, username, password } = result.data;

    // Check if username is already in use
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername.isVerified === true) {
        throw new ApiError(400, "Username is already taken");
    }

    // Check if email is already in use
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser && existingUser.isVerified) {
        throw new ApiError(400, "Email is already registered and verified");
    }

    const verificationCode = generateVerificationCode();
    const hashedPassword = await bcryptjs.hash(password, 10);

    let user: IDbUser;
    let isUpdate = false;

    if (existingUser) {

        user = await userRepository.updateUser(existingUser.id, {
            name,
            username,
            password: hashedPassword,
            verificationCode,
        }) as IDbUser;
        isUpdate = true;
    } else {

        user = await userRepository.create({
            name,
            email,
            username,
            password: hashedPassword,
            isVerified: false,
            verificationCode,
        }) as IDbUser;
    }

    const sanitizedUser = sanitizeUser(user);
    res.status(isUpdate ? 200 : 201).json(new ApiResponse(sanitizedUser));
});

// Function to sanitize user object
function sanitizeUser(user: IDbUser) {
    const { password, verificationCode, ...sanitized } = user;
    return sanitized;
}
