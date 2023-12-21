import { Response } from 'express';

function preconditionFailedError(response: Response, message?: string) {
  const messageToSend = message 
    ? message 
    : 'Preconditional failed error';

  response.status(412)
    .send(messageToSend );
}

export default preconditionFailedError;
