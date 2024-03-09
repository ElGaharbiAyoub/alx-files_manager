import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      // eslint-disable-next-line comma-dangle
      'base64'
    ).toString('utf-8');
    const [email, password] = decodedCredentials.split(':');
    const hashedPassword = sha1(password);

    // Find the user associated with the email and hashed password
    const user = await dbClient.db.collection('users').findOne({
      email,
      password: hashedPassword,
    });
    if (user) {
      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.set(key, user._id.toString(), 86400);
      return res.status(200).send({ token });
    }
    return res.status(401).send({ error: 'Unauthorized' });
  }

  static async getDisconnect(req, res) {
    const token = req.header('x-token');
    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });
    await redisClient.del(`auth_${token}`);
    return res.status(204).send({});
  }
}

export default AuthController;
