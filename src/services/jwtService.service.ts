import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const generateToken = async (
  userId: string,
  email: string,
): Promise<string> => {
  const payload = { userId, email };
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secretKey || !expiresIn) {
    throw new Error(
      'JWT_SECRET and JWT_EXPIRES_IN must be set in environment variables',
    );
  }
  return await jwt.sign(payload, secretKey, { expiresIn: parseInt(expiresIn) });
};

export const verifyToken = async (
  token: string,
): Promise<JwtPayload | null> => {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error('JWT_SECRET must be set in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

export const validateTokenExpiration = async (
  token: string,
): Promise<{
  isValid: boolean;
  isExpired: boolean;
  payload?: JwtPayload;
  message: string;
}> => {
  if (!token) {
    return {
      isValid: false,
      isExpired: false,
      message: 'No token provided',
    };
  }

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return {
      isValid: false,
      isExpired: false,
      message: 'JWT secret not configured',
    };
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    return {
      isValid: true,
      isExpired: false,
      payload: decoded,
      message: 'Token is valid',
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        isValid: false,
        isExpired: true,
        message: 'Token has expired',
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        isValid: false,
        isExpired: false,
        message: 'Invalid token',
      };
    }

    return {
      isValid: false,
      isExpired: false,
      message: 'Token validation failed',
    };
  }
};

export const checkTokenStatus = async (
  token: string,
): Promise<{
  status: 'valid' | 'expired' | 'invalid';
  timeUntilExpiry?: number;
  payload?: JwtPayload;
}> => {
  const validation = await validateTokenExpiration(token);

  if (!validation.isValid) {
    return {
      status: validation.isExpired ? 'expired' : 'invalid',
    };
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = validation.payload?.exp
    ? validation.payload.exp - currentTime
    : 0;

  return {
    status: 'valid',
    timeUntilExpiry: Math.max(0, timeUntilExpiry),
    payload: validation.payload,
  };
};
