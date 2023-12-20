import { NextFunction, Request, Response } from 'express';
import { UserType, createUserSchema, loginSchema } from './validator';
import preconditionFailedError from '../../errors/precondition-failed-exception';
import usersErrors from './errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './model';
import forbiddenError from '../../errors/forbidden-error';


export async function alredyExistsEmail(email: string) {
  return User.query()
    .where('email', email)
    .where('status', true)
    .where('deleted_at', null)
    .resultSize();
}

async function createUser(request: Request, response: Response, next: NextFunction) {
  try {
    const { body } = request;

    const { error } = createUserSchema.validate(body);
    
    if (error) return preconditionFailedError(response, error.details[0].message);

    if (body.user_type === UserType.ADMINISTRATOR) {
      return response.status(403)
        .send({ 403: 'Você não tem permissão para essa operação' });
    }

    const existsEmail = await alredyExistsEmail(body.email);

    if (existsEmail) {
      return response.status(412).send(usersErrors.duplicatedEmail);
    }

    const user = await User.query().insertAndFetch(body);

    return response.status(200)
      .json(user);
  } catch (error: any) {
    next(error);
  }
}

async function login(request: Request, response: Response, next: NextFunction) {
  try {
    const { body } = request;
    const { error } = loginSchema.validate(body);

    if (error) return preconditionFailedError(response, error.details[0].message);

    const user = await User.query()
      .where('email', body.email)
      .where('status', true)
      .where('deleted_at', null)
      .first();

    if (!user || !bcrypt.compareSync(String(body.password), user.password)) {
      return forbiddenError(response, 'Credênciais Inválidas!');
    }

    const token = jwt.sign({ user }, String(process.env.JWT_SECRET_KEY), { expiresIn: process.env.AUTH_TOKEN_EXPIRES });

    return response.json({
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  createUser,
  login
};