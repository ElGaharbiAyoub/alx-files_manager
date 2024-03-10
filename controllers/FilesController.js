import { ObjectID } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(req, res) {
    // eslint-disable-next-line object-curly-newline
    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    const token = req.header('x-token');

    // Retrieve the user based on the token
    const userAuth = await redisClient.get(`auth_${token}`);
    if (!userAuth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || (type !== 'folder' && type !== 'file' && type !== 'image')) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId !== 0) {
      const parentFile = await dbClient.db
        .collection('files')
        .findOne({ _id: ObjectID(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const fileId = uuidv4();
    const file = {
      name,
      type,
      parentId,
      isPublic,
      userId: userAuth,
    };

    // Get the storing folder path from environment variable
    const storingFolderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    // Create the storing folder if it doesn't exist
    if (!fs.existsSync(storingFolderPath)) {
      fs.mkdirSync(storingFolderPath, { recursive: true });
    }

    // Create a local path with filename as UUID
    const localPath = path.join(storingFolderPath, `${fileId}`);

    // Store the file in clear in the local path
    if (type === 'file' || type === 'image') {
      const fileData = Buffer.from(data, 'base64');
      fs.writeFileSync(localPath, fileData);
      file.localPath = localPath;
    }

    // Add the new file document in the collection files
    const fileInst = await dbClient.db.collection('files').insertOne(file);

    return res.status(201).json({
      id: fileInst.insertedId,
      userId: userAuth,
      name,
      type,
      isPublic,
      parentId,
    });
  }

  static async getShow(req, res) {
    const fileId = req.params.id;
    const token = req.header('x-token');

    // Retrieve the user based on the token
    const userAuth = await redisClient.get(`auth_${token}`);
    if (!userAuth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = await dbClient.db
      .collection('files')
      .findOne({ _id: ObjectID(fileId), userId: userAuth });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static async getIndex(req, res) {
    const token = req.header('x-token');

    // Retrieve the user based on the token
    const userAuth = await redisClient.get(`auth_${token}`);
    if (!userAuth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log(userAuth);
    const { parentId = 0, page = 0 } = req.query;
    const limit = 20;
    const skip = page * limit;
    const query = { parentId, userId: userAuth };

    const files = await dbClient.db
      .collection('files')
      .aggregate([
        {
          $match: query,
        },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();
    console.log(files);

    return res.status(200).json(files);
  }
}
export default FilesController;
