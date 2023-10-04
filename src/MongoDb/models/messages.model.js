import { Schema, model } from "mongoose";

const messageColl = 'messages';

const messageSchema = new Schema({
    user: String,
    message: String,
});

const MessageModel = model(messageColl, messageSchema);

export default MessageModel;
