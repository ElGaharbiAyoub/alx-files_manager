import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });
    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) return res.status(400).send({ error: 'Already exist' });
    const hashPassword = sha1(password);
    const result = await dbClient.db
      .collection('users')
      .insertOne({ email, password: hashPassword });
    const user = { id: result.insertedId, email };
    return res.status(201).send(user);
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).send({ error: 'Unauthorized hhhhh' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized ddddd' });
    const user = await dbClient.db.collection('users').findOne({ _id: userId });
    if (!user) return res.status(401).send({ error: 'Unauthorized uuuu' });
    return res.status(200).send({ id: user._id, email: user.email });
  }
}
export default UsersController;
