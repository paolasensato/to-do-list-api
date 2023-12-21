declare namespace Express {
    interface Request {
        user: import('../domains/users/model').default;
    }
}
