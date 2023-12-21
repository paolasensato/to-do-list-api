import { Response } from 'express';

function notFoundError(response: Response, message?: string) {
  const errorMessage = message || 'Not found';

  response.status(404)
    .send({ 404: errorMessage });
}

export default notFoundError;
