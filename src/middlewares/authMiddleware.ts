import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../domains/users/model';
import notFoundError from '../errors/not-found-error';

interface DecodePayload {
    user: User,
    string: string,
    jwt: jwt.JwtPayload
}

async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  try {
    const { headers } = request;
    const token = headers.authorization;
    const jwtKey = process.env.JWT_SECRET_KEY;

    if (!token) {
      return response.status(401)
        .send({ message: 'Você não tem autorização para essa operação!' });
    }

    const tokenReplaced = token.replace('Bearer ', '');

    return jwt.verify(tokenReplaced, jwtKey!, async (error, decoded) => {
      if (error) return next(error);

      const { user } = decoded as DecodePayload;

      const existingUser = await User.query()
        .findById(user.id)
        .where('status', true);

      if (!existingUser) return notFoundError(response);

      request.user = existingUser;
      next();
    });
  } catch (error) {
    next(error);
  }
}

export default authMiddleware;
