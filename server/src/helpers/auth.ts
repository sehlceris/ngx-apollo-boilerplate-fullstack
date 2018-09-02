import {UserModel, MessageModel} from '../models/index';
import * as jwt from 'jsonwebtoken';

export class AuthHelper {

  static signin(req, res) {
    UserModel.findOne({email: req.body.email}).then(function (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch) {
          const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY);
          res.status(200).json({
            userId: user.id,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
            token,
          });
        } else {
          res.status(400).json({message: 'Invalid Email/Password.'});
        }
      });
    }).catch(function (err) {
      res.status(400).json({message: 'Invalid Email/Password'});
    });
  }

  static signup(req, res, next) {
    UserModel.create(req.body).then(function (user) {
      let token = jwt.sign({userId: user.id}, process.env.SECRET_KEY);
      res.status(200).json({
        userId: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        token,
      });
    }).catch(function (err) {
      res.status(400).json(err);
    });
  }

}
