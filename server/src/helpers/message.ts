import {UserModel, MessageModel} from '../models/index';

export class MessageHelper {
  static createMessage(req, res, next) {
    const newMessage = {
      text: req.body.text,
      userId: req.params.id,
    };

    MessageModel.create(newMessage).then(function (message) {
      UserModel.findById(req.params.id).then(function (user) {
        user.messages.push(message.id);
        user.save().then(function (user) {
          return MessageModel.findById(message._id)
            .populate('userId', {
              username: true,
              profileImageUrl: true,
            });
        }).then(function (m) {
          return res.status(200).json(m);
        }).catch(next);
      }).catch(next);
    }).catch(next);
  }

  static getAllMessages(req, res, next) {
    MessageModel.find()
      .populate('userId', {
        username: true,
        profileImageUrl: true,
      })
      .then(function (messages) {
        return res.status(200).json(messages);
      })
      .catch(function (err) {
        res.status(500).json(err);
      });
  }
}
