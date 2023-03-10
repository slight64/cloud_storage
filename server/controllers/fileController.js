const fileService = require('../services/fileService');
const config = require('config');
const fs = require('fs');
const User = require('../models/User');
const File = require('../models/File');
const Uuid = require('uuid');

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findOne({ _id: parent });
      if (!parentFile) {
        file.path = name;
        await fileService.createDir(file);
      } else {
        file.path = `${parentFile.path}\\${file.name}`;
        await fileService.createDir(file);
        parentFile.childs.push(file._id);
        await parentFile.save();
      }
      await file.save();
      return res.json(file);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async deleteFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      if (!file) {
        return res.status(400).json({ message: 'file not found' });
      }
      fileService.deleteFile(file);
      await file.remove();
      return res.json({ message: 'file was deleted' });
    } catch (error) {
      return res.status(400).json({ message: 'dir is not empty' });
    }
  }

  async getFiles(req, res) {
    try {
      const { sort } = req.query;
      let files;
      switch (sort) {
        case 'name':
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ name: 1 });
          break;
        case 'type':
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ type: 1 });
          break;
        case 'date':
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ date: 1 });
          break;
        default:
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          });
          break;
      }
      // const files = await File.find({

      //   user: req.user.id,
      //   parent: req.query.parent,
      // });
      return res.json(files);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Can not get files' });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;

      const parent = await File.findOne({
        user: req.user.id,
        _id: req.body.parent,
      });
      const user = await User.findOne({ _id: req.user.id });
      console.log('DIsk space', user.usedSpace);
      console.log('DIsk file.size', file.size);
      if (user.usedSpace + file.size > user.diskSpace || file.size === 0) {
        return res.status(400).json({
          message:
            'No space on the disk or file size bigger than avaliable space',
        });
      }

      user.usedSpace = user.usedSpace + file.size;
      // "dbUrl": "mongodb+srv://slight64:Granata0723@photoplanner.ot4w93y.mongodb.net/?retryWrites=true&w=majority",
      let path;
      if (parent) {
        path = `${config.get('filePath')}\\${user._id}\\${parent.path}\\${
          file.name
        }`;
      } else {
        path = `${config.get('filePath')}\\${user._id}\\${file.name}`;
      }

      if (fs.existsSync(path)) {
        return res.status(400).json({ message: 'File already exist' });
      }
      file.mv(path);

      const type = file.name.split('.').pop();
      let filePath = file.name;
      if (parent) {
        filePath = parent.path + '\\' + file.name;
      }
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: filePath,
        parent: parent?._id,
        user: user._id,
      });

      await dbFile.save();
      await user.save();

      res.json(dbFile);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Upload error' });
    }
  }

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      const path = fileService.getPath(file);
      if (fs.existsSync(path)) {
        return res.download(path, file.name);
      }
      return res.status(400).json({ message: 'download error' });
    } catch (error) {
      return res.status(500).json({ message: 'Download error' });
    }
  }

  async searchFiles(req, res) {
    try {
      const searchName = req.query.search;
      let files = await File.find({ user: req.user.id });
      files = files.filter((file) => file.name.includes(searchName));
      return res.json(files);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'search error' });
    }
  }

  async uploadAvatar(req, res) {
    try {
      const file = req.files.file;
      const user = await User.findById(req.user.id);
      const avatarName = Uuid.v4() + '.jpg';
      file.mv(config.get('staticPath') + '\\' + avatarName);
      user.avatar = avatarName;
      await user.save();
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ message: 'Upload avatar error' });
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.user.id);
      fs.unlinkSync(config.get('staticPath') + '\\' + user.avatar);
      user.avatar = null;
      await user.save();
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ message: 'Delete avatar error' });
    }
  }
}

module.exports = new FileController();
