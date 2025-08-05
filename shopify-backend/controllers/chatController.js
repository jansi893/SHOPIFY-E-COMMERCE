import Chat from "../models/Chat.js";
import User from '../models/User.js';



export const getChats = async (req, res) => {
    const chats = await Chat.find({
        $or: [
            { sender: req.user._id ,
          receiver  : req.params.userId },
          { sender: req.params.userId ,
            receiver  : req.user._id }
        ]
    }).sort({createdAt : 1});

    res.status(200).json(chats);
}