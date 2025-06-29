import { LoginDto } from '../dtos/Login.dto';
import UserModel from '../models/User';
import { generateToken } from './jwtService.service';
import { RegisterDto } from '../dtos/Register.dto';
import * as bcrypt from 'bcryptjs';
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from '../exceptions/exceptions';

export const login = async (
  loginDto: LoginDto,
): Promise<{
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}> => {
  try {
    const { email, password } = loginDto;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid password');
    }

    const token = await generateToken(user._id.toString(), user.email);
    if (!token) {
      throw new Error('Token generation failed');
    }

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    console.error('Login error:', error);
    if (
      error instanceof ValidationError ||
      error instanceof NotFoundError ||
      error instanceof UnauthorizedError
    ) {
      throw error;
    }
    throw new Error('Login failed');
  }
};

export const register = async (
  registerDto: RegisterDto,
): Promise<{
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}> => {
  try {
    const { username, email, password } = registerDto;

    if (!username || !email || !password) {
      throw new ValidationError('Username, email, and password are required');
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictError(
        'User with this email or username already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const token = await generateToken(newUser._id.toString(), newUser.email);

    if (!token) {
      throw new Error('Token generation failed');
    }

    return {
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      },
      token,
    };
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof ValidationError || error instanceof ConflictError) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      throw new ConflictError(
        'User with this email or username already exists',
      );
    }
    throw new Error('Registration failed');
  }
};

export const forgotPassword = async (
  email: string,
): Promise<{ message: string }> => {
  try {
    if (!email) {
      throw new ValidationError('Email is required');
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const token = await generateToken(user._id.toString(), user.email);
    if (!token) {
      throw new Error('Token generation failed');
    }
    //send the token to the user's email
    console.log(`Password reset token for ${email}: ${token}`);

    return { message: 'Password reset link sent to your email' };
  } catch (error) {
    console.error('Forgot password error:', error);
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    throw new Error('Forgot password failed');
  }
};

const comparePassword = async (password: string, candidatePassword: string) => {
  try {
    return await bcrypt.compare(password, candidatePassword);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw new Error('Password comparison failed');
  }
};
