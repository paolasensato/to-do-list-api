import { Response } from 'express';

function badRequestError(response: Response, message?: string) {
  const errorMessage = message || 'Not found';

  response.status(400)
    .send( errorMessage );
}

export default badRequestError;
