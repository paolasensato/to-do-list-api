import { Response } from 'express';

function forbiddenError(response: Response, message?: string) {
  const errorMessage = message 
    ? message 
    : 'Forbidden';

  response.status(412)
    .send({ 403: errorMessage });
}

export default forbiddenError;