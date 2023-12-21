import bodyParser from 'body-parser';
import Model from './objection';
import express, { Request, Response } from 'express';
import cors from 'cors';

import users from './domains/users/routes';
import categories from './domains/categories/routes';
import lists from './domains/lists/routes';

const app = express();

Model;

app.use(cors({ credentials: true, origin: '*' }));
app.use(bodyParser.json());

// Routes
app.get('/', (_request: Request, response: Response) => { response.send('Caminho base'); });

app.use('/users', users);

app.use('/categories', categories);

app.use('/lists', lists);

export default app;
