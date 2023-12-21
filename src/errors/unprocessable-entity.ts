import { Response } from 'express';

function unprocessableEntity(response: Response, message?: string) {
  const messageToSend = message 
    ? message 
    : 'Unprocessable Entity';

  response.status(422)
    .send(messageToSend);
}

export default unprocessableEntity;
