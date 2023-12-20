import 'dotenv/config';
import express from './express';

const serverPort = process.env.PORT;

express.listen(serverPort);

console.info(`Server started on: localhost:${serverPort}`);
