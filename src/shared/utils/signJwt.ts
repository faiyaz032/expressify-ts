import jwt from 'jsonwebtoken';
import config from '../../configs';

export interface IPayload {
  id: string;
  email: string;
  role: string;
}

export default function signJwt(payload: IPayload) {
  return jwt.sign(payload, config.get('jwtSecretKey'), {
    expiresIn: '24h',
  });
}
